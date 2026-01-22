import React, { useRef, useEffect, useState } from "react";
import "./QuantumLab.css";

/* ================= CONSTANTS ================= */
const W = 1200;
const H = 600;

/* ================= COMPONENT ================= */
export default function CHSHInequalityLab() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [phase, setPhase] = useState(0);

  /* ================= ANGLES ================= */
  const [A, setA] = useState(0);
  const [Ap, setAp] = useState(45);
  const [B, setB] = useState(22.5);
  const [Bp, setBp] = useState(67.5);

  /* ================= CORRELATION ================= */
  const E = (a, b) =>
    -Math.cos((2 * (a - b) * Math.PI) / 180);

  const S = Math.abs(
    E(A, B) -
      E(A, Bp) +
      E(Ap, B) +
      E(Ap, Bp)
  );

  /* ================= ANIMATION ================= */
  useEffect(() => {
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const step = () => {
    setPhase((p) => p + 0.03);
    draw();
    animationRef.current = requestAnimationFrame(step);
  };

  /* ================= DRAW ================= */
  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    drawSource(ctx);
    drawAnalyzer(ctx, 400, H / 2, A, "A");
    drawAnalyzer(ctx, 400, H / 2 + 200, Ap, "A′");

    drawAnalyzer(ctx, 1000, H / 2, B, "B");
    drawAnalyzer(ctx, 1000, H / 2 + 200, Bp, "B′");

    drawConnections(ctx);
  };

  /* ================= SOURCE ================= */
  const drawSource = (ctx) => {
    ctx.fillStyle = "rgba(0,255,255,0.8)";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 30 + Math.sin(phase) * 10;

    ctx.beginPath();
    ctx.arc(W / 2, H / 2 - 100, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillText(
      "Entangled Pair Source",
      W / 2 - 70,
      H / 2 - 65
    );
  };

  /* ================= ANALYZER ================= */
  const drawAnalyzer = (ctx, x, y, angle, label) => {
    const rad = (angle * Math.PI) / 180;
    const glow = 10 + Math.sin(phase + angle) * 5;

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;

    ctx.shadowColor = `hsla(${angle * 2},100%,70%,0.8)`;
    ctx.shadowBlur = glow;

    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + 35 * Math.cos(rad),
      y - 35 * Math.sin(rad)
    );
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillText(`${label} = ${angle}°`, x - 32, y + 55);
  };

  /* ================= NON-LOCAL CONNECTIONS ================= */
  const drawConnections = (ctx) => {
    const alpha = 0.25 + Math.sin(phase) * 0.1;
    const hue = S > 2 ? 0 : 140;

    ctx.strokeStyle = `hsla(${hue},100%,60%,${alpha})`;
    ctx.lineWidth = 2;

    const sx = W / 2;
    const sy = H / 2 - 100;

    const targets = [
      [400, H / 2],
      [400, H / 2 + 200],
      [1000, H / 2],
      [1000, H / 2 + 200],
    ];

    targets.forEach(([tx, ty], i) => {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        (sx + tx) / 2,
        sy + Math.sin(phase + i) * 60,
        tx,
        ty
      );
      ctx.stroke();

      /* particle pulse */
      const t = (Math.sin(phase + i) + 1) / 2;
      const px = sx + (tx - sx) * t;
      const py = sy + (ty - sy) * t;

      ctx.fillStyle = `hsla(${hue},100%,70%,0.8)`;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  /* ================= UI ================= */
  return (
    <div className="quantum-lab-container">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="quantum-canvas"
      />

      <div className="controls grid">
        <AngleSlider label="A" value={A} set={setA} />
        <AngleSlider label="A′" value={Ap} set={setAp} />
        <AngleSlider label="B" value={B} set={setB} />
        <AngleSlider label="B′" value={Bp} set={setBp} />
      </div>

      <div className="ql-info-box">
        <div>
          S = |E(A,B) − E(A,B′) + E(A′,B) + E(A′,B′)|
        </div>

        <strong
          style={{
            fontSize: "20px",
            color: S > 2 ? "#ff4444" : "#44ff88",
          }}
        >
          S = {S.toFixed(3)}
        </strong>

        <div
          style={{
            marginTop: "6px",
            color: S > 2 ? "#ff5555" : "#55ff55",
          }}
        >
          {S > 2
            ? "Quantum Violation — Bell Inequality Broken"
            : "Classical (Local Hidden Variables)"}
        </div>
      </div>
    </div>
  );
}

/* ================= SLIDER ================= */
function AngleSlider({ label, value, set }) {
  return (
    <div className="ql-control-group">
      <label>{label} Angle</label>
      <input
        type="range"
        min="0"
        max="180"
        value={value}
        onChange={(e) => set(+e.target.value)}
      />
      <span>{value}°</span>
    </div>
  );
}
