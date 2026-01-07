import React, { useEffect, useRef, useState } from "react";
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

  /* SLIDERS */
  const [energy, setEnergy] = useState(1.0);
  const [emField, setEmField] = useState(1.0);

  /* PARTICLE SWITCHES (styled as buttons) */
  const [particles, setParticles] = useState({
    alpha: true,
    beta: false,
    gamma: false
  });

  /* EXPERIMENT TOGGLE BUTTONS */
  const [experiments, setExperiments] = useState({
    gold: true,
    shield: false,
    emfield: false
  });

  const toggleParticle = (k) =>
    setParticles(p => ({ ...p, [k]: !p[k] }));

  const toggleExperiment = (k) =>
    setExperiments(e => ({ ...e, [k]: !e[k] }));

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
      const deflect = factor * emField * 140 / Math.max(energy, 0.2);

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
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(360, 120, 180, 180);
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
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawSource();

      if (experiments.gold) drawGoldFoil();
      if (experiments.shield) drawShielding();
      if (experiments.emfield) drawEMField();

      drawRays();

      tRef.current += 3;
      requestAnimationFrame(loop);
    }

    ctx.font = "14px monospace";
    loop();
  }, [particles, experiments, energy, emField]);

  return (
    <div className="dexter-root">
      <div className="control-panel">
        <h2>☢ RADIATION LAB</h2>

        {/* Experiment buttons */}
        <button className={experiments.gold ? "active" : ""} onClick={() => toggleExperiment("gold")}>GOLD</button>
        <button className={experiments.shield ? "active" : ""} onClick={() => toggleExperiment("shield")}>SHIELD</button>
        <button className={experiments.emfield ? "active em" : ""} onClick={() => toggleExperiment("emfield")}>EM</button>

        {/* Particle switches styled as buttons */}
        <div style={{ marginTop: 20 }}>
          <button className={`alpha ${particles.alpha ? "active" : ""}`} onClick={() => toggleParticle("alpha")}>α ALPHA</button>
          <button className={`beta ${particles.beta ? "active" : ""}`} onClick={() => toggleParticle("beta")}>β BETA</button>
          <button className={`gamma ${particles.gamma ? "active" : ""}`} onClick={() => toggleParticle("gamma")}>γ GAMMA</button>
        </div>
      </div>

      <canvas ref={canvasRef} width={W} height={H} />

      {/* RIGHT PANEL */}
      <div className="energy-panel">
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

        {experiments.emfield && (
          <>
            <div className="energy-label">EM FIELD</div>
            <div className="energy-value">{emField.toFixed(2)}×</div>

            <input
              className="energy-slider em"
              type="range"
              min="0"
              max="3"
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
