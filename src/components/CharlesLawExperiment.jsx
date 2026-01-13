import React, { useRef, useEffect, useState } from "react";

const W = 900;
const H = 600;
const ATOM_COUNT = 30;

export default function CharlesLawExperiment() {
  const canvasRef = useRef(null);
  const atomsRef = useRef([]);
  const tempRef = useRef(0.2);
  const volumeRef = useRef(220);

  const [temperature, setTemperature] = useState(0.2);

  /* ================= INIT ATOMS ================= */
  useEffect(() => {
    atomsRef.current = Array.from({ length: ATOM_COUNT }, () => ({
      x: W / 2 + Math.random() * 120 - 60,
      y: H / 2 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      r: 6
    }));
  }, []);

  /* ================= ANIMATION LOOP ================= */
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    let raf;

    function drawBurner() {
      ctx.fillStyle = "#444";
      ctx.fillRect(W / 2 - 60, H - 60, 120, 20);

      ctx.fillStyle = "orange";
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(
          W / 2 - 50 + i * 20,
          H - 70 - Math.random() * 10,
          6,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    function drawContainer() {
      const v = volumeRef.current;
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 4;
      ctx.strokeRect(W / 2 - 150, H - v - 80, 300, v);
    }

     function updateAtoms() {
  const v = volumeRef.current;
  const speed = 1 + tempRef.current * 6;

  // Container bounds
  const left = W / 2 - 150;
  const right = W / 2 + 150;
  const top = H - v - 80;
  const bottom = H - 80;

  atomsRef.current.forEach(a => {
    a.x += a.vx * speed;
    a.y += a.vy * speed;

    // LEFT WALL
    if (a.x - a.r < left) {
      a.x = left + a.r;
      a.vx *= -1;
    }

    // RIGHT WALL
    if (a.x + a.r > right) {
      a.x = right - a.r;
      a.vx *= -1;
    }

    // TOP WALL (MOVING WALL DUE TO EXPANSION)
    if (a.y - a.r < top) {
      a.y = top + a.r;
      a.vy *= -1;
    }

    // BOTTOM WALL
    if (a.y + a.r > bottom) {
      a.y = bottom - a.r;
      a.vy *= -1;
    }
  });
}


    function drawAtoms() {
      ctx.fillStyle = "#00eaff";
      atomsRef.current.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // Charles' Law: V ∝ T
      volumeRef.current = 220 + tempRef.current * 200;

      drawBurner();
      drawContainer();
      updateAtoms();
      drawAtoms();

      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ================= UI ================= */
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#fff"
      }}
    >
      <canvas ref={canvasRef} width={W} height={H} />

      {/* TEMPERATURE PANEL */}
      <div
        style={{
          marginTop: 12,
          padding: 16,
          width: 420,
          marginInline: "auto",
          background: "#111",
          borderRadius: 12,
          boxShadow: "0 0 20px rgba(255,0,0,0.25)"
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 1,
            color: "#ffb3b3",
            marginBottom: 6
          }}
        >
          TEMPERATURE
        </div>

        {/* BIG RED TEMPERATURE DISPLAY */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#ff2a2a",
            marginBottom: 10
          }}
        >
          {(temperature * 100).toFixed(0)} °C
        </div>

        {/* NATIVE SLIDER */}
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={temperature}
          onChange={e => {
            const t = +e.target.value;
            setTemperature(t);
            tempRef.current = t;
          }}
          style={{
            width: "100%",
            accentColor: "#ff2a2a",
            cursor: "pointer"
          }}
        />

        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: "#ccc"
          }}
        >
          Heating → Molecular speed ↑ → Volume ↑
        </div>

        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "#888"
          }}
        >
          Charles’ Law (Pressure constant)
        </div>
      </div>
    </div>
  );
}
