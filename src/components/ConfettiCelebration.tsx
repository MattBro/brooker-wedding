"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: "petal" | "heart" | "sparkle";
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeRate: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
}

const PETAL_COLORS = [
  "#F2D7D5", // blush
  "#E8C4C0", // deeper blush
  "#B8A9C9", // lavender
  "#D4C5E2", // light lavender
  "#9CAF88", // sage
  "#C5D6B8", // light sage
];

const HEART_COLORS = [
  "#F2D7D5", // blush
  "#E8B4AF", // rose
  "#D4A0A0", // dusty rose
];

const SPARKLE_COLORS = [
  "#D4A574", // soft gold
  "#E8C99B", // light gold
  "#FEFEFA", // warm white
];

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.5);
  ctx.bezierCurveTo(
    x + size * 0.4, y - size * 0.5,
    x + size * 0.5, y,
    x, y + size * 0.5
  );
  ctx.bezierCurveTo(
    x - size * 0.5, y,
    x - size * 0.4, y - size * 0.5,
    x, y - size * 0.5
  );
  ctx.fill();
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  const s = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.4);
  ctx.bezierCurveTo(x, y - s * 0.2, x - s, y - s * 0.6, x - s, y - s * 0.1);
  ctx.bezierCurveTo(x - s, y + s * 0.3, x, y + s * 0.6, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.6, x + s, y + s * 0.3, x + s, y - s * 0.1);
  ctx.bezierCurveTo(x + s, y - s * 0.6, x, y - s * 0.2, x, y + s * 0.4);
  ctx.fill();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  const s = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.3, y - s * 0.3);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x + s * 0.3, y + s * 0.3);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.3, y + s * 0.3);
  ctx.lineTo(x - s, y);
  ctx.lineTo(x - s * 0.3, y - s * 0.3);
  ctx.closePath();
  ctx.fill();
}

export default function ConfettiCelebration({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const shapes: Particle["shape"][] = ["petal", "petal", "petal", "heart", "sparkle", "sparkle"];
    for (let i = 0; i < 80; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      let color: string;
      if (shape === "petal") {
        color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      } else if (shape === "heart") {
        color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      } else {
        color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1.5 + 0.5,
        size: shape === "sparkle" ? Math.random() * 8 + 4 : Math.random() * 14 + 8,
        color,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: 0.8 + Math.random() * 0.2,
        fadeRate: 0.001 + Math.random() * 0.002,
        sway: Math.random() * 2 + 1,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = createParticles(canvas);
    let frame = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let aliveCount = 0;
      particlesRef.current.forEach((p) => {
        if (p.opacity <= 0) return;
        aliveCount++;

        p.x += p.vx + Math.sin(frame * p.swaySpeed + p.swayOffset) * p.sway * 0.3;
        p.y += p.vy;
        p.vy += 0.008;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeRate;

        if (p.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        switch (p.shape) {
          case "petal":
            drawPetal(ctx, 0, 0, p.size, p.color);
            break;
          case "heart":
            drawHeart(ctx, 0, 0, p.size, p.color);
            break;
          case "sparkle":
            drawSparkle(ctx, 0, 0, p.size, p.color);
            break;
        }

        ctx.restore();
      });

      if (aliveCount > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, createParticles]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
