 import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RadiationDexterLab.css";

const W = 700;
const H = 420;
const F = 90; // lens focal length

const REF_INDEX = {
  water: 1.33,
  glass: 1.5
};

const COLORS = [
  { name: "V", c: "#7f00ff", o: -40 },
  { name: "I", c: "#4b0082", o: -25 },
  { name: "B", c: "#0000ff", o: -12 },
  { name: "G", c: "#00ff00", o: 0 },
  { name: "Y", c: "#ffff00", o: 12 },
  { name: "O", c: "#ff7f00", o: 25 },
  { name: "R", c: "#ff0000", o: 40 }
];

export default function OpticalDexterLab() {
  const canvasRef = useRef(null);
  const tRef = useRef(0);
  const navigate = useNavigate();

  const [angle, setAngle] = useState(40);
  const [medium, setMedium] = useState("water");
  const [experiment, setExperiment] = useState("refraction");
  const [lightOn, setLightOn] = useState(false);

  // 🔹 NEW (Lens states)
  const [lensType, setLensType] = useState("convex");
  const [sourceY, setSourceY] = useState(-1);

  const prismImg = new Image();
prismImg.src = "/prism.png";


  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function clear() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    /* ---------- REFRACTION (UNCHANGED) ---------- */
   function drawRefraction() {
  const cx = 320;
  const cy = H / 2;

  const i = (angle * Math.PI) / 180;
  const r = Math.asin(Math.sin(i) / REF_INDEX[medium]);

  const SPREAD = 0.6; // 🔽 reduced spread for better alignment

  /* -------- Interface (boundary) -------- */
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(W, cy);
  ctx.stroke();

  /* -------- Normal -------- */
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "#aaa";
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
  ctx.setLineDash([]);

  /* -------- Labels -------- */
  ctx.fillStyle = "#fff";
  ctx.font = "13px monospace";
  ctx.fillText("Incident Ray", 80, 80);
  ctx.fillText("Refracted Ray", 420, 300);

  if (!lightOn) return;

  /* -------- Incident Ray -------- */
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(
    cx - 200 * Math.sin(i) * SPREAD,
    cy - 200 * Math.cos(i) * SPREAD
  );
  ctx.lineTo(cx, cy);
  ctx.stroke();

  /* -------- Refracted Ray -------- */
  ctx.strokeStyle = "#ff0";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + 200 * Math.sin(r) * SPREAD,
    cy + 200 * Math.cos(r) * SPREAD
  );
  ctx.stroke();

  /* -------- Moving photon (aligned) -------- */
  const p = (tRef.current % 100) / 100;
  ctx.fillStyle = "#0f0";
  ctx.beginPath();
  ctx.arc(
    cx - 200 * Math.sin(i) * SPREAD * (1 - p),
    cy - 200 * Math.cos(i) * SPREAD * (1 - p),
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

    /* ---------- PRISM (UNCHANGED) ---------- */
  function drawPrism() {
  const prismW = 90;
  const prismH = 260;
  const centerY = H / 2;

  const leftX = 260;
  const rightX = 460;

  /* ---------- LEFT PRISM (90° CCW) ---------- */
  ctx.save();
  ctx.translate(leftX + prismW / 2, centerY);
  ctx.rotate(4*Math.PI / 2); // 90° counter-clockwise
  ctx.drawImage(
    prismImg,
    -prismW / 2,
    -prismH / 2,
    prismW,
    prismH
  );
  ctx.restore();

  /* ---------- RIGHT PRISM (90° CCW) ---------- */
  ctx.save();
  ctx.translate(rightX + prismW / 2, centerY);
  ctx.rotate(2*Math.PI / 2); // SAME 90° counter-clockwise
  ctx.drawImage(
    prismImg,
    -prismW / 2,
    -prismH / 2,
    prismW,
    prismH
  );
  ctx.restore();

  /* ---------- LABELS ---------- */
  ctx.fillStyle = "#7fdfff";
  ctx.font = "13px monospace";
  ctx.fillText("Prism 1", leftX, 70);
  ctx.fillText("Prism 2", rightX, 70);

  /* ================= ONLY SHOW WHEN LIGHT ON ================= */
  if (!lightOn) return;

  /* ---------- INCIDENT WHITE RAY ---------- */
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, centerY);
  ctx.lineTo(leftX+20, centerY);
  ctx.stroke();

  const p = (tRef.current % 120) / 120;
  ctx.beginPath();
  ctx.arc(60 + p * (leftX - 60), centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  /* ---------- VIBGYOR (TIGHT & CLEAN) ---------- */
  const DISP = 0.95;

  COLORS.forEach(col => {
    ctx.strokeStyle = col.c;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(leftX + prismW - 28, centerY);
    ctx.lineTo(rightX + 30, centerY + col.o * DISP);
    ctx.stroke();

    ctx.fillStyle = col.c;
    ctx.fillText(
      col.name,
      rightX + prismW + 6,
      centerY + col.o * DISP
    );
  });

  /* ---------- EMERGENT WHITE RAY ---------- */
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rightX + prismW-25, centerY);
  ctx.lineTo(700, centerY);
  ctx.stroke();
}


    /* ---------- 🔹 NEW: LENS EXPERIMENT ---------- */
    function drawLens() {
      const cx = W / 2;
      const cy = H / 2;
      const topY = 60;
      const botY = H - 60;
      const halfGap = 18;
      const curveDepth = 60;

      // Principal axis
      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();

      // F points
      [-1, 1].forEach(m => {
        ctx.strokeStyle = "#aaa";
        ctx.beginPath();
        ctx.moveTo(cx + m * F, cy - 6);
        ctx.lineTo(cx + m * F, cy + 6);
        ctx.stroke();
        ctx.fillStyle = "#aaa";
        ctx.fillText("F", cx + m * F - 5, cy + 22);
      });

      // Lens body
      ctx.strokeStyle = "#7fdfff";
      ctx.lineWidth = 2;
      ctx.beginPath();

      if (lensType === "convex") {
        ctx.moveTo(cx - halfGap, topY);
        ctx.lineTo(cx + halfGap, topY);
        ctx.bezierCurveTo(
          cx + halfGap + curveDepth, cy,
          cx + halfGap + curveDepth, cy,
          cx + halfGap, botY
        );
        ctx.lineTo(cx - halfGap, botY);
        ctx.bezierCurveTo(
          cx - halfGap - curveDepth, cy,
          cx - halfGap - curveDepth, cy,
          cx - halfGap, topY
        );
      } else {
        ctx.moveTo(cx - halfGap, topY);
        ctx.lineTo(cx + halfGap, topY);
        ctx.bezierCurveTo(
          cx + halfGap - curveDepth, cy,
          cx + halfGap - curveDepth, cy,
          cx + halfGap, botY
        );
        ctx.lineTo(cx - halfGap, botY);
        ctx.bezierCurveTo(
          cx - halfGap + curveDepth, cy,
          cx - halfGap + curveDepth, cy,
          cx - halfGap, topY
        );
      }

      ctx.closePath();
      ctx.stroke();

      const objX = 100;
      const objTopY = cy + sourceY * 60;

      ctx.strokeStyle = "#0f0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(objX, cy);
      ctx.lineTo(objX, objTopY);
      ctx.stroke();

      ctx.fillStyle = "#0f0";
      ctx.fillText("Object", objX - 20, objTopY - 6);

      if (!lightOn) return;

      ctx.strokeStyle = "#ff0";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx, objTopY);

      if (lensType === "convex") {
        ctx.lineTo(cx + F, cy);
      } else {
        ctx.lineTo(cx + 140, objTopY + 50);
        ctx.setLineDash([6, 6]);
        ctx.moveTo(cx, objTopY);
        ctx.lineTo(cx - F, cy);
        ctx.setLineDash([]);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(cx + 160, cy + (objTopY - cy));
      ctx.stroke();
    }

    function loop() {
      clear();

      if (experiment === "refraction") drawRefraction();
      if (experiment === "prism") drawPrism();
      if (experiment === "lens") drawLens();

      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.fillText(`Experiment: ${experiment}`, 20, 30);

      tRef.current += 2;
      requestAnimationFrame(loop);
    }

    loop();
  }, [angle, medium, experiment, lightOn, lensType, sourceY]);

  return (
    <div className="dexter-root">
      {/* LEFT PANEL */}
      <div className="control-panel">
        <h2>🔍 OPTICAL LAB</h2>

        <button
          className={experiment === "refraction" ? "active" : ""}
          onClick={() => setExperiment("refraction")}
        >
          REFRACTION
        </button>

        <button
          className={experiment === "prism" ? "active" : ""}
          onClick={() => setExperiment("prism")}
        >
          VIBGYOR (PRISM)
        </button>

        {/* 🔹 NEW */}
        <button
          className={experiment === "lens" ? "active" : ""}
          onClick={() => setExperiment("lens")}
        >
          LENS
        </button>

        {experiment === "refraction" && (
          <>
            <button
              className={medium === "water" ? "active" : ""}
              onClick={() => setMedium("water")}
            >
              WATER
            </button>

            <button
              className={medium === "glass" ? "active" : ""}
              onClick={() => setMedium("glass")}
            >
              GLASS
            </button>
          </>
        )}

        {experiment === "lens" && (
          <>
            <button onClick={() => setLensType(lensType === "convex" ? "concave" : "convex")}>
              {lensType.toUpperCase()}
            </button>

            <button onClick={() => setSourceY(sourceY * -1)}>
              SOURCE {sourceY === -1 ? "+Y" : "-Y"}
            </button>
          </>
        )}

        <button style={{ marginTop: 20 }} onClick={() => navigate("/")}>
          ⬅ BACK TO CONSOLE
        </button>
      </div>

      {/* CANVAS */}
      <canvas ref={canvasRef} width={W} height={H} />

      {/* RIGHT PANEL */}
      <div className="energy-panel">
        <button
          onClick={() => setLightOn(!lightOn)}
          style={{
            marginBottom: 12,
            background: lightOn ? "#ff4444" : "#44ff88",
            border: "none",
            padding: "8px",
            fontFamily: "monospace",
            cursor: "pointer"
          }}
        >
          {lightOn ? "TURN LIGHT OFF" : "TURN LIGHT ON"}
        </button>

        {experiment === "refraction" && (
          <>
            <div className="energy-label">INCIDENT ANGLE</div>
            <div className="energy-value">{angle}°</div>
            <input
              className="energy-slider"
              type="range"
              min="5"
              max="75"
              value={angle}
              onChange={(e) => setAngle(+e.target.value)}
            />
          </>
        )}

        {experiment === "prism" && (
          <div className="energy-label">
            Dispersion of white light into VIBGYOR
          </div>
        )}

        {experiment === "lens" && (
          <div className="energy-label">
            Convex / Concave Lens Ray Diagram
          </div>
        )}
      </div>
    </div>
  );
}
