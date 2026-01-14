import React, { useEffect, useRef } from "react";
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
import DigitalGateLab from "./components/DigitalGateLogic";
import SidebarPhysicsLab from "./components/PhysicsLabSideBar";
import "./App.css";

/* ==============================
   MAIN MENU
================================ */
function DexterHome() {
  const navigate = useNavigate();
  const installEventRef = useRef(null);

  // Capture install event silently
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      installEventRef.current = e;
    });
  }, []);

  // ALWAYS try to install
  const triggerInstall = async () => {
    if (!installEventRef.current) {
      alert(
        "Install not available yet.\n\n" +
        "Chrome requires:\n" +
        "• Service Worker\n" +
        "• Valid manifest\n" +
        "• HTTPS\n\n" +
        "Check DevTools → Application → Manifest"
      );
      return;
    }

    installEventRef.current.prompt();
    await installEventRef.current.userChoice;
    installEventRef.current = null;
  };

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
      <h1>PARTICLE PHYSICS LAB CONSOLE</h1>

      {/* 🔥 INSTALL BUTTON — ALWAYS SHOWN */}
      <button
        className="lab-btn"
        style={{
          border: "2px solid #0f0",
          boxShadow: "0 0 20px #0f0"
        }}
        onClick={triggerInstall}
      >
        ⬇ INSTALL DEXTERS LAB
      </button>

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

      <button className="lab-btn" onClick={() => navigate("/digital")}>
        🧩 Digital Lab
      </button>
    </div>
  );
}

/* ==============================
   APP ROOT
================================ */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DexterHome />} />
        <Route path="/radiation" element={<RadiationPhysicsLab />} />
        <Route path="/optical" element={<OpticalDexterLab />} />
        <Route path="/semiconductor" element={<SemiconductorDexterLab />} />
        <Route path="/em" element={<EMLab />} />
        <Route path="/sid" element={<SidebarPhysicsLab />} />
        <Route path="/digital" element={<DigitalGateLab />} />
      </Routes>
    </Router>
  );
}

