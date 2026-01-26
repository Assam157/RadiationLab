import React, { useRef, useEffect, useState } from "react";

export default function MomentumConservationLab() {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0); // 🔑 reset trigger

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 🔄 INITIAL STATE
    let cart1 = { x: 100, v: 4, m: 2 };
    let cart2 = { x: 500, v: 0, m: 2 };

    let animationId;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (running) {
        cart1.x += cart1.v;
        cart2.x += cart2.v;

        // Collision (elastic)
        if (cart1.x + 50 >= cart2.x) {
          const v1 =
            ((cart1.m - cart2.m) / (cart1.m + cart2.m)) * cart1.v;
          const v2 =
            ((2 * cart1.m) / (cart1.m + cart2.m)) * cart1.v;

          cart1.v = v1;
          cart2.v = v2;
        }
      }

      // Cart 1
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(cart1.x, 300, 50, 30);
      ctx.fillStyle = "#fff";
      ctx.fillText("Cart A", cart1.x, 290);

      // Cart 2
      ctx.fillStyle = "#f97316";
      ctx.fillRect(cart2.x, 300, 50, 30);
      ctx.fillStyle = "#fff";
      ctx.fillText("Cart B", cart2.x, 290);

      animationId = requestAnimationFrame(draw);
    }

    draw();

    // 🧹 CLEANUP on reset
    return () => cancelAnimationFrame(animationId);
  }, [running, resetKey]); // 🔁 re-run on reset

  return (
    <div>
      <h2>🚀 Conservation of Momentum</h2>

      <button onClick={() => setRunning(true)}>
        Start Collision
      </button>

      <button
        onClick={() => {
          setRunning(false);
          setResetKey(k => k + 1); // 🔄 reset simulation
        }}
      >
        Reset
      </button>

      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}
