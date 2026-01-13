import React, { useEffect, useRef, useState } from "react";
import { startFaraday } from "./FaradayCoil";
import "./EMLab.css";

export default function FaradayExperiment() {
  const canvasRef = useRef(null);
  const faradayRef = useRef(null);

  const [control, setControl] = useState(0);

  // 🔧 tuning parameters
  const STEP = 0.04;       // how fast A/D changes slider
  const RETURN = 0.02;     // how fast it returns to 0
  const LIMIT = 1;

  const keysRef = useRef({ a: false, d: false });

  /* ================= START FARADAY ================= */
  useEffect(() => {
    faradayRef.current = startFaraday(canvasRef.current);

    return () => {
      if (faradayRef.current) faradayRef.current.stop();
    };
  }, []);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    function keyDown(e) {
      if (e.key === "a" || e.key === "A") keysRef.current.a = true;
      if (e.key === "d" || e.key === "D") keysRef.current.d = true;
    }

    function keyUp(e) {
      if (e.key === "a" || e.key === "A") keysRef.current.a = false;
      if (e.key === "d" || e.key === "D") keysRef.current.d = false;
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  /* ================= SMOOTH CONTROL LOOP ================= */
  useEffect(() => {
    let raf;

    function update() {
      setControl(prev => {
        let v = prev;

        if (keysRef.current.a) v -= STEP;
        if (keysRef.current.d) v += STEP;

        // auto return to zero
        if (!keysRef.current.a && !keysRef.current.d) {
          if (v > 0) v = Math.max(0, v - RETURN);
          if (v < 0) v = Math.min(0, v + RETURN);
        }

        // clamp
        v = Math.max(-LIMIT, Math.min(LIMIT, v));

        if (faradayRef.current) {
          faradayRef.current.setControl(v);
        }

        return v;
      });

      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ================= SLIDER ================= */
  function onSlider(e) {
    const v = parseFloat(e.target.value);
    setControl(v);
    if (faradayRef.current) faradayRef.current.setControl(v);
  }

  return (
    <div className="lab-canvas-wrap">
      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />

      {/* CONTROL PANEL */}
      <div className="cinema-energy">
        <div className="label">MAGNET MOTION</div>

        <div className="value">
          {control < -0.05 && "A (Left)"}
          {Math.abs(control) <= 0.05 && "Rest"}
          {control > 0.05 && "D (Right)"}
        </div>

        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={control}
          onChange={onSlider}
        />

        <div className="panel-hint">
          Use <b>A</b> / <b>D</b> keys or drag slider
        </div>
      </div>
    </div>
  );
}
