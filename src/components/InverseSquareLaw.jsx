import React, { useRef, useEffect, useState } from "react";
import "./InverseSquareMotion.css";

export default function InverseSquareMotion() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const pausedRef = useRef(false);
  const timeScaleRef = useRef(1);

  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(5);
  const [paused, setPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);

  const G = 60;

  const body1 = useRef({ x: 250, y: 300, vx: 0, vy: 0, m: 5 });
  const body2 = useRef({ x: 550, y: 300, vx: 0, vy: 0, m: 5 });

  /* --- Sync state to refs --- */
  useEffect(() => {
    pausedRef.current = paused;
    timeScaleRef.current = timeScale;
    body1.current.m = m1;
    body2.current.m = m2;
  }, [paused, timeScale, m1, m2]);

  /* --- MAIN LOOP (RUN ONCE) --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function loop() {
      if (!pausedRef.current) {
        stepPhysics();
      }
      draw(ctx);
      rafRef.current = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* --- PHYSICS --- */
  function stepPhysics() {
    const b1 = body1.current;
    const b2 = body2.current;

    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const r = Math.sqrt(dx * dx + dy * dy) + 1;

    const F = (G * b1.m * b2.m) / (r * r);
    const fx = (F * dx) / r;
    const fy = (F * dy) / r;

    const dt = 0.016 * timeScaleRef.current;

    b1.vx += (fx / b1.m) * dt;
    b1.vy += (fy / b1.m) * dt;
    b2.vx -= (fx / b2.m) * dt;
    b2.vy -= (fy / b2.m) * dt;

    b1.x += b1.vx;
    b1.y += b1.vy;
    b2.x += b2.vx;
    b2.y += b2.vy;
  }

  /* --- DRAWING --- */
  function draw(ctx) {
    ctx.clearRect(0, 0, 800, 600);

    const b1 = body1.current;
    const b2 = body2.current;

    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const r = Math.sqrt(dx * dx + dy * dy);

    // distance line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // inverse square glow
    const glow = Math.min(1, 220 / (r * r));
    ctx.strokeStyle = `rgba(255,215,0,${glow})`;
    ctx.lineWidth = 10 * glow;
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();

    drawBody(ctx, b1, "#4ade80");
    drawBody(ctx, b2, "#60a5fa");
  }

  function drawBody(ctx, b, color) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 10 + b.m, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* --- RESET --- */
  function reset() {
    body1.current.x = 250;
    body1.current.y = 300;
    body1.current.vx = 0;
    body1.current.vy = 0;

    body2.current.x = 550;
    body2.current.y = 300;
    body2.current.vx = 0;
    body2.current.vy = 0;
  }

  return (
    <div className="inverse-container">
      <div className="control-panel">
        <h2>Inverse Square Law</h2>

        <label>Mass m₁: {m1}</label>
        <input type="range" min="1" max="10" step="1"
          value={m1} onChange={e => setM1(+e.target.value)} />

        <label>Mass m₂: {m2}</label>
        <input type="range" min="1" max="10" step="1"
          value={m2} onChange={e => setM2(+e.target.value)} />

        <button onClick={() => setPaused(p => !p)}>
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button onClick={reset}>🔄 Reset</button>
      </div>

      <canvas ref={canvasRef} width={800} height={600} />

      <div className="info-panel">
        <label>Time Scale: {timeScale.toFixed(1)}×</label>
        <input type="range" min="0.2" max="2" step="0.1"
          value={timeScale} onChange={e => setTimeScale(+e.target.value)} />

        <div className="formula">
          F = G · m₁ · m₂ / r²
        </div>
      </div>
    </div>
  );
}
