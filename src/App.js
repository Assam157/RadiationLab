import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import RadiationPhysicsLab from "./components/RaadiationPhysicsLab";
import OpticalDexterLab from "./components/OpticalLab";
import SemiconductorDexterLab from "./components/SemiconducterLab";
import EMLab from "./components/EMLab";
import ProjectileMotionLab from "./components/ProjectileMotionLab";

/* ------------------------------
   MAIN MENU (DEXTER CONSOLE)
-------------------------------- */
function DexterHome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(#050505, #000)",
        color: "#0f0",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20
      }}
    >
      <h1>PHYSICS VIRTUAL LAB CONSOLE</h1>

      <button className="lab-btn" onClick={() => navigate("/radiation")}>
        ☢ Radiation Physics Lab
      </button>

      <button className="lab-btn" onClick={() => navigate("/optical")}>
        🔍 Optical Deflection Lab
      </button>

      <button className="lab-btn" onClick={() => navigate("/semiconductor")}>
        🔌 Semiconductor Lab
      </button>

      <button className="lab-btn" onClick={() => navigate("/em")}>
        🧲 Electromagnetism Lab
      </button>

      <button className="lab-btn" onClick={() => navigate("/sid")}>
        🚀 SID Physics Lab (Kinematics)
      </button>
    </div>
  );
}

/* ------------------------------
   APP ROOT
-------------------------------- */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DexterHome />} />
        <Route path="/radiation" element={<RadiationPhysicsLab />} />
        <Route path="/optical" element={<OpticalDexterLab />} />
        <Route path="/semiconductor" element={<SemiconductorDexterLab />} />
        <Route path="/em" element={<EMLab />} />
        <Route path="/sid" element={<ProjectileMotionLab />} />
      </Routes>
    </Router>
  );
}
