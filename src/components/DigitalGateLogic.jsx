import React, { useRef, useEffect, useState } from "react";
import "./DigitalGateLab.css";

const W = 1400;
const H = 900;

const gates = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => !(a & b) ? 1 : 0,
  NOR: (a, b) => !(a | b) ? 1 : 0,
  XOR: (a, b) => a ^ b,
  NOT: (a) => (!a ? 1 : 0),
};

export default function DigitalGateLab() {
  const canvasRef = useRef(null);

  const [gate, setGate] = useState("AND");
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);

  const output = gate === "NOT" ? gates.NOT(A) : gates[gate](A, B);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    draw(ctx);
  }, [gate, A, B]);

  const draw = (ctx) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    drawWire(ctx, 100, 120, 280, 120, A);
    if (gate !== "NOT") drawWire(ctx, 100, 200, 280, 200, B);

    drawGate(ctx, gate);
    drawWire(ctx, 420, 160, 620, 160, output);

    drawLamp(ctx, output);
  };

  const drawWire = (ctx, x1, y1, x2, y2, state) => {
    ctx.strokeStyle = state ? "#22c55e" : "#475569";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (state) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#22c55e";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const drawGate = (ctx, type) => {
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(280, 90, 140, 140, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e5e7eb";
    ctx.font = "20px monospace";
    ctx.fillText(type, 315, 165);
  };

  const drawLamp = (ctx, state) => {
    ctx.beginPath();
    ctx.arc(650, 160, 20, 0, Math.PI * 2);
    ctx.fillStyle = state ? "#fde047" : "#334155";
    ctx.fill();

    if (state) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#fde047";
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  return (
    <div className="digital-lab">
      <div className="digital-controls">
        <h3>Digital Gate Lab</h3>

        <label>Gate</label>
        <select value={gate} onChange={(e) => setGate(e.target.value)}>
          {Object.keys(gates).map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <label>Input A</label>
        <button onClick={() => setA(A ? 0 : 1)} className={A ? "on" : ""}>
          {A}
        </button>

        {gate !== "NOT" && (
          <>
            <label>Input B</label>
            <button onClick={() => setB(B ? 0 : 1)} className={B ? "on" : ""}>
              {B}
            </button>
          </>
        )}

        <div className="truth">
          Output: <strong>{output}</strong>
        </div>
      </div>

      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  );
}
