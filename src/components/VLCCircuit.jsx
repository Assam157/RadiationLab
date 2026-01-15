import React, { useRef, useEffect, useState } from "react";

const W = 1100;
const H = 620;

export default function VICircuit() {
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
  const radius = 60;
  const dialOffsetY = -25;

  /* ===== BODY RECT (UNCHANGED DESIGN) ===== */
  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

  ctx.fillRect(x - 95, y - 75, 190, 115);
  ctx.strokeRect(x - 95, y - 75, 190, 115);

  /* ===== FULL CIRCLE DIAL (SHIFTED UP) ===== */
  ctx.beginPath();
  ctx.arc(x, y + 10 + dialOffsetY, radius-3, 0, Math.PI * 2);
  ctx.stroke();

  /* ===== TICK MARKS (FULL CIRCLE) ===== */
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(
      x + 52 * Math.cos(a),
      y + 10 + dialOffsetY - 52 * Math.sin(a)
    );
    ctx.lineTo(
      x + radius * Math.cos(a),
      y + 10 + dialOffsetY - radius * Math.sin(a)
    );
    ctx.stroke();
  }

  /* ===== NEEDLE ===== */
  const clamped = Math.max(0, Math.min(value, max));
  const ang = (clamped / max) * Math.PI * 2 - Math.PI / 2;

  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 10 + dialOffsetY);
  ctx.lineTo(
    x + 55 * Math.cos(ang),
    y + 10 + dialOffsetY - 55 * Math.sin(ang)
  );
  ctx.stroke();

  arrow(
    ctx,
    x + 55 * Math.cos(ang),
    y + 10 + dialOffsetY - 55 * Math.sin(ang),
    ang
  );

  /* ===== CENTER HUB ===== */
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y + 10 + dialOffsetY, 4, 0, Math.PI * 2);
  ctx.fill();

  /* ===== LABELS ===== */
  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText(label, x, y - 45);
  ctx.fillText(`${clamped.toFixed(2)} ${unit}`, x, y + 55);

  ctx.textAlign = "start";
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

    // VOLTMETER (SERIES ON TOP)
    analogMeter(ctx, 420, 180, "V", connected ? V : 0, 10, "V");

    // POTENTIOMETER
    const potX = 360;
    const potY = 300;

    ctx.strokeRect(potX, potY, 140, 50);
    ctx.beginPath();
    ctx.moveTo(potX + 10, potY + 25);
    ctx.lineTo(potX + 130, potY + 25);
    ctx.stroke();

    const knobX = potX + 10 + (R / 50) * 120;
    ctx.beginPath();
    ctx.arc(knobX, potY + 25, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillText(`R = ${R} Ω`, potX + 40, potY + 85);

    // AMMETER (PARALLEL, ROTATED)
    ctx.save();
    ctx.translate(970, 320);
    ctx.rotate(Math.PI / 2);
    analogMeter(ctx, 0, 0, "A", connected ? I : 0, 2, "A");
    ctx.restore();

    // PARALLEL WIRES
    wire(ctx, 860, 180, 930, 180);
    wire(ctx, 930, 180, 930, 230);
    wire(ctx, 860, 500, 930, 500);
    wire(ctx, 930, 500, 930, 410);
    

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
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ background: "#fff", border: "2px solid #000" }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setConnected(v => !v)}>
          {connected ? "Disconnect Battery" : "Connect Battery"}
        </button>

        <button onClick={() => setR(r => Math.max(1, r - 1))} style={{ marginLeft: 10 }}>
          − R
        </button>

         <button onClick={() => setR(r => Math.min(r + 1, 50))}style={{ marginLeft: 6 }}>
          + R
          </button>

      </div>
    </div>
  );
}
