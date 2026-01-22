import React, { useRef, useEffect, useState } from "react";

export default function HorizontalSpringWithFriction() {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const rafRef = useRef(null);

  /* ===== Controls ===== */
  const [A, setA] = useState(80);          // amplitude (px)
  const [omega0, setOmega0] = useState(3); // natural angular frequency
  const [gamma, setGamma] = useState(0.2); // damping (friction)
  const [phase, setPhase] = useState(0);   // phase
  const [running, setRunning] = useState(true);

  const t0 = useRef(null);
  const data = useRef([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const gctx = graphRef.current.getContext("2d");

    const W = canvasRef.current.width;
    const H = canvasRef.current.height;

    function drawSpring(x1, x2, y) {
      const coils = 14;
      const amp = 6;
      const len = x2 - x1;
      const step = len / coils;

      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(x1, y);

      for (let i = 1; i < coils; i++) {
        const dy = i % 2 === 0 ? -amp : amp;
        ctx.lineTo(x1 + i * step, y + dy);
      }

      ctx.lineTo(x2, y);
      ctx.stroke();
    }

    function animate(time) {
      if (!running) return;

      if (!t0.current) t0.current = time;
      const t = (time - t0.current) / 1000;

      /* ===== PHYSICS ===== */
      const omega = Math.sqrt(
        Math.max(omega0 * omega0 - gamma * gamma, 0.01)
      );

      const x =
        A * Math.exp(-gamma * t) * Math.cos(omega * t + phase);

      /* ===== DRAW SYSTEM ===== */
      ctx.clearRect(0, 0, W, H);

      const floorY = H - 40;     // plane position
      const blockSize = 40;
      const eqX = W / 2;
      const massX = eqX + x;
      const massY = floorY - blockSize;

      /* ---- ground plane ---- */
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(W, floorY);
      ctx.stroke();

      // texture lines on plane
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, floorY);
        ctx.lineTo(i + 10, floorY);
        ctx.stroke();
      }

      /* ---- wall ---- */
      ctx.fillStyle = "#777";
      ctx.fillRect(20, massY - 20, 10, 80);

      /* ---- spring ---- */
      drawSpring(30, massX - blockSize / 2, massY + blockSize / 2);

      /* ---- mass ---- */
      ctx.fillStyle = "#ff5555";
      ctx.fillRect(
        massX - blockSize / 2,
        massY,
        blockSize,
        blockSize
      );

      /* ---- equilibrium marker ---- */
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(eqX, massY - 30);
      ctx.lineTo(eqX, floorY);
      ctx.stroke();
      ctx.setLineDash([]);

      /* ===== GRAPH ===== */
      data.current.push(x);
      if (data.current.length > 260) data.current.shift();

      gctx.clearRect(0, 0, 320, 200);

      gctx.strokeStyle = "#888";
      gctx.beginPath();
      gctx.moveTo(40, 10);
      gctx.lineTo(40, 190);
      gctx.lineTo(300, 190);
      gctx.stroke();

      gctx.strokeStyle = "#00aaff";
      gctx.beginPath();
      data.current.forEach((v, i) => {
        const gx = 40 + i;
        const gy = 100 - v * 0.5;
        i === 0 ? gctx.moveTo(gx, gy) : gctx.lineTo(gx, gy);
      });
      gctx.stroke();

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [A, omega0, gamma, phase, running]);

  return (
    <div style={{ display: "flex", gap: 20, color: "#fff" }}>
      {/* Animation */}
      <canvas
        ref={canvasRef}
        width={420}
        height={240}
        style={{ border: "1px solid #555" }}
      />

      <div>
        {/* Graph */}
        <canvas
          ref={graphRef}
          width={320}
          height={200}
          style={{ border: "1px solid #555" }}
        />

        <p style={{ color: "#00aaff" }}>
          Displacement x(t) — friction on plane
        </p>

        {/* Controls */}
        <div>
          <label style={{ color: "#000" }}>
            Amplitude A: <b>{A}</b>
          </label>
          <input
            type="range"
            min="20"
            max="120"
            value={A}
            onChange={e => setA(+e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: "#000" }}>
            Natural Frequency ω₀: <b>{omega0}</b>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            step="0.1"
            value={omega0}
            onChange={e => setOmega0(+e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: "#000" }}>
            Friction (γ): <b>{gamma.toFixed(2)}</b>
          </label>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.01"
            value={gamma}
            onChange={e => setGamma(+e.target.value)}
          />
        </div>

        

        <button
          onClick={() => {
            t0.current = null;
            setRunning(r => !r);
          }}
        >
          {running ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
