import React, { useRef, useEffect, useState } from "react";

/* =====================================================
   GLOBAL CANVAS SIZE
   ===================================================== */
const W = 1200;
const H = 700;

/* =====================================================
   Bell Experiment — Local Hidden Variable (EMBED SAFE)
   ===================================================== */

export default function BellLocalHiddenVariableLab() {
  const canvasRef = useRef(null);

  /* ===== State ===== */
  const [lambda, setLambda] = useState(1);
  const [phi, setPhi] = useState(30);
  const [analyzerAngle, setAnalyzerAngle] = useState(60);

  const measurement =
    Math.cos(((analyzerAngle - phi) * Math.PI) / 180) * lambda;
  const spinUp = measurement >= 0;

  /* ===== INIT CANVAS (GLOBAL SIZE) ===== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  /* ===== DRAW ===== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /* ===== BACKGROUND ===== */
    ctx.fillStyle = "#0b1320";
    ctx.fillRect(0, 0, W, H);

    /* Layout */
    const leftX = W * 0.3;
    const rightX = W * 0.7;
    const centerY = H * 0.5;

    const panelW = 380;
    const panelH = 340;

    ctx.strokeStyle = "#4fd1c5";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      leftX - panelW / 2,
      centerY - panelH / 2,
      panelW,
      panelH
    );

    ctx.strokeRect(
      rightX - panelW / 2,
      centerY - panelH / 2,
      panelW,
      panelH
    );

    /* Titles */
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText("SOURCE (Hidden Variables)", leftX - 115, centerY - 140);
    ctx.fillText("ANALYZER (Measurement)", rightX - 115, centerY - 140);

    /* ===== SOURCE ===== */
    ctx.save();
    ctx.translate(leftX, centerY);
    ctx.rotate((-phi * Math.PI) / 180);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-90, 0);
    ctx.lineTo(90, 0);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(`Hidden Axis φ = ${phi}°`, leftX - 80, centerY + 110);

    ctx.fillStyle = "#e879f9";
    ctx.fillText(`Hidden Variable λ = ${lambda}`, leftX - 80, centerY + 135);

    /* ===== ANALYZER ===== */
    const cx = rightX;
    const cy = centerY;
    const R = 90;

    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-analyzerAngle * Math.PI) / 180);

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-50, -25);
    ctx.lineTo(50, -25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-50, 25);
    ctx.lineTo(50, 25);
    ctx.stroke();

    /* Spin arrow */
    const dir = spinUp ? -1 : 1;
    ctx.strokeStyle = spinUp ? "#60a5fa" : "#f87171";
    ctx.fillStyle = ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, dir * 55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, dir * 55);
    ctx.lineTo(-6, dir * 45);
    ctx.lineTo(6, dir * 45);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    /* Labels */
    ctx.fillStyle = "#22c55e";
    ctx.font = "14px Arial";
    ctx.fillText("+1", cx - 8, cy - R - 10);
    ctx.fillText("−1", cx - 8, cy + R + 20);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Analyzer Angle θ = ${analyzerAngle}°`, cx - 85, cy + 110);
    ctx.fillText(
      `Spin Outcome: ${spinUp ? "+1 (↑)" : "−1 (↓)"}`,
      cx - 85,
      cy + 135
    );
  }, [phi, lambda, analyzerAngle, spinUp]);

  /* ===== UI ===== */
  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        background: "#0b1320",
        margin: "0 auto"
      }}
    >
      <canvas ref={canvasRef} />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 24,
          background: "rgba(0,0,0,0.55)",
          padding: "12px 18px",
          borderRadius: 12,
          color: "white"
        }}
      >
        <div>
          <label>Hidden Axis φ</label><br />
          <input
            type="range"
            min="0"
            max="180"
            value={phi}
            onChange={(e) => setPhi(+e.target.value)}
          />
        </div>

        <div>
          <label>Hidden λ</label><br />
          <select
            value={lambda}
            onChange={(e) => setLambda(+e.target.value)}
          >
            <option value={1}>+1</option>
            <option value={-1}>−1</option>
          </select>
        </div>

        <div>
          <label>Analyzer θ</label><br />
          <input
            type="range"
            min="0"
            max="180"
            value={analyzerAngle}
            onChange={(e) => setAnalyzerAngle(+e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
