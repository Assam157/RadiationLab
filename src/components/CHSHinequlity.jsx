import React, { useRef, useEffect, useState } from "react";
import "./QuantumLab.css";

/* ================= CONSTANTS ================= */
const W = 1200;
const H = 600;

/* ================= COMPONENT ================= */
export default function CHSHInequalityLab() {
  const canvasRef = useRef(null);

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

  /* ================= DRAW ================= */
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    drawSource(ctx);
    drawAnalyzer(ctx, 400, H / 2, A, "A");
    drawAnalyzer(ctx, 400, H / 2 + 200, Ap, "A′");

    drawAnalyzer(ctx, 1000, H / 2, B, "B");
    drawAnalyzer(ctx, 1000, H / 2 + 200, Bp, "B′");

    drawConnections(ctx);
  }, [A, Ap, B, Bp]);

  const drawSource = (ctx) => {
    ctx.fillStyle = "#0ff";
    ctx.beginPath();
    ctx.arc(W / 2, H / 2 - 100, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(
      "Entangled Pair Source",
      W / 2 - 60,
      H / 2 - 70
    );
  };

  const drawAnalyzer = (ctx, x, y, angle, label) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.stroke();

    const rad = (angle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + 35 * Math.cos(rad),
      y - 35 * Math.sin(rad)
    );
    ctx.stroke();

    ctx.fillText(`${label} = ${angle}°`, x - 30, y + 55);
  };

  const drawConnections = (ctx) => {
    ctx.strokeStyle = "rgba(0,255,255,0.3)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(W / 2, H / 2 - 100);
    ctx.lineTo(400, H / 2);
    ctx.moveTo(W / 2, H / 2 - 100);
    ctx.lineTo(400, H / 2 + 200);

    ctx.moveTo(W / 2, H / 2 - 100);
    ctx.lineTo(1000, H / 2);
    ctx.moveTo(W / 2, H / 2 - 100);
    ctx.lineTo(1000, H / 2 + 200);
    ctx.stroke();
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
        <div>S = |E(A,B) − E(A,B′) + E(A′,B) + E(A′,B′)|</div>
        <strong>S = {S.toFixed(3)} <div
          style={{
            color: S > 2 ? "#ff5555" : "#55ff55",
            marginTop: "0px",
          }}
        >
          {S > 2
            ? "Quantum Violation (No Local Hidden Variables)"
            : "Classical Region"}
        </div></strong>
        
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
