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
      ctx.clearRect(0, 0, W, H);
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
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      clear();

      /* === ENERGY LEVEL POSITIONS === */
      const E0 = H / 2 + 160; // ground state
      const E1 = H / 2 + 80;  // excited (valence top)
      const E2 = H / 2 - 120; // conduction band

      /* === DRAW LEVELS === */
      drawEnergyLevel(E0, "E₀ (Ground State)", "#5bc0ff");
      drawEnergyLevel(E1, "E₁ (Excited State)", "#7fd1ff");
      drawEnergyLevel(E2, "E₂ (Conduction Band)", "#ff7676");

      /* === BAND GAP === */
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(550, E1);
      ctx.lineTo(550, E2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("Band Gap (Eg)", 565, (E1 + E2) / 2);

      /* === ELECTRON STATE SELECTION === */
      let y;
      if (energy < 0.33) y = E0;
      else if (energy < 0.66) y = E1;
      else y = E2;

      const x = 350 + (t % 300);
      drawElectron(x, y + Math.sin(t * 0.1) * 6);

      /* === TRANSITION ARROW === */
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
          onChange={e => setEnergy(+e.target.value)}
        />

        <div className="panel-hint">
          E₀ → E₁ → E₂ transition
        </div>
      </div>
    </div>
  );
}
