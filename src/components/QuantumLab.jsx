import React, { useState } from "react";
import BellLocalHiddenVariableLab from "./HiddenLocaalVariable";
import "./QuantumLab.css"
/* =====================================================
   Quantum Side — Experiment Lab Shell
   ===================================================== */

export default function QuantumSideLab() {
  /* ===== Experiment selection ===== */
  const [activeExperiment, setActiveExperiment] = useState("bell");

  /* ===== Right panel sliders (quantum reference) ===== */
  const [thetaA, setThetaA] = useState(30);
  const [thetaB, setThetaB] = useState(60);

  const correlation =
    -Math.cos((2 * (thetaA - thetaB) * Math.PI) / 180);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "260px 1fr 300px",
        background: "#020617",
        color: "white",
        overflow: "hidden"
      }}
    >
      {/* ================= LEFT PANEL ================= */}
      <div
        style={{
          borderRight: "1px solid #1e293b",
          padding: 16
        }}
      >
        <h3 style={{ color: "#38bdf8", marginBottom: 12 }}>
          Experiments
        </h3>

        {/* Bell Experiment Button */}
        <button
          onClick={() => setActiveExperiment("bell")}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border:
              activeExperiment === "bell"
                ? "1px solid #38bdf8"
                : "1px solid #334155",
            background:
              activeExperiment === "bell"
                ? "rgba(56,189,248,0.15)"
                : "#020617",
            color: "#e5e7eb",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          Bell Experiment
        </button>
         <button
          onClick={() => setActiveExperiment("bell")}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border:
              activeExperiment === "bell"
                ? "1px solid #38bdf8"
                : "1px solid #334155",
            background:
              activeExperiment === "bell"
                ? "rgba(56,189,248,0.15)"
                : "#020617",
            color: "#e5e7eb",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          Bell Experiment
        </button>
      </div>

      {/* ================= CENTER CANVAS ================= */}
      <div style={{ position: "relative" }}>
        {activeExperiment === "bell" && (
          <BellLocalHiddenVariableLab />
        )}

        {/* Overlay title */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
            padding: "6px 16px",
            borderRadius: 12,
            fontSize: 14,
            color: "#facc15",
            pointerEvents: "none"
          }}
        >
          Bell Experiment — Local Hidden Variable Model
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        style={{
          borderLeft: "1px solid #1e293b",
          padding: 16
        }}
      >
        <h3 style={{ color: "#34d399", marginBottom: 12 }}>
          Controls
        </h3>

        <div style={{ marginBottom: 18 }}>
          <label>Detector A Angle θ₁</label>
          <input
            type="range"
            min="0"
            max="180"
            value={thetaA}
            onChange={(e) => setThetaA(+e.target.value)}
            style={{ width: "100%" }}
          />
          <span>{thetaA}°</span>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label>Detector B Angle θ₂</label>
          <input
            type="range"
            min="0"
            max="180"
            value={thetaB}
            onChange={(e) => setThetaB(+e.target.value)}
            style={{ width: "100%" }}
          />
          <span>{thetaB}°</span>
        </div>

        <hr style={{ borderColor: "#1e293b", margin: "14px 0" }} />

        <div style={{ fontSize: 14 }}>
          <div style={{ color: "#94a3b8" }}>
            Quantum reference correlation:
          </div>

          <div
            style={{
              marginTop: 6,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#020617",
              color: "#60a5fa"
            }}
          >
            E = −cos(2(θ₁ − θ₂)) = {correlation.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}
