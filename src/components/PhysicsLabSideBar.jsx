import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectileMotionLab from "./ProjectileMotionLab";
import InverseSquareLawLab from "./InverseSquareLaw";
import CharlesLawExperiment from "./CharlesLawExperiment";
import CarnotEngineExperiment from "./KarnoughCycle";
import HeatingCurveWithParticles from "./StateTemp";
import "./SidebarPhysicsLab.css";

export default function SidebarPhysicsLab() {
  const [activeLab, setActiveLab] = useState("projectile");
  const navigate = useNavigate();

  return (
    <div className="sidebar-lab-root">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Physics Side Lab</h3>

        {/* 🔙 BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate("/")}>
          ⬅ Back to Console
        </button>

        <hr />

        <button
          className={activeLab === "projectile" ? "active" : ""}
          onClick={() => setActiveLab("projectile")}
        >
          🚀 Projectile Motion
        </button>

        <button
          className={activeLab === "inverse" ? "active" : ""}
          onClick={() => setActiveLab("inverse")}
        >
          🌍 Inverse Square Law
        </button>

        
        <button
          className={activeLab === "charles" ? "active" : ""}
          onClick={() => setActiveLab("charles")}
        >
           Charles Law Therodynamics
        </button>
         <button
          className={activeLab === "karnough" ? "active" : ""}
          onClick={() => setActiveLab("karnough")}
        >
            Karnough ENgine Duty Cycle
        </button>
         <button
          className={activeLab === "inverse" ? "active" : ""}
          onClick={() => setActiveLab("heat")}
        >
          Heting State Change Experiment
        </button>
      </div>

      {/* LAB VIEW */}
      <div className="lab-view">
        {activeLab === "projectile" && <ProjectileMotionLab />}
        {activeLab === "inverse" && <InverseSquareLawLab />}
        {activeLab === "charles" && <CharlesLawExperiment />}
        {activeLab ==="karnough" && <CarnotEngineExperiment/>}
        {activeLab ==="heat" && <HeatingCurveWithParticles/>}
      </div>
    </div>
  );
}
