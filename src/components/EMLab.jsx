import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WireExperiment from "./WireExperiment";
import AtomExperiment from "./AtomExcitation";
import BandGapExperiment from "./BandgapExperiment";
import FaradayExperiment from "./FaradayExperiment";
import VICircuit from "./VLCCircuit";   // ✅ ADD THIS

import "./EMLab.css";

export default function EMLab() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("wire");

  return (
    <div className="lab-root">
      {/* LEFT PANEL */}
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

        {/* ✅ NEW BUTTON */}
        <button
          className={`panel-btn ${mode === "vi" ? "active" : ""}`}
          onClick={() => setMode("vi")}
        >
          V–I Characteristics
        </button>
      </div>

      {/* MAIN VIEW */}
      <div className="lab-canvas-wrap">
        {mode === "wire" && <WireExperiment />}
        {mode === "atom" && <AtomExperiment />}
        {mode === "bandgap" && <BandGapExperiment />}
        {mode === "faraday" && <FaradayExperiment />}
        {mode === "vi" && <VICircuit />}   {/* ✅ RENDERED HERE */}

        <button className="lab-back" onClick={() => navigate("/")}>
          ← BACK
        </button>
      </div>
    </div>
  );
}
