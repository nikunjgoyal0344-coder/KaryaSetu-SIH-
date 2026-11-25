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

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isDark = theme === 'dark';

    const buildBackgroundGradient = () => {
      const grad = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );

      if (isDark) {
        grad.addColorStop(0, 'rgba(10, 45, 38, 0.35)');
        grad.addColorStop(0.35, 'rgba(12, 30, 36, 0.4)');
        grad.addColorStop(0.7, 'rgba(16, 26, 32, 0.65)');
        grad.addColorStop(1, 'rgba(7, 13, 15, 0.9)');
      } else {
        grad.addColorStop(0, '#f8faf9');
        grad.addColorStop(0.4, '#f4f6f5');
        grad.addColorStop(0.8, '#f0f3f1');
        grad.addColorStop(1, '#eaf0ec');
      }
      return grad;
    };

    let cachedBgGrad = buildBackgroundGradient();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cachedBgGrad = buildBackgroundGradient();
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(40, Math.floor((width * height) / 28000));
    const colors = isDark
      ? ['rgba(0, 174, 173, ', 'rgba(56, 189, 248, ', 'rgba(242, 110, 36, ', 'rgba(32, 120, 116, ']
      : ['rgba(0, 174, 173, ', 'rgba(24, 55, 102, ', 'rgba(242, 110, 36, ', 'rgba(32, 120, 116, '];

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isDark ? 0.55 : 0.32),
      vy: (Math.random() - 0.5) * (isDark ? 0.55 : 0.32),
      radius: isDark ? Math.random() * 2.4 + 1.2 : Math.random() * 1.8 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: isDark ? Math.random() * 0.45 + 0.2 : Math.random() * 0.14 + 0.08,
    }));

    const maxDist = 130;
    const maxDistSq = maxDist * maxDist;

    const drawFrame = () => {
      ctx.fillStyle = cachedBgGrad;
      ctx.fillRect(0, 0, width, height);

      // Squared-distance check avoids O(N^2) square roots on disconnected particle pairs
      ctx.lineWidth = isDark ? 0.8 : 0.5;
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * (isDark ? 0.22 : 0.05);
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${lineAlpha})`
              : `rgba(71, 85, 105, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * 0.25})`;
        ctx.fill();
      }
    };

    const renderLoop = () => {
      if (document.hidden) return;
      drawFrame();
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    drawFrame();
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
