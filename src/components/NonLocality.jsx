 import React, { useRef, useEffect, useState } from "react";
import "./QuantumLab.css";

/* ================= CONSTANTS ================= */
const W = 1400;
const H = 800;
const SOURCE_X = 150;
const SLIT_X = 600;
const DETECTOR_X = 1150;
const NUM_RAYS = 15;

/* ================= COMPONENT ================= */
export default function QuantumWaveNonLocality() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [t, setT] = useState(0); // 0 → 1
  const [playing, setPlaying] = useState(false);
  const [collapseRay, setCollapseRay] = useState(null);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    draw();
  }, [t, collapseRay]);

  useEffect(() => {
    if (!playing) return;
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [playing]);

  const step = () => {
    setT((prev) => Math.min(prev + 0.002, 1));
    animationRef.current = requestAnimationFrame(step);
  };

  /* ================= DRAW ================= */
  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    drawSource(ctx);
    drawSlit(ctx);
    drawDetector(ctx);
    drawIncidentWave(ctx);

    if (t >= 0.5) drawSplitRays(ctx);
  };

  const drawSource = (ctx) => {
    ctx.fillStyle = "#0ff";
    ctx.beginPath();
    ctx.arc(SOURCE_X, H / 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("Quantum Source", SOURCE_X - 40, H / 2 + 30);
  };

  const drawSlit = (ctx) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(SLIT_X, 0);
    ctx.lineTo(SLIT_X, H / 2 - 70);
    ctx.moveTo(SLIT_X, H / 2 + 70);
    ctx.lineTo(SLIT_X, H);
    ctx.stroke();
    ctx.fillText("Slit", SLIT_X - 10, 40);
  };

  const drawDetector = (ctx) => {
    ctx.strokeStyle = "#aaa";
    ctx.strokeRect(DETECTOR_X, 50, 40, H - 100);
    ctx.fillText("Detector", DETECTOR_X - 20, 40);

    if (collapseRay !== null) {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(
        DETECTOR_X + 20,
        collapseRay,
        7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  /* ================= INCIDENT WAVE ================= */
  const drawIncidentWave = (ctx) => {
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let y = 0; y < H; y += 4) {
      const x =
        SOURCE_X +
        (SLIT_X - SOURCE_X) * Math.min(t / 0.5, 1) +
        Math.sin((y + t * 200) * 0.05) * 8;

      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  /* ================= SPLIT RAYS ================= */
  const drawSplitRays = (ctx) => {
    const localT = (t - 0.5) / 0.5;

    for (let i = 0; i < NUM_RAYS; i++) {
      const angle =
        ((i - (NUM_RAYS - 1) / 2) / NUM_RAYS) * Math.PI / 3;

      const y0 = H / 2;
      const yEnd =
        y0 + Math.tan(angle) * (DETECTOR_X - SLIT_X) * localT;

      /* Ray */
      ctx.strokeStyle = "rgba(0,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(SLIT_X, y0);
      ctx.lineTo(
        SLIT_X + (DETECTOR_X - SLIT_X) * localT,
        yEnd
      );
      ctx.stroke();

      /* Envelope (non-local wave) */
      ctx.fillStyle = "rgba(0,255,255,0.15)";
      ctx.beginPath();
      ctx.arc(
        SLIT_X + (DETECTOR_X - SLIT_X) * localT,
        yEnd,
        6,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  /* ================= MEASUREMENT ================= */
  const measure = () => {
    const chosen =
      H / 2 +
      (Math.random() - 0.5) * 260;
    setCollapseRay(chosen);
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

      <div className="controls">
        <label>
          Incident Wave Evolution
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={t}
            onChange={(e) => setT(+e.target.value)}
          />
        </label>

        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        <button onClick={measure}>
          Measure (Collapse)
        </button>

        <button
          onClick={() => {
            setPlaying(false);
            setT(0);
            setCollapseRay(null);
          }}
        >
          Reset
        </button>
      </div>

      <p className="lab-note">
        The incident quantum wave reaches the slit and splits into
        multiple momentum components (rays).  
        These rays are not particle paths, but directions of the
        wavefunction. Measurement collapses the wave to one outcome.
      </p>
    </div>
  );
}
