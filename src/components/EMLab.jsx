import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WireExperiment from "./WireExperiment";
import AtomExperiment from "./AtomExcitation";
import BandGapExperiment from "./BandgapExperiment";
import FaradayExperiment from "./FaradayExperiment";
import WaveInterferenceExperiment from "./WaveExperiment";
import VICircuit from "./VLCCircuit";
import OrbitalBoxes from "./ElectronBoxes";

import "./EMLab.css";

/* ================= GLOBAL CANVAS SIZE ================= */
const GLOBAL_W = 1200;
const GLOBAL_H = 620;

export default function EMLab() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("wire");

  return (
    <div className="lab-root">
      {/* ================= LEFT PANEL ================= */}
      <div className="lab-panel">
        <div className="lab-panel-title">EXPERIMENTS</div>

        <button
          className={`panel-btn ${mode === "wire" ? "active" : ""}`}
          onClick={() => setMode("wire")}
        >
          Current-Carrying Wires
        </button>

        <button
          className={`panel-btn ${mode === "atom" ? "active" : ""}`}
          onClick={() => setMode("atom")}
        >
          Electron Excitation
        </button>

        <button
          className={`panel-btn ${mode === "bandgap" ? "active" : ""}`}
          onClick={() => setMode("bandgap")}
        >
          Band Gap Transitions
        </button>

        <button
          className={`panel-btn ${mode === "faraday" ? "active" : ""}`}
          onClick={() => setMode("faraday")}
        >
          Faraday Induction
        </button>

        <button
          className={`panel-btn ${mode === "wave" ? "active" : ""}`}
          onClick={() => setMode("wave")}
        >
          Wave Experiment
        </button>

        <button
          className={`panel-btn ${mode === "vi" ? "active" : ""}`}
          onClick={() => setMode("vi")}
        >
          V–I Characteristics
        </button>

        <button
          className={`panel-btn ${mode === "boxes" ? "active" : ""}`}
          onClick={() => setMode("boxes")}
        >
          Electron Boxes
        </button>
      </div>

      {/* ================= CENTER VIEWPORT ================= */}
      <div className="lab-canvas-wrap">
        {/* GLOBAL VIEWPORT */}
        <div
          className="global-canvas-frame"
          style={{
            width: GLOBAL_W,
            height: GLOBAL_H
          }}
        >
          {/* SCALE LAYER */}
          <div className="global-canvas-scale">
            {mode === "wire" && <WireExperiment />}
            {mode === "atom" && <AtomExperiment />}
            {mode === "bandgap" && <BandGapExperiment />}
            {mode === "faraday" && <FaradayExperiment />}
            {mode === "wave" && <WaveInterferenceExperiment />}
            {mode === "vi" && <VICircuit />}
            {mode === "boxes" && <OrbitalBoxes />}
          </div>
        </div>

        {/* BACK */}
        <button className="lab-back" onClick={() => navigate("/")}>
          ← BACK
        </button>
      </div>
    </div>
  );
}
