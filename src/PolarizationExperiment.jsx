import React, { useEffect, useRef, useState } from "react";

const W = 1100;
const H = 420;

export default function PolarisationExperiment({ lightOn, setLightOn }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // crystal rotation angles
  const [theta1, setTheta1] = useState(20);
  const [theta2, setTheta2] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function clear() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    /* ================= BEAM ================= */
    function drawBeam(x1, x2, I = 1) {
      ctx.save();
      ctx.globalAlpha = I;
      ctx.fillStyle = "#fff7aa";
      ctx.fillRect(x1, H / 2 - 18, x2 - x1, 36);
      ctx.restore();
    }

    /* ================= HEX CRYSTAL ================= */
     function drawHexCrystal(x, angle, label) {
  const r = 38;

  ctx.save();
  ctx.translate(x, H / 2);
  ctx.rotate(angle);

  /* ===== 3D GLASS GRADIENT ===== */
  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, "rgba(200,240,255,0.85)");
  grad.addColorStop(0.5, "rgba(80,160,220,0.55)");
  grad.addColorStop(1, "rgba(30,80,140,0.85)");

  /* ===== HEX BODY ===== */
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const px = r * Math.cos(a);
    const py = r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.strokeStyle = "#bfe9ff";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  /* ===== INNER BEVEL ===== */
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const px = (r - 6) * Math.cos(a);
    const py = (r - 6) * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* ===== SPECULAR HIGHLIGHT ===== */
  ctx.beginPath();
  ctx.ellipse(-10, -12, 14, 6, Math.PI / 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  /* ===== OPTIC AXIS (ETCHED) ===== */
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -r + 4);
  ctx.lineTo(0, r - 4);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();

  /* ===== LABEL ===== */
  ctx.fillStyle = "#cfefff";
  ctx.font = "14px monospace";
  ctx.fillText(label, x - 28, H - 18);
}


    /* ================= FIELD VECTORS ================= */
    function drawField(x1, x2, theta, I) {
      ctx.strokeStyle = `rgba(80,255,80,${I})`;
      ctx.lineWidth = 2;

      for (let x = x1; x < x2; x += 18) {
        ctx.save();
        ctx.translate(x, H / 2);
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    function loop() {
      clear();

      if (lightOn) {
        const t1 = (theta1 * Math.PI) / 180;
        const t2 = (theta2 * Math.PI) / 180;

        /* ---------- INCIDENT LIGHT ---------- */
        drawBeam(40, 200, 1);
        drawField(40, 200, Math.random() * Math.PI, 0.4);

        /* ---------- CRYSTAL 1 ---------- */
        drawHexCrystal(240, t1, "Crystal 1");
        const I1 = Math.cos(t1) ** 2;

        drawBeam(280, 420, I1);
        drawField(280, 420, t1, I1);

        /* ---------- CRYSTAL 2 ---------- */
        drawHexCrystal(460, t2, "Crystal 2");
        const I2 = I1 * Math.cos(t2 - t1) ** 2;

        drawBeam(500, 740, I2);
        drawField(500, 740, t2, I2);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [lightOn, theta1, theta2]);

  return (
    <div style={{ padding: 18 }}>
      {/* LIGHT CONTROL */}
      <button
        onClick={() => setLightOn(!lightOn)}
        style={{
          marginBottom: 10,
          background: lightOn ? "#ff4444" : "#44ff88",
          border: "none",
          padding: "8px 12px",
          fontFamily: "monospace",
          cursor: "pointer"
        }}
      >
        {lightOn ? "TURN LIGHT OFF" : "TURN LIGHT ON"}
      </button>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          display: "block",
          background: "#000",
          border: "2px solid #555"
        }}
      />

      {/* CONTROLS */}
      {lightOn && (
        <div style={{ marginTop: 12, color: "#9ef" }}>
          <div>Crystal 1 Angle: {theta1}°</div>
          <input
            type="range"
            min="0"
            max="90"
            value={theta1}
            onChange={(e) => setTheta1(+e.target.value)}
            style={{ width: 260 }}
          />

          <div style={{ marginTop: 8 }}>
            Crystal 2 Angle: {theta2}°
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={theta2}
            onChange={(e) => setTheta2(+e.target.value)}
            style={{ width: 260 }}
          />
        </div>
      )}
    </div>
  );
}
