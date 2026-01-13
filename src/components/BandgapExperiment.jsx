import React, { useEffect, useRef, useState } from "react";
import "./EMLab.css";

const W = 1100;
const H = 820;

export default function BandGapExperiment() {
  const canvasRef = useRef(null);
  const [energy, setEnergy] = useState(0.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let raf;

    function clear() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    /* ================= ENERGY LEVEL ================= */
    function drawEnergyLevel(y, label, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, y);
      ctx.lineTo(800, y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "18px monospace";
      ctx.fillText(label, 820, y + 6);
    }

    /* ================= ELECTRON ================= */
    function drawElectron(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#00eaff";
      ctx.shadowColor = "#00eaff";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ================= OUTGOING WAVES ================= */

    // Outgoing vertical wave (radiating upward)
    function drawOutgoingVerticalWave(x0, y0) {
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < 80; i++) {
        const x =
          x0 + Math.sin(i * 0.4 + t * 0.5) * 6;
        const y =
          y0 -
          i * 6 +
          Math.sin(i * 0.6 + t * 0.4) * 6;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Outgoing diagonal wave
    function drawOutgoingDiagonalWave(x0, y0) {
      ctx.strokeStyle = "#ffcc88";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < 80; i++) {
        const x =
          x0 +
          i * 6 +
          Math.sin(i * 0.5 + t * 0.4) * 6;
        const y =
          y0 -
          i * 5 +
          Math.sin(i * 0.6 + t * 0.4) * 6;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function loop() {
      clear();

      /* === ENERGY LEVEL POSITIONS === */
      const E0 = H / 2 + 160; // Valence band
      const E1 = H / 2 + 80;  // Intermediate
      const E2 = H / 2 - 120; // Conduction band

      drawEnergyLevel(E0, "E₀ (Valence)", "#5bc0ff");
      drawEnergyLevel(E1, "E₁", "#7fd1ff");
      drawEnergyLevel(E2, "E₂ (Conduction)", "#ff7676");

      /* === BAND GAP MARKER === */
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(550, E1);
      ctx.lineTo(550, E2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#aaa";
      ctx.font = "15px monospace";
      ctx.fillText("Eg", 565, (E1 + E2) / 2);

      /* === ELECTRON LEVEL === */
      let y;
      if (energy < 0.33) y = E0;
      else if (energy < 0.66) y = E1;
      else y = E2;

      const ex = 420 + (t % 240);
      drawElectron(ex, y + Math.sin(t * 0.08) * 5);

      /* === TRANSITION ARROW (UNCHANGED) === */
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(650, E0);
      ctx.lineTo(650, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(645, y - 10);
      ctx.lineTo(650, y);
      ctx.lineTo(655, y - 10);
      ctx.stroke();

      /* === OUTGOING WAVES FOR ALL BANDS === */

      // E0 → E1
      if (energy >= 0.33) {
        drawOutgoingVerticalWave(650, E1);
        drawOutgoingDiagonalWave(650, E1);
      }

      // E1 → E2
      if (energy >= 0.66) {
        drawOutgoingVerticalWave(650, E2);
        drawOutgoingDiagonalWave(650, E2);
      }

      t++;
      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(raf);
  }, [energy]);

  return (
    <div className="lab-canvas-wrap">
      <canvas ref={canvasRef} width={W} height={H} />

      <div className="cinema-energy">
        <div className="label">INPUT ENERGY</div>
        <div className="value">{energy.toFixed(2)}</div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={energy}
          onChange={(e) => setEnergy(+e.target.value)}
        />

        <div className="panel-hint">
          Arrow = electronic transition  
          <br />
          Waves = photons radiating outward
        </div>
      </div>
    </div>
  );
}


