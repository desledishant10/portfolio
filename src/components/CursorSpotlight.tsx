import { useEffect, useRef } from 'react';

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Skip on touch devices — no cursor
    if (window.matchMedia('(hover: none)').matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * 0.16;
      current.current.y += dy * 0.16;
      el.style.transform = `translate3d(${current.current.x - 250}px, ${current.current.y - 250}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 -z-[1] hidden lg:block"
      style={{
        width: 500,
        height: 500,
        background:
          'radial-gradient(circle at center, rgba(34, 211, 238, 0.10) 0%, rgba(168, 85, 247, 0.04) 35%, transparent 70%)',
        filter: 'blur(20px)',
        willChange: 'transform',
      }}
    />
  );
}
