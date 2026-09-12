'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';

export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, wallpaperMode } = useApp();

  useEffect(() => {
    if (wallpaperMode === 'plain') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = Math.min(45, Math.floor((width * height) / 25000));
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }[] = [];

    const isDark = theme === 'dark';

    const colors = isDark
      ? [
          'rgba(16, 185, 129, ', // emerald
          'rgba(20, 184, 166, ', // teal
          'rgba(245, 158, 11, ', // saffron
          'rgba(56, 189, 248, ', // cyan
        ]
      : [
          'rgba(58, 92, 75, ',  // muted deep forest sage
          'rgba(71, 85, 105, ', // soft mineral slate
          'rgba(120, 98, 76, ', // muted warm sandalwood
          'rgba(67, 90, 112, ', // calm slate blue
        ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isDark ? 0.6 : 0.35),
        vy: (Math.random() - 0.5) * (isDark ? 0.6 : 0.35),
        radius: isDark ? (Math.random() * 2.5 + 1.2) : (Math.random() * 1.8 + 0.8),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: isDark ? (Math.random() * 0.5 + 0.2) : (Math.random() * 0.15 + 0.08),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );

      if (isDark) {
        // Night forest & deep teal soothing ambient
        bgGrad.addColorStop(0, 'rgba(10, 45, 38, 0.35)');
        bgGrad.addColorStop(0.35, 'rgba(12, 30, 36, 0.4)');
        bgGrad.addColorStop(0.7, 'rgba(16, 26, 32, 0.65)');
        bgGrad.addColorStop(1, 'rgba(7, 13, 15, 0.9)');
      } else {
        // Calming matte oyster & soothing mineral sage - zero eye fatigue
        bgGrad.addColorStop(0, '#f8faf9');
        bgGrad.addColorStop(0.4, '#f4f6f5');
        bgGrad.addColorStop(0.8, '#f0f3f1');
        bgGrad.addColorStop(1, '#eaf0ec');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Connect nearby particles with delicate synaptic/botanical filaments
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 130;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.22 : 0.05);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${lineAlpha})`
              : `rgba(71, 85, 105, ${lineAlpha})`;
            ctx.lineWidth = isDark ? 0.8 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle glowing point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Subtle outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * 0.25})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, wallpaperMode]);

  if (wallpaperMode === 'plain') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 transition-opacity duration-700"
      style={{ opacity: 0.95 }}
    />
  );
}
