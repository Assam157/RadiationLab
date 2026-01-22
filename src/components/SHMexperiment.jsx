import React, { useRef, useEffect, useState } from "react";

export default function VerticalSpringSHM() {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const rafRef = useRef(null);

  // ===== Controls =====
  const [A, setA] = useState(60);          // amplitude (px)
  const [omega, setOmega] = useState(2);   // angular frequency
  const [phase, setPhase] = useState(0);   // phase (rad)
  const [gravity, setGravity] = useState(9.8); // gravity
  const [running, setRunning] = useState(true);

  const t0 = useRef(null);
  const data = useRef([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const gctx = graphRef.current.getContext("2d");

    const W = canvasRef.current.width;
    const H = canvasRef.current.height;

    function drawSpring(x, y1, y2) {
      const coils = 14;
      const amp = 8;
      const len = y2 - y1;
      const step = len / coils;

      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(x, y1);

      for (let i = 1; i < coils; i++) {
        const dx = i % 2 === 0 ? -amp : amp;
        ctx.lineTo(x + dx, y1 + i * step);
      }

      ctx.lineTo(x, y2);
      ctx.stroke();
    }

    function animate(time) {
      if (!running) return;

      if (!t0.current) t0.current = time;
      const t = (time - t0.current) / 1000;

      // ===== PHYSICS =====
      const yEq = gravity / (omega * omega); // equilibrium shift
      const y = yEq + A * Math.cos(omega * t + phase);

      // ===== DRAW SYSTEM =====
      ctx.clearRect(0, 0, W, H);

      const topY = 20;
      const eqY = H / 2;
      const massY = eqY + y;

      // ceiling
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 50, topY);
      ctx.lineTo(W / 2 + 50, topY);
      ctx.stroke();

      // spring
      drawSpring(W / 2, topY, massY - 15);

      // mass
      ctx.fillStyle = "#ff5555";
      ctx.fillRect(W / 2 - 20, massY - 15, 40, 30);

      // equilibrium line
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(W / 2 - 70, eqY + yEq);
      ctx.lineTo(W / 2 + 70, eqY + yEq);
      ctx.stroke();
      ctx.setLineDash([]);

      // ===== GRAPH =====
      data.current.push(y);
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
        const gy = 100 - v * 0.6;
        i === 0 ? gctx.moveTo(gx, gy) : gctx.lineTo(gx, gy);
      });
      gctx.stroke();

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [A, omega, phase, gravity, running]);

  return (
    <div style={{ display: "flex", gap: 20, color: "#fff" }}>
      {/* Vertical spring animation */}
      <canvas
        ref={canvasRef}
        width={260}
        height={360}
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
          Displacement y(t) from equilibrium
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
            Angular Frequency ω: <b>{omega}</b>
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={omega}
            onChange={e => setOmega(+e.target.value)}
          />
        </div>

        
      

        <div>
          <label style={{ color: "#000" }}>
            Gravity g: <b>{gravity.toFixed(1)} m/s²</b>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.2"
            value={gravity}
            onChange={e => setGravity(+e.target.value)}
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
