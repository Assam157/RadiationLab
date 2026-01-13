import React, { useEffect, useRef, useState } from "react";

const W = 800;
const H = 300;

export default function PolarisationSimple() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0); // analyser angle (deg)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function clear() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    function arrow(x, y, theta, color, alpha = 1) {
      const L = 20;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(theta);
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-L, 0);
      ctx.lineTo(L, 0);
      ctx.stroke();
      ctx.restore();
    }

    function unpolarised(x) {
      for (let i = 0; i < 10; i++) {
        arrow(
          x,
          50 + i * 18,
          Math.random() * Math.PI,
          "255,80,80"
        );
      }
    }

    function polarised(x, theta, I = 1) {
      for (let i = 0; i < 10; i++) {
        arrow(
          x,
          50 + i * 18,
          theta,
          "80,255,80",
          I
        );
      }
    }

    function plate(x, label) {
      ctx.fillStyle = "#222";
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 2;
      ctx.fillRect(x - 12, 30, 24, 200);
      ctx.strokeRect(x - 12, 30, 24, 200);

      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.fillText(label, x - 5, 20);
    }

    function axis(x, theta) {
      ctx.save();
      ctx.translate(x, H / 2);
      ctx.rotate(theta);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(0, -80);
      ctx.lineTo(0, 80);
      ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
    }

    function draw() {
      clear();

      // Unpolarised light
      unpolarised(100);

      // Polariser
      plate(180, "P");
      axis(180, Math.PI / 2);

      // Plane polarised
      polarised(260, Math.PI / 2);

      // Analyser
      plate(340, "A");
      axis(340, (angle * Math.PI) / 180);

      // Malus law
      const I = Math.cos((angle * Math.PI) / 180) ** 2;

      if (I > 0.01) {
        polarised(420, Math.PI / 2, I);
      }

      ctx.fillStyle = I < 0.01 ? "#ff4444" : "#00ff00";
      ctx.font = "bold 16px monospace";
      ctx.fillText(
        I < 0.01 ? "NO LIGHT" : "LIGHT TRANSMITTED",
        520,
        60
      );

      ctx.fillStyle = "#aaa";
      ctx.font = "14px monospace";
      ctx.fillText("Unpolarised", 60, 270);
      ctx.fillText("Polarised", 230, 270);
      ctx.fillText("Analysed", 390, 270);
      ctx.fillText("I = I₀ cos²θ", 560, 270);
    }

    draw();
  }, [angle]);

  return (
    <div style={{ background: "#000", padding: 20 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: "block", margin: "auto", border: "1px solid #333" }}
      />

      <div style={{ marginTop: 20, textAlign: "center", color: "#0f0" }}>
        <div>Analyser Angle: {angle}°</div>
        <input
          type="range"
          min="0"
          max="90"
          value={angle}
          onChange={(e) => setAngle(+e.target.value)}
          style={{ width: 300 }}
        />
      </div>
    </div>
  );
}
