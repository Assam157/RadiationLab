import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import RadiationSim from "./components/Rutherford";
import GoldFoilRadiation from "./components/GoldFoilRadiation";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="nav-bar">
      <button onClick={() => navigate("/")}>
        Rutherford Experiment
      </button>

      <button onClick={() => navigate("/radiation")}>
        α β γ Penetration
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<RadiationSim />} />
        <Route path="/radiation" element={<GoldFoilRadiation />} />
      </Routes>
    </BrowserRouter>
  );
}
