import React, { useRef, useEffect, useState } from "react";

const W = 1100;
const H = 620;

export default function App() {
  const canvasRef = useRef(null);
  const tRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const [R, setR] = useState(10);

  const V = 10;
  const I = connected ? V / R : 0;

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawCircuit(ctx);
      if (connected) tRef.current += 1.5;
      requestAnimationFrame(animate);
    }
    animate();
  }, [connected, R]);

  /* ---------------- BASIC HELPERS ---------------- */

  function wire(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function arrow(ctx, x, y, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(8, 0);
    ctx.lineTo(-6, 4);
    ctx.fillStyle = "#16a34a";
    ctx.fill();
    ctx.restore();
  }

  function flow(ctx, x1, y1, x2, y2, a) {
    const L = Math.hypot(x2 - x1, y2 - y1);
    const d = (tRef.current * 2) % L;
    arrow(
      ctx,
      x1 + ((x2 - x1) * d) / L,
      y1 + ((y2 - y1) * d) / L,
      a
    );
  }

  /* ---------------- ANALOG METER ---------------- */

  function analogMeter(ctx, x, y, label, value, max, unit) {
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillRect(x - 95, y - 75, 190, 115);
    ctx.strokeRect(x - 95, y - 75, 190, 115);

    ctx.beginPath();
    ctx.arc(x, y + 10, 60, Math.PI, 0);
    ctx.stroke();

    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * (1 - i / 10);
      ctx.beginPath();
      ctx.moveTo(
        x + 52 * Math.cos(a),
        y + 10 - 52 * Math.sin(a)
      );
      ctx.lineTo(
        x + 60 * Math.cos(a),
        y + 10 - 60 * Math.sin(a)
      );
      ctx.stroke();
    }

    const ang = Math.PI * (1 - value / max);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(
      x + 55 * Math.cos(ang),
      y + 10 - 55 * Math.sin(ang)
    );
    ctx.stroke();

    arrow(
      ctx,
      x + 55 * Math.cos(ang),
      y + 10 - 55 * Math.sin(ang),
      ang
    );

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "14px sans-serif";
    ctx.fillText(label, x - 6, y - 45);
    ctx.fillText(
      value.toFixed(2) + " " + unit,
      x - 35,
      y + 55
    );
  }

  /* ---------------- CIRCUIT ---------------- */

  function drawCircuit(ctx) {
    // MAIN LOOP
    wire(ctx, 160, 320, 420, 320);
    wire(ctx, 420, 320, 420, 180);
    wire(ctx, 420, 180, 860, 180);
    wire(ctx, 860, 180, 860, 500);
    wire(ctx, 860, 500, 420, 500);
    wire(ctx, 420, 500, 420, 320);

    // BATTERY
    wire(ctx, 140, 290, 140, 350);
    wire(ctx, 120, 305, 120, 335);
    ctx.fillText("Battery 10V", 80, 370);

    // SWITCH
    ctx.beginPath();
    ctx.moveTo(160, 320);
    ctx.lineTo(connected ? 190 : 180, connected ? 320 : 285);
    ctx.stroke();
    ctx.fillText(connected ? "Closed" : "Open", 155, 280);

     
     /* ================= INSTRUMENT CONNECTIONS (SWAPPED & CLEAN) ================= */

// ---------- VOLTMETER IN SERIES (ON MAIN LOOP TOP) ----------
analogMeter(ctx, 420, 180, "V", connected ? V : 0, 10, "V");
ctx.fillText("SERIES", 385, 130);

// ---------- POTENTIOMETER (STRAIGHT, SHIFTED RIGHT – FIXED) ----------
const potX = 360;   // <<< CHANGE THIS VALUE to move left/right
const potY = 300;

ctx.strokeRect(potX, potY, 140, 50);

// resistive track
ctx.beginPath();
ctx.moveTo(potX + 10, potY + 25);
ctx.lineTo(potX + 130, potY + 25);
ctx.stroke();

// slider knob (moves with R)
const knobX = potX + 10 + (R / 50) * 120;
ctx.beginPath();
ctx.arc(knobX, potY + 25, 6, 0, Math.PI * 2);
ctx.fill();

// labels
ctx.fillText("Potentiometer", potX + 10, potY + 70);
ctx.fillText(`R = ${R} Ω`, potX + 45, potY + 90);

// ---------- AMMETER IN PARALLEL (ROTATED 90° CLOCKWISE) ----------
ctx.save();

// move origin to ammeter center
ctx.translate(980, 320);

// rotate 90° clockwise
ctx.rotate(Math.PI / 2);

// draw meter at rotated origin
analogMeter(ctx, 0, 0, "A", connected ? I : 0, 2, "A");

ctx.restore();

// label (keep normal orientation)
ctx.fillText("PARALLEL", 940, 260);

// ---- PARALLEL BRANCH WIRES (OUTSIDE RECTANGLE) ----

// top branch: go right OUT of rectangle, then down
wire(ctx, 860, 180, 930, 180);   // exit main loop to the right
wire(ctx, 930, 180, 930, 230);   // down towards ammeter
wire(ctx, 930, 230, 940, 230);   // into ammeter top terminal

// bottom branch: go right OUT of rectangle, then up
wire(ctx, 860, 500, 930, 500);   // exit main loop to the right
wire(ctx, 930, 500, 930, 410);   // up towards ammeter
wire(ctx, 930, 410, 940, 410);   // into ammeter bottom terminal

/* ========================================================================== */

    // CURRENT FLOW
    if (connected) {
      flow(ctx, 160, 320, 420, 320, 0);
      flow(ctx, 420, 320, 420, 180, -Math.PI / 2);
      flow(ctx, 420, 180, 860, 180, 0);
      flow(ctx, 860, 180, 860, 500, Math.PI / 2);
      flow(ctx, 860, 500, 420, 500, Math.PI);
    }
  }

  return (
    <div style={{ background: "#e5e7eb", minHeight: "100vh", textAlign: "center" }}>
      <h2>V–I Characteristics Experiment (Analog Instruments)</h2>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ background: "#fff", border: "2px solid #000" }}
      />

      <div style={{ marginTop: 15 }}>
        <button onClick={() => setConnected(v => !v)}>
          {connected ? "Disconnect Battery" : "Connect Battery"}
        </button>

        <button onClick={() => setR(r => Math.max(1, r - 1))} style={{ marginLeft: 15 }}>
          − R
        </button>

        <button onClick={() => setR(r => r + 1)} style={{ marginLeft: 10 }}>
          + R
        </button>
      </div>

      <p style={{ marginTop: 10 }}>
        Ammeter in <b>Series</b> | Voltmeter in <b>Parallel</b> | Reading shown below pointer
      </p>
    </div>
  );
}
