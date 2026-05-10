import { useEffect, useRef } from 'react';

export function MatrixRain({ opacity = 0.18 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\$#@!';

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener('resize', handleResize);

    let raf = 0;
    let last = 0;
    const step = (t: number) => {
      if (t - last > 55) {
        last = t;
        ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Lead char: brighter cyan
          if (Math.random() > 0.975) {
            ctx.fillStyle = `rgba(190, 255, 240, ${opacity * 5})`;
          } else {
            ctx.fillStyle = `rgba(0, 255, 156, ${opacity})`;
          }
          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
