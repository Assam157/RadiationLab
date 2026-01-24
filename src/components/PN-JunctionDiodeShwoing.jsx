import React, { useRef, useEffect, useState } from "react";

const DiodeBiasLab = () => {
  const canvasRef = useRef(null);

  const [bias, setBias] = useState("forward");
  const [voltage, setVoltage] = useState(0);

  // Diode parameters (educational model)
  const Is = 0.000001; // saturation current
  const Vt = 0.026; // thermal voltage

  // Compute current
  const getCurrent = (V) => {
    if (bias === "forward") {
      return Is * (Math.exp(V / Vt) - 1);
    } else {
      return -Is;
    }
  };

  // Draw V-I graph
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(40, H / 2);
    ctx.lineTo(W - 10, H / 2);
    ctx.moveTo(40, 10);
    ctx.lineTo(40, H - 10);
    ctx.stroke();

    // Plot curve
    ctx.strokeStyle = "#22c55e";
    ctx.beginPath();

    for (let v = -1; v <= 1; v += 0.01) {
      const i = getCurrent(v);
      const x = 40 + ((v + 1) / 2) * (W - 60);
      const y = H / 2 - i * 2000;
      if (v === -1) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Operating point
    const I = getCurrent(voltage);
    const x = 40 + ((voltage + 1) / 2) * (W - 60);
    const y = H / 2 - I * 2000;

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [voltage, bias]);

  return (
    <div style={styles.lab}>
      <h2>🔬 Semiconductor Lab — PN Diode</h2>

      {/* Bias Toggle */}
      <button
        onClick={() =>
          setBias(bias === "forward" ? "reverse" : "forward")
        }
        style={{
          ...styles.toggle,
          background: bias === "forward" ? "#22c55e" : "#ef4444",
        }}
      >
        {bias === "forward" ? "Forward Bias" : "Reverse Bias"}
      </button>

      {/* Voltage Slider */}
      <div style={styles.sliderBox}>
        <label>Voltage (V): {voltage.toFixed(2)}</label>
        <input
          type="range"
          min={bias === "forward" ? 0 : -1}
          max={bias === "forward" ? 1 : 0}
          step="0.01"
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
        />
      </div>

      {/* Diode Indicator */}
      <div style={styles.diode}>
        <div
          style={{
            ...styles.terminal,
            background: bias === "forward" ? "#22c55e" : "#64748b",
          }}
        />
        <span style={{ fontSize: "24px" }}>▶|</span>
        <div
          style={{
            ...styles.terminal,
            background: bias === "reverse" ? "#ef4444" : "#64748b",
          }}
        />
      </div>

      {/* Graph */}
      <canvas ref={canvasRef} width={600} height={300} style={styles.canvas} />
    </div>
  );
};

const styles = {
  lab: {
    background: "#020617",
    color: "#e5e7eb",
    padding: "20px",
    borderRadius: "12px",
    width: "fit-content",
    fontFamily: "Arial",
  },
  toggle: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "10px",
  },
  sliderBox: {
    margin: "10px 0",
  },
  diode: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  terminal: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
  },
  canvas: {
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "8px",
  },
};

export default DiodeBiasLab;
