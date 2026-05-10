import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  hue: number;
};

export function HeroParticles({ count = 36 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let w = (canvas.width = parent.clientWidth);
    let h = (canvas.height = parent.clientHeight);

    const colors = [
      [34, 211, 238], // cyan
      [0, 255, 156], // green
      [168, 85, 247], // violet
    ];

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      r: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.floor(Math.random() * colors.length),
    }));

    let visible = true;
    let raf = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onResize = () => {
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;

          const [r, g, b] = colors[p.hue];
          // glow
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          grd.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
          ctx.fill();
          // core
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.alpha * 2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
