import React, { useRef, useEffect, useState } from "react";

const g = 9.81;

export default function PendulumEnergyLab() {
  const pendulumRef = useRef(null);
  const graphRef = useRef(null);
  const animationRef = useRef(null);

  const [length, setLength] = useState(180);   // controls string length
  const [mass, setMass] = useState(1);         // controls energy magnitude
  const [angle0, setAngle0] = useState(30);    // controls initial swing
  const [running, setRunning] = useState(true);

  const startTime = useRef(null);
  const energyData = useRef([]);

  useEffect(() => {
    const pctx = pendulumRef.current.getContext("2d");
    const gctx = graphRef.current.getContext("2d");

    const PW = pendulumRef.current.width;
    const PH = pendulumRef.current.height;

    function animate(time) {
      if (!running) return;

      if (!startTime.current) startTime.current = time;
      const t = (time - startTime.current) / 1000;

      const omega = Math.sqrt(g / (length / 100));
      const theta0 = (angle0 * Math.PI) / 180;
      const theta = theta0 * Math.cos(omega * t);

      /* ===== ENERGIES ===== */
      const h = (length / 100) * (1 - Math.cos(theta));
      const PE = mass * g * h;
      const TE = mass * g * (length / 100) * (1 - Math.cos(theta0));
      const KE = Math.max(0, TE - PE);

      energyData.current.push({ KE, PE });
      if (energyData.current.length > 260) energyData.current.shift();

      /* ===== PENDULUM ===== */
      pctx.clearRect(0, 0, PW, PH);

      const ox = PW / 2;
      const oy = 30;
      const x = ox + length * Math.sin(theta);
      const y = oy + length * Math.cos(theta);

      // 🔵 Pendulum string (blue, attached to bob)
      pctx.strokeStyle = "#00aaff";
      pctx.lineWidth = 2;
      pctx.beginPath();
      pctx.moveTo(ox, oy);
      pctx.lineTo(x, y);
      pctx.stroke();

      // Bob
      pctx.fillStyle = "#ff5555";
      pctx.beginPath();
      pctx.arc(x, y, 12, 0, Math.PI * 2);
      pctx.fill();

      // Pivot
      pctx.fillStyle = "#ffffff";
      pctx.beginPath();
      pctx.arc(ox, oy, 4, 0, Math.PI * 2);
      pctx.fill();

      /* ===== ENERGY GRAPH ===== */
      gctx.clearRect(0, 0, 320, 200);

      gctx.strokeStyle = "#aaa";
      gctx.beginPath();
      gctx.moveTo(40, 10);
      gctx.lineTo(40, 190);
      gctx.lineTo(300, 190);
      gctx.stroke();

      function plot(color, key) {
        gctx.strokeStyle = color;
        gctx.beginPath();
        energyData.current.forEach((p, i) => {
          const gx = 40 + i;
          const gy = 190 - p[key] * 12;
          i === 0 ? gctx.moveTo(gx, gy) : gctx.lineTo(gx, gy);
        });
        gctx.stroke();
      }

      plot("#00ff00", "KE");
      plot("#00aaff", "PE");

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [length, mass, angle0, running]);

  return (
    <div style={{ display: "flex", gap: 20, color: "#fff" }}>
      <canvas ref={pendulumRef} width={300} height={300} />

      <div>
        <canvas ref={graphRef} width={320} height={200} />

        <p style={{ color: "#00ff00" }}>Kinetic Energy (KE)</p>
        <p style={{ color: "#00aaff" }}>Potential Energy (PE)</p>

        {/* 🔹 SLIDERS WITH CLEAR LABELS */}
        <div>
          <label style={{ color: "#000" }}>
            Pendulum Length (controls string length): <b>{length}px</b>
          </label>
          <input
            type="range"
            min="100"
            max="250"
            value={length}
            onChange={e => setLength(+e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: "#000" }}>
            Mass of Bob (controls energy magnitude): <b>{mass} kg</b>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={mass}
            onChange={e => setMass(+e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: "#000" }}>
            Initial Angle (controls swing amplitude): <b>{angle0}°</b>
          </label>
          <input
            type="range"
            min="10"
            max="60"
            value={angle0}
            onChange={e => setAngle0(+e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            startTime.current = null;
            setRunning(r => !r);
          }}
        >
          {running ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
