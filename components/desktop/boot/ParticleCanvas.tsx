"use client";

import { useEffect, useRef } from "react";

export type ParticleStage = "hidden" | "dot" | "drift" | "converge" | "settled";

interface ParticleCanvasProps {
  stage: ParticleStage;
  onConverged?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  settled: boolean;
}

const PARTICLE_COUNT = 90;
const RING_RADIUS = 78;
const CONNECT_DISTANCE = 90;

export function ParticleCanvas({ stage, onConverged }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const stageRef = useRef<ParticleStage>(stage);
  const hasNotifiedRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    stageRef.current = stage;
    if (stage !== "converge") hasNotifiedRef.current = false;
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Spawn particles once, scattered near center with random drift velocity.
    // Target positions are pre-assigned (evenly spaced around the ring) so
    // the "converge" stage just has to lerp toward them.
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      return {
        x: centerX + (Math.random() - 0.5) * 300,
        y: centerY + (Math.random() - 0.5) * 300,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        targetX: centerX + Math.cos(angle) * RING_RADIUS,
        targetY: centerY + Math.sin(angle) * RING_RADIUS,
        settled: false,
      };
    });

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      const currentStage = stageRef.current;
      const particles = particlesRef.current;

      if (currentStage === "dot") {
        const pulse = 0.7 + Math.sin(Date.now() / 300) * 0.3;
        ctx!.beginPath();
        ctx!.arc(centerX, centerY, 3 * pulse, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(234,124,92,0.9)";
        ctx!.shadowColor = "rgba(234,124,92,0.8)";
        ctx!.shadowBlur = 16;
        ctx!.fill();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (currentStage === "hidden") {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const isConvergingOrSettled = currentStage === "converge" || currentStage === "settled";

      for (const p of particles) {
        if (isConvergingOrSettled) {
          p.x += (p.targetX - p.x) * 0.07;
          p.y += (p.targetY - p.y) * 0.07;
          const dist = Math.hypot(p.targetX - p.x, p.targetY - p.y);
          p.settled = dist < 0.5;
        } else {
          // Drift stage — gentle bounded wander
          p.x += p.vx;
          p.y += p.vy;
          if (Math.hypot(p.x - centerX, p.y - centerY) > 180) {
            p.vx *= -1;
            p.vy *= -1;
          }
        }
      }

      // Connecting lines — constellation look while drifting, ring outline once settled
      ctx!.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const maxDist = isConvergingOrSettled ? RING_RADIUS * 0.3 : CONNECT_DISTANCE;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isConvergingOrSettled ? 0.5 : 0.25);
            ctx!.strokeStyle = `rgba(234,124,92,${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Particles themselves
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, isConvergingOrSettled ? 2 : 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(244,238,226,0.9)";
        ctx!.shadowColor = "rgba(234,124,92,0.6)";
        ctx!.shadowBlur = 6;
        ctx!.fill();
      }

      if (currentStage === "converge" && !hasNotifiedRef.current) {
        const allSettled = particles.every((p) => p.settled);
        if (allSettled) {
          hasNotifiedRef.current = true;
          onConverged?.();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
