import React, { useEffect, useRef, useState } from "react";
import "./EMLab.css";

const W = 1100;
const H = 820;

export default function AtomExperiment() {
  const canvasRef = useRef(null);

  const [energy, setEnergy] = useState(0.3);
  const [view3D, setView3D] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let raf;

    function clear() {
      ctx.clearRect(0, 0, W, H);
    }

    /* ================= NUCLEUS ================= */
    function drawNucleus(cx, cy) {
      const particles = [
        { x: -8, y: -6, type: "p" },
        { x: 8, y: -6, type: "n" },
        { x: -6, y: 8, type: "n" },
        { x: 6, y: 8, type: "p" },
        { x: 0, y: 0, type: "p" },
      ];

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.type === "p" ? "#ff4d4d" : "#aaaaaa";
        ctx.fill();
      });

      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.fillText("Nucleus (p⁺, n⁰)", cx - 55, cy + 38);
    }

    /* ================= ORBIT ================= */
    function drawOrbit(cx, cy, r, tilt, label) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);
      ctx.strokeStyle = "rgba(120,200,255,0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#aaa";
      ctx.font = "14px monospace";
      ctx.fillText(label, cx + r + 10, cy + 4);
    }

    /* ================= ELECTRON ================= */
    function drawElectron(cx, cy, r, speed, tilt, phase = 0, color = "#00eaff") {
      const a = t * speed + phase;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a) * tilt;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      clear();

      const cx = W / 2;
      const cy = H / 2;

      /* === SHELL DEFINITIONS === */
      const shells = [
        { r: 90, label: "n = 1", tilt: view3D ? 0.5 : 1 },
        { r: 150, label: "n = 2", tilt: view3D ? 0.7 : 1 },
        { r: 220, label: "n = 3", tilt: view3D ? 0.9 : 1 },
      ];

      shells.forEach(s =>
        drawOrbit(cx, cy, s.r, s.tilt, s.label)
      );

      drawNucleus(cx, cy);

      /* === FIXED ELECTRONS (n = 2) === */
      drawElectron(cx, cy, shells[1].r, 0.03, shells[1].tilt, 0);
      drawElectron(cx, cy, shells[1].r, 0.03, shells[1].tilt, Math.PI);

      /* === FIXED ELECTRONS (n = 3) === */
      drawElectron(cx, cy, shells[2].r, 0.02, shells[2].tilt, 0.5);
      drawElectron(cx, cy, shells[2].r, 0.02, shells[2].tilt, Math.PI + 0.5);

      /* === ACTIVE ELECTRON (EXCITATION) === */
      const activeShell =
        energy < 0.33 ? shells[0] :
        energy < 0.66 ? shells[1] :
        shells[2];

      drawElectron(
        cx,
        cy,
        activeShell.r,
        0.05 + energy * 0.04,
        activeShell.tilt,
        0,
        "#ffd700"
      );

      /* === TRANSITION ARROW === */
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#ffd700";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - activeShell.r);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ffd700";
      ctx.fillText(
        view3D ? "Pseudo-3D excitation" : "2D Bohr excitation",
        cx + 12,
        cy - activeShell.r / 2
      );

      t++;
      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(raf);
  }, [energy, view3D]);

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
          onChange={e => setEnergy(+e.target.value)}
        />

        <button
          className="panel-btn"
          onClick={() => setView3D(v => !v)}
        >
          Switch to {view3D ? "2D View" : "Pseudo-3D View"}
        </button>

        <div className="panel-hint">
          Yellow = excited electron<br />
          Blue = bound electrons (n₂, n₃)
        </div>
      </div>
    </div>
  );
}
