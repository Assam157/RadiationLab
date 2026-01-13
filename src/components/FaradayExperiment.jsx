// src/components/faraday/FaradayExperiment.jsx

import React, { useEffect, useRef } from "react";
import { startFaraday } from "./FaradayCoil";
import "./EMLab.css";

export default function FaradayExperiment() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Start Faraday experiment
    const stop = startFaraday(canvas);

    // Cleanup on unmount
    return () => {
      if (stop) stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={700}
      style={{ display: "block", margin: "auto" }}
    />
  );
}
