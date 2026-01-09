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

      ctx.strokeStyle = "#0ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();

      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#fff";
      ctx.font = "13px monospace";
      ctx.fillText("Incident Ray", 80, 80);
      ctx.fillText("Refracted Ray", 420, 300);

      if (!lightOn) return;

      ctx.strokeStyle = "#0f0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 200 * Math.sin(i), cy - 200 * Math.cos(i));
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.strokeStyle = "#ff0";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 200 * Math.sin(r), cy + 200 * Math.cos(r));
      ctx.stroke();

      const p = (tRef.current % 100) / 100;
      ctx.fillStyle = "#0f0";
      ctx.beginPath();
      ctx.arc(
        cx - 200 * Math.sin(i) * (1 - p),
        cy - 200 * Math.cos(i) * (1 - p),
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    /* ---------- PRISM (UNCHANGED) ---------- */
    function drawPrism() {
      ctx.fillStyle = "rgba(120,200,255,0.15)";
      ctx.strokeStyle = "#7fdfff";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(280, 80);
      ctx.lineTo(340, 210);
      ctx.lineTo(280, 340);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(500, 340);
      ctx.lineTo(440, 210);
      ctx.lineTo(500, 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#7fdfff";
      ctx.font = "13px monospace";
      ctx.fillText("Prism 1", 255, 60);
      ctx.fillText("Prism 2", 475, 60);

      COLORS.forEach(col => {
        ctx.fillStyle = col.c;
        ctx.fillText(col.name, 450, 215 + col.o);
      });

      if (!lightOn) return;

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 210);
      ctx.lineTo(280, 210);
      ctx.stroke();

      const p = (tRef.current % 120) / 120;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(60 + p * 220, 210, 5, 0, Math.PI * 2);
      ctx.fill();

      COLORS.forEach(col => {
        ctx.strokeStyle = col.c;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(340, 210);
        ctx.lineTo(440, 210 + col.o);
        ctx.stroke();
      });

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(500, 210);
      ctx.lineTo(660, 210);
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
