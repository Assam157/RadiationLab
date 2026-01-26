import React, { useRef, useEffect, useState } from "react";

export default function NewtonThirdLawLab() {
  const canvasRef = useRef(null);
  const [fire, setFire] = useState(false);
  const [resetKey, setResetKey] = useState(0); // 🔑 reset trigger

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const GUN_Y = 320;
    const BARREL_OFFSET = 120;

    // 🔄 INITIAL STATE
    let gun = {
      x: 300,
      v: 0
    };

    let bullet = {
      x: gun.x + BARREL_OFFSET + 20,
      y: GUN_Y + 20,
      v: 0,
      fired: false,
      trail: []
    };

    let animationId;

    function drawGun() {
      ctx.fillStyle = "#334155";
      ctx.fillRect(gun.x, GUN_Y, 140, 40);
      ctx.fillRect(gun.x + BARREL_OFFSET, GUN_Y - 10, 50, 20);
      ctx.fillStyle = "#fff";
      ctx.fillText("Gun", gun.x + 50, GUN_Y - 15);
    }

    function drawBullet() {
      // dotted trajectory
      ctx.fillStyle = "#fde047";
      bullet.trail.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText("Bullet", bullet.x - 15, bullet.y - 15);
    }

    function drawGround() {
      ctx.strokeStyle = "#64748b";
      ctx.beginPath();
      ctx.moveTo(0, GUN_Y + 60);
      ctx.lineTo(canvas.width, GUN_Y + 60);
      ctx.stroke();
    }

    function drawText() {
      ctx.fillStyle = "#fff";
      ctx.fillText("Action: Gun pushes bullet forward", 20, 40);
      ctx.fillText("Reaction: Bullet pushes gun backward", 20, 65);
      ctx.fillText(
        "Forces are equal in magnitude and opposite in direction",
        20,
        95
      );
    }

    function updatePhysics() {
      if (fire && !bullet.fired) {
        bullet.v = 10;
        gun.v = -2;
        bullet.fired = true;
      }

      if (bullet.fired) {
        bullet.trail.push({ x: bullet.x, y: bullet.y });
        if (bullet.trail.length > 80) bullet.trail.shift();
      }

      bullet.x += bullet.v;
      gun.x += gun.v;

      bullet.v *= 0.995;
      gun.v *= 0.98;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updatePhysics();
      drawGround();
      drawGun();
      drawBullet();
      drawText();

      animationId = requestAnimationFrame(draw);
    }

    draw();

    // 🧹 CLEANUP on reset
    return () => cancelAnimationFrame(animationId);
  }, [fire, resetKey]); // 🔁 re-run on reset

  return (
    <div>
      <h2>🔄 Newton’s Third Law: Gun Recoil</h2>

      <button onClick={() => setFire(true)}>Fire Gun</button>

      <button
        onClick={() => {
          setFire(false);
          setResetKey(k => k + 1); // 🔄 reset simulation
        }}
      >
        Reset
      </button>

      <canvas ref={canvasRef} width={1200} height={500} />
    </div>
  );
}
