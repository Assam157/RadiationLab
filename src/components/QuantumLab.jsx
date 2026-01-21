 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BellLocalHiddenVariableLab from "./HiddenLocaalVariable";
import "./QuantumLab.css";

/* =====================================================
   Quantum Side — Experiment Lab Shell (Isolated)
   ===================================================== */

export default function QuantumSideLab() {
  const [activeExperiment, setActiveExperiment] = useState("bell");
  const navigate = useNavigate();

  const [thetaA, setThetaA] = useState(30);
  const [thetaB, setThetaB] = useState(60);

  const correlation =
    -Math.cos((2 * (thetaA - thetaB) * Math.PI) / 180);

  return (
    <div className="ql-root">
      {/* ================= LEFT PANEL ================= */}
      <div className="ql-sidebar">

        {/* BACK BUTTON */}
        <button
          className="ql-back-btn"
          onClick={() => navigate("/")}
        >
          ⬅ Back to Canvas
        </button>

        <h3 className="ql-title">Experiments</h3>

        <button
          className={`ql-exp-btn ${
            activeExperiment === "bell" ? "active" : ""
          }`}
          onClick={() => setActiveExperiment("bell")}
        >
          🧪 Bell Experiment
        </button>

        <button className="ql-exp-btn disabled" disabled>
          CHSH Inequality
        </button>
      </div>

      {/* ================= CENTER ================= */}
      <div className="ql-center">
        {activeExperiment === "bell" && <BellLocalHiddenVariableLab />}
        <div className="ql-overlay-title">
          Bell Experiment — Local Hidden Variable Model
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="ql-controls">
        <h3 className="ql-title green">Controls</h3>

        <div className="ql-control-group">
          <label>Detector A Angle θ₁</label>
          <input
            type="range"
            min="0"
            max="180"
            value={thetaA}
            onChange={(e) => setThetaA(+e.target.value)}
          />
          <span>{thetaA}°</span>
        </div>

        <div className="ql-control-group">
          <label>Detector B Angle θ₂</label>
          <input
            type="range"
            min="0"
            max="180"
            value={thetaB}
            onChange={(e) => setThetaB(+e.target.value)}
          />
          <span>{thetaB}°</span>
        </div>

        <div className="ql-info-box">
          E = −cos(2(θ₁ − θ₂)) = {correlation.toFixed(3)}
        </div>
      </div>
    </div>
  );
}
