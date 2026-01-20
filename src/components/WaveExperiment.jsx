import React, { useEffect, useRef, useState } from "react";
import "./EMLabWave.css";

export default function WaveInterferenceExperiment() {
  const canvasRef = useRef(null);

  // Wave controls
  const [amp1, setAmp1] = useState(50);
  const [amp2, setAmp2] = useState(50);
  const [phase, setPhase] = useState(Math.PI);
  const [freq, setFreq] = useState(0.02);
  const interference = getInterferenceType(amp1, amp2, phase);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const midY = canvas.height / 2;

      // ---- Wave 1 ----
      ctx.strokeStyle = "#1e90ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y1 = amp1 * Math.sin(freq * x + t);
        ctx.lineTo(x, midY + y1);
      }
      ctx.stroke();

      // ---- Wave 2 ----
      ctx.strokeStyle = "#ff8c00";
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y2 = amp2 * Math.sin(freq * x + t + phase);
        ctx.lineTo(x, midY + y2);
      }
      ctx.stroke();

      // ---- Resultant (Superposition) ----
      ctx.strokeStyle = "#c4002f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y =
          amp1 * Math.sin(freq * x + t) +
          amp2 * Math.sin(freq * x + t + phase);
        ctx.lineTo(x, midY + y);
      }
      ctx.stroke();

      t += 0.05;
      requestAnimationFrame(draw);
    };

    draw();
  }, [amp1, amp2, phase, freq]);
  
function getInterferenceType(amp1, amp2, phase) {
  // phase normalized between 0 and 2π
  const phi = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  const equalAmps = Math.abs(amp1 - amp2) < 5;
  const destructive =
    Math.abs(phi - Math.PI) < 0.3 && equalAmps;

  if (destructive) {
    return {
      label: "Destructive Interference",
      color: "#c4002f"
    };
  }

  if (phi < 0.3 || Math.abs(phi - 2 * Math.PI) < 0.3) {
    return {
      label: "Constructive Interference (Superposition)",
      color: "#1e8f3f"
    };
  }

  return {
    label: "Wave Superposition",
    color: "#1e90ff"
  };
}


  return (
    <div className="emlab-container">
      <h2>Wave Superposition & Destructive Interference</h2>

      <div className="emlab-row">
        

        {/* Simulation */}
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="emlab-canvas"
        />
      </div>

      {/* Controls */}
      <div className="controls">
        <div>
          <label>Amplitude Wave 1: {amp1}</label>
          <input
            type="range"
            min="0"
            max="80"
            value={amp1}
            onChange={e => setAmp1(+e.target.value)}
          />
        </div>

        <div>
          <label>Amplitude Wave 2: {amp2}</label>
          <input
            type="range"
            min="0"
            max="80"
            value={amp2}
            onChange={e => setAmp2(+e.target.value)}
          />
        </div>

        <div>
          <label>Phase Difference (ϕ): {phase.toFixed(2)} rad</label>
          <input
            type="range"
            min="0"
            max={2 * Math.PI}
            step="0.1"
            value={phase}
            onChange={e => setPhase(+e.target.value)}
          />
        </div>

        <div>
          <label>Frequency: {freq.toFixed(3)}</label>
          <input
            type="range"
            min="0.005"
            max="0.05"
            step="0.005"
            value={freq}
            onChange={e => setFreq(+e.target.value)}
          />
        </div>
      </div>
      <div
  style={{
    marginTop: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    color: interference.color
  }}
>
  {interference.label}
</div>


      <p className="note">
        When phase difference ≈ π, destructive interference occurs and the
        resultant amplitude reduces.
      </p>
    </div>
  );
}
