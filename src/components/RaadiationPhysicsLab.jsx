import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RadiationDexterLab.css";

const W = 700;
const H = 420;

const BASE_RANGE = {
  alpha: 220,
  beta: 380,
  gamma: 720
};

// Correct EM deflection directions
const DEFLECT_FACTOR = {
  alpha: -0.15,
  beta: 0.6,
  gamma: 0.0
};

export default function RadiationDexterLab() {
  const canvasRef = useRef(null);
  const tRef = useRef(0);
  const navigate = useNavigate(); // 👈 added

  /* SLIDERS */
  const [energy, setEnergy] = useState(1.0);
  const [emField, setEmField] = useState(4.0);
  const [goldThickness, setGoldThickness] = useState(1.0); // 👈 ADD

  /* PARTICLE SWITCHES */
  const [particles, setParticles] = useState({
    alpha: true,
    beta: false,
    gamma: false
  });

  /* EXPERIMENT TOGGLES */
  const [experiments, setExperiments] = useState({
    gold: true,
    shield: false,
    emfield: false
  });

  const toggleParticle = (k) =>
    setParticles((p) => ({ ...p, [k]: !p[k] }));

  const toggleExperiment = (k) =>
    setExperiments((e) => ({ ...e, [k]: !e[k] }));

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function drawGrid() {
      ctx.strokeStyle = "#111";
      for (let i = 0; i < W; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
    }

    function drawSource() {
      ctx.fillStyle = "#333";
      ctx.fillRect(60, 160, 70, 100);
      ctx.fillStyle = "#0f0";
      ctx.fillText("SOURCE", 58, 150);
    }

    function drawRayStraight(y, rgb, baseRange) {
      const startX = 140;
      const range = baseRange * energy;
      if (range < 5) return;

      const px = startX + (tRef.current % range);

      ctx.strokeStyle = `rgb(${rgb})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + range, y);
      ctx.stroke();

      ctx.fillStyle = `rgb(${rgb})`;
      ctx.beginPath();
      ctx.arc(px, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawRayDeflected(yBase, rgb, factor) {
      const startX = 140;
      const length = 520 * energy;
      const deflect = (factor * emField * 140) / Math.max(energy, 0.2);

      ctx.strokeStyle = `rgb(${rgb})`;
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = 0; x < length; x += 6) {
        const p = x / length;
        const y = yBase + deflect * p * p;
        if (x === 0) ctx.moveTo(startX + x, y);
        else ctx.lineTo(startX + x, y);
      }
      ctx.stroke();

      const px = startX + (tRef.current % length);
      const p = px / length;
      const py = yBase + deflect * p * p;

      ctx.fillStyle = `rgb(${rgb})`;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }

     function drawGoldFoil() {
  const baseX = 360;
  const baseThickness = 150;               // thin real foil
  const thicknessPx = baseThickness * goldThickness;

  ctx.fillStyle = "#d4af37";
  ctx.fillRect(baseX, 120, thicknessPx, 180);

  ctx.strokeStyle = "#aa8c2e";
  ctx.strokeRect(baseX, 120, thicknessPx, 180);

  ctx.fillStyle = "#fff";
  ctx.font = "12px monospace";
  ctx.fillText("GOLD FOIL", baseX - 5, 110);
  ctx.fillText(
    `t = ${(baseThickness * goldThickness).toFixed(1)} μm`,
    baseX - 20,
    320
  );
}

    function drawShielding() {
      const mats = [
        [360, "#7a4a2e"],
        [440, "#888"],
        [520, "#444"]
      ];
      mats.forEach(([x, col]) => {
        ctx.fillStyle = col;
        ctx.fillRect(x, 120, 40, 180);
      });
    }

    function drawEMField() {
      ctx.strokeStyle = "rgba(0,234,255,0.3)";
      for (let y = 90; y < H - 90; y += 25) {
        ctx.beginPath();
        ctx.moveTo(260, y);
        ctx.lineTo(620, y);
        ctx.stroke();
      }
    }
    function drawMediumLabels() {
  ctx.fillStyle = "#aaa";
  ctx.font = "12px monospace";

  ctx.fillText("VACUUM / AIR", 140, 100);
  ctx.fillText("TARGET REGION", 360, 100);
  ctx.fillText("DETECTOR ZONE", 560, 100);

  if (experiments.emfield) {
    ctx.fillText("E ⟂ B FIELD REGION", 420, 80);
  }

  if (experiments.shield) {
    ctx.fillText("SHIELDING MATERIALS", 400, 330);
    ctx.fillText("WOOD → METAL → LEAD", 380, 350);
  }
}


    function drawRays() {
      const emOn = experiments.emfield;

      if (particles.alpha) {
        emOn
          ? drawRayDeflected(190, "255,0,0", DEFLECT_FACTOR.alpha)
          : drawRayStraight(190, "255,0,0", BASE_RANGE.alpha);
      }

      if (particles.beta) {
        emOn
          ? drawRayDeflected(210, "0,255,255", DEFLECT_FACTOR.beta)
          : drawRayStraight(210, "0,255,255", BASE_RANGE.beta);
      }

      if (particles.gamma) {
        emOn
          ? drawRayDeflected(230, "180,0,255", DEFLECT_FACTOR.gamma)
          : drawRayStraight(230, "180,0,255", BASE_RANGE.gamma);
      }
      ctx.fillStyle = "#fff";
ctx.font = "12px monospace";

if (particles.alpha) ctx.fillText("α (He²⁺)", 20, 190);
if (particles.beta) ctx.fillText("β (e⁻)", 20, 210);
if (particles.gamma) ctx.fillText("γ (Photon)", 20, 230);

    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawSource();

      if (experiments.gold) drawGoldFoil();
      if (experiments.shield) drawShielding();
      if (experiments.emfield) drawEMField();

      drawMediumLabels();

      drawRays();
      
     
      

      tRef.current += 3;
      requestAnimationFrame(loop);
    }

    ctx.font = "14px monospace";
    loop();
  }, [particles, experiments, energy, emField, goldThickness]);


  return (
    <div className="dexter-root">
      {/* LEFT PANEL */}
      <div className="control-panel">
        <h2>☢ RADIATION LAB</h2>

        {/* Experiment buttons */}
        <button
          className={experiments.gold ? "active" : ""}
          onClick={() => toggleExperiment("gold")}
        >
          GOLD
        </button>

        <button
          className={experiments.shield ? "active" : ""}
          onClick={() => toggleExperiment("shield")}
        >
          SHIELD
        </button>

        <button
          className={experiments.emfield ? "active em" : ""}
          onClick={() => toggleExperiment("emfield")}
        >
          EM
        </button>

        {/* Particle switches */}
        <div style={{ marginTop: 20 }}>
          <button
            className={`alpha ${particles.alpha ? "active" : ""}`}
            onClick={() => toggleParticle("alpha")}
          >
            α ALPHA
          </button>

          <button
            className={`beta ${particles.beta ? "active" : ""}`}
            onClick={() => toggleParticle("beta")}
          >
            β BETA
          </button>

          <button
            className={`gamma ${particles.gamma ? "active" : ""}`}
            onClick={() => toggleParticle("gamma")}
          >
            γ GAMMA
          </button>
        </div>

        {/* BACK BUTTON */}
        <button
          style={{ marginTop: 20 }}
          onClick={() => navigate("/")}
        >
          ⬅ BACK TO CONSOLE
        </button>
      </div>

      
   {/* CANVAS */}
<div className="canvas-container-black">
  <canvas ref={canvasRef} width={W} height={H} />
</div>

{/* RIGHT PANEL */}
 {/* RIGHT PANEL */}
<div className="energy-panel">

  {/* ================= ENERGY ================= */}
  <div className="energy-label">ENERGY</div>
  <div className="energy-value">{energy.toFixed(2)}×</div>

  <input
    className="energy-slider"
    type="range"
    min="0.2"
    max="1"
    step="0.01"
    value={energy}
    onChange={(e) => setEnergy(+e.target.value)}
  />

  {/* ================= GOLD FOIL THICKNESS ================= */}
  {experiments.gold && (
    <>
      <div className="energy-label">GOLD FOIL THICKNESS</div>
      <div className="energy-value">{goldThickness.toFixed(2)}×</div>

      <input
        className="energy-slider"
        type="range"
        min="1"
        max="1.5"
        step="0.05"
        value={goldThickness}
        onChange={(e) => setGoldThickness(+e.target.value)}
      />
    </>
  )}

  {/* ================= EM FIELD ================= */}
  {experiments.emfield && (
    <>
      <div className="energy-label">EM FIELD STRENGTH</div>
      <div className="energy-value">{emField.toFixed(2)}×</div>

      <input
        className="energy-slider em"
        type="range"
        min="4"
        max="8"
        step="0.01"
        value={emField}
        onChange={(e) => setEmField(+e.target.value)}
      />
    </>
  )}

 

</div>

      </div>
 
  );
}



