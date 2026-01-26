import React, { useRef, useEffect, useState } from "react";

export default function StaticElectricityLab() {
  const canvasRef = useRef(null);
  const [rubbing, setRubbing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const BALLOON = { x: 700, y: 260 };

    let handPhase = 0;

    // 🔴 Yellow particles (same logic as before)
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0
    }));

    function drawHand() {
      const offset = Math.sin(handPhase) * 20;
      ctx.fillStyle = "#f5cbaa";
      ctx.fillRect(520 + offset, 230, 100, 60); // palm
      ctx.fillRect(600 + offset, 250, 40, 15);  // fingers
      ctx.fillStyle = "#fff";
      ctx.fillText("Hand", 560 + offset, 220);
    }

    function drawBalloon() {
      ctx.beginPath();
      ctx.ellipse(BALLOON.x, BALLOON.y, 60, 80, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("Balloon", BALLOON.x - 25, BALLOON.y + 110);
    }

    function updateParticles() {
      particles.forEach(p => {
        if (rubbing) {
          // 🔹 CONVERGING (same logic)
          const dx = BALLOON.x - p.x;
          const dy = BALLOON.y - p.y;
          p.vx += dx * 0.0005;
          p.vy += dy * 0.0005;
        } else {
          // 🔹 DIVERGING (same logic)
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#facc15";
        ctx.fill();
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (rubbing) handPhase += 0.1;

      drawHand();
      drawBalloon();
      updateParticles();

      ctx.fillStyle = "#fff";
      ctx.fillText(
        rubbing
          ? "Rubbing → Electrons accumulate on balloon"
          : "No rubbing → Charges spread out",
        20,
        40
      );

      requestAnimationFrame(draw);
    }

    draw();
  }, [rubbing]);

  return (
    <div>
      <h2>⚡ Static Electricity: Rubbing Balloon</h2>

      <button onMouseDown={() => setRubbing(true)}
              onMouseUp={() => setRubbing(false)}>
        Rub Balloon
      </button>

      <canvas ref={canvasRef} width={1200} height={600} />
    </div>
  );
}
