import React, { useEffect, useRef, useState } from "react";
import "./EMLab.css";

const W = 1100;
const H = 820;

export default function AtomExperiment() {
  const canvasRef = useRef(null);
  const [energy, setEnergy] = useState(0.2);

  const excitation = useRef(0); // 0 → 1 smooth excitation
  const photonState = useRef("idle"); // idle | incoming | outgoing
  const photonT = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let raf;

    const cx = W / 2;
    const cy = H / 2;

    const levels = [
      { r: 90, label: "E₀", count: 2 },
      { r: 150, label: "E₁", count: 4 },
      { r: 220, label: "E₂", count: 6 },
    ];

    function clear() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    /* ================= NUCLEUS ================= */
    function drawNucleus() {
      ctx.save();
      ctx.translate(cx, cy);

      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#ff4444";
      ctx.shadowBlur = 35;
      ctx.shadowColor = "#ff4444";
      ctx.fill();
      ctx.shadowBlur = 0;

      const nucleons = [
        [-8, -6, "#ff5555"], [6, -8, "#ccc"],
        [-6, 8, "#ccc"], [8, 6, "#ff5555"],
        [0, 0, "#ff5555"]
      ];

      nucleons.forEach(([x, y, c]) => {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });

      ctx.restore();
    }

    /* ================= ORBITS ================= */
    function drawOrbit(r, label) {
      ctx.strokeStyle = "rgba(120,200,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#aaa";
      ctx.font = "14px monospace";
      ctx.fillText(label, cx + r + 8, cy);
    }

    /* ================= ELECTRONS ================= */
    function drawElectrons(level, idx) {
      const baseR = levels[idx].r;
      const nextR = levels[idx + 1]?.r ?? baseR;

      const r =
        idx === 0
          ? baseR + excitation.current * (nextR - baseR)
          : baseR;

      for (let i = 0; i < level.count; i++) {
        const phase = (i / level.count) * Math.PI * 2;
        const a = t * (0.02 + idx * 0.01) + phase;

        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#00eaff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    /* ================= PHOTON WAVES ================= */
    function drawPhotonWave(xStart, dir = 1) {
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < 80; i++) {
        const x = xStart + dir * i * 6;
        const y = cy + Math.sin(i * 0.5 + photonT.current * 0.4) * 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    /* ================= LOOP ================= */
    function loop() {
      clear();

      levels.forEach(l => drawOrbit(l.r, l.label));
      drawNucleus();

      // Excitation logic (smooth)
      if (energy > 0.6 && excitation.current < 1) {
        excitation.current += 0.01;
        photonState.current = "incoming";
      } else if (energy < 0.4 && excitation.current > 0) {
        excitation.current -= 0.01;
        photonState.current = "outgoing";
      }

      excitation.current = Math.max(0, Math.min(1, excitation.current));

      // Draw electrons
      drawElectrons(levels[0], 0);
      drawElectrons(levels[1], 1);
      drawElectrons(levels[2], 2);

      // Photon visuals
      if (photonState.current === "incoming") {
        drawPhotonWave(cx - 320 + photonT.current);
        photonT.current += 4;
        if (photonT.current > 300) photonT.current = 0;
      }

      if (photonState.current === "outgoing") {
        drawPhotonWave(cx + photonT.current);
        photonT.current += 4;
        if (photonT.current > 320) photonState.current = "idle";
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
        <div className="label">EXCITATION ENERGY</div>
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
          Gradual excitation with multiple electrons
        </div>
      </div>
    </div>
  );
}
