 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectileMotionLab from "./ProjectileMotionLab";
import InverseSquareLawLab from "./InverseSquareLaw";
import CharlesLawExperiment from "./CharlesLawExperiment";
import CarnotEngineExperiment from "./KarnoughCycle";
import HeatingCurveWithParticles from "./StateTemp";
import PendulumEnergyLab from "./PendulamExperiment";
import DampedPendulumEnergyLab from "./DampedPendulamExperiment";
import HorizontalSpringWithFriction from "./SHMHorizental";
import SHMLab from "./SHMexperiment";

import "./SidebarPhysicsLab.css";

/* ================= GLOBAL CANVAS SIZE ================= */
const GLOBAL_W = 2800;
const GLOBAL_H = 920;

export default function SidebarPhysicsLab() {
  const [activeLab, setActiveLab] = useState("projectile");
  const navigate = useNavigate();

  return (
    <div className="sidebar-lab-root">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h3>Physics Side Lab</h3>

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
          className={activeLab === "shm" ? "active" : ""}
          onClick={() => setActiveLab("shm")}
        >
           SHM (Simple Harmonic Motion)
        </button>

        <button
          className={activeLab === "inverse" ? "active" : ""}
          onClick={() => setActiveLab("inverse")}
        >
          🌍 Inverse Square Law
        </button>
         <button
          className={activeLab === "horizentalshm" ? "active" : ""}
          onClick={() => setActiveLab("horizentalshm")}
        >
           SHM_Horizental
        </button>

        <button
          className={activeLab === "pendulam" ? "active" : ""}
          onClick={() => setActiveLab("pendulam")}
        >
          Pendulum Lab
        </button>
        <button
          className={activeLab === "damp_pendulam" ? "active" : ""}
          onClick={() => setActiveLab("damp_pendulam")}
        >
          Damped Pendulum Lab
        </button>

        <button
          className={activeLab === "charles" ? "active" : ""}
          onClick={() => setActiveLab("charles")}
        >
          Charles Law Thermodynamics
        </button>

        <button
          className={activeLab === "karnough" ? "active" : ""}
          onClick={() => setActiveLab("karnough")}
        >
          Carnot Engine Duty Cycle
        </button>

        <button
          className={activeLab === "heat" ? "active" : ""}
          onClick={() => setActiveLab("heat")}
        >
          Heating State Change
        </button>
      </div>

      {/* ================= LAB VIEW ================= */}
      <div className="lab-view">
        {/* GLOBAL VIEWPORT */}
        <div
          className="global-canvas-frame"
          style={{
            width: GLOBAL_W,
            height: GLOBAL_H
          }}
        >
          <div className="global-canvas-scale">
            {activeLab === "projectile" && <ProjectileMotionLab />}
            {activeLab === "inverse" && <InverseSquareLawLab />}
            {activeLab === "charles" && <CharlesLawExperiment />}
            {activeLab === "karnough" && <CarnotEngineExperiment />}
            {activeLab === "heat" && <HeatingCurveWithParticles />}
            {activeLab === "pendulam" && <PendulumEnergyLab />}
            {activeLab === "damp_pendulam" && <DampedPendulumEnergyLab/>}
            {activeLab === "shm" && <SHMLab/>}
            {activeLab === "horizentalshm" && <HorizontalSpringWithFriction/>}
          </div>
        </div>
      </div>
    </div>
  );
}
