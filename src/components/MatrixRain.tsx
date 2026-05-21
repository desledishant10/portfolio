import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * MatrixRain renders into a <canvas> appended directly to <body> via a portal.
 *
 * Why a portal: when nested inside the React tree (e.g. inside HomePage), the
 * canvas's stacking context can be affected by ancestor elements that
 * unexpectedly create stacking contexts (transforms, filters, overflow tricks,
 * Framer Motion's wrapper divs, etc.) - which can render the negative z-index
 * canvas invisible. Rendering at <body> level guarantees the canvas sits in
 * the root stacking context, above the body background and below all app UI.
 */
export function MatrixRain({ opacity = 0.22 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let initialized = false;

    // On mobile (iOS Safari, Chrome Android) the address bar slides in/out
    // during scroll, which fires `resize` with a changed innerHeight even
    // though the viewport WIDTH hasn't actually changed. We must NOT reset
    // `drops` in that case - otherwise every column snaps back to row 1
    // and the rain visibly "restarts" on every scroll direction change.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Bail-out path for height-only changes (URL bar toggle).
      if (initialized && newWidth === width) {
        height = newHeight;
        canvas.height = Math.floor(height * dpr);
        canvas.style.height = `${height}px`;
        // Re-applying the transform is required because setting canvas.height
        // resets the 2D context state.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return;
      }

      width = newWidth;
      height = newHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const newColumns = Math.floor(width / fontSize);

      if (!initialized) {
        drops = Array(newColumns).fill(1);
        initialized = true;
      } else {
        // Width actually changed (orientation or window resize). Preserve
        // existing drop positions where columns overlap, and for any new
        // columns seed with a random vertical offset so they look already
        // in motion instead of all starting at row 1.
        const preserved = drops.slice(0, newColumns);
        const maxRow = Math.max(1, Math.floor(height / fontSize));
        while (preserved.length < newColumns) {
          preserved.push(Math.floor(Math.random() * maxRow));
        }
        drops = preserved;
      }

      columns = newColumns;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\$#@!';

    // If user prefers reduced motion, draw a faint single frame and stop.
    if (prefersReducedMotion) {
      ctx.fillStyle = `rgba(0, 255, 156, ${opacity * 0.5})`;
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      for (let i = 0; i < columns; i++) {
        ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, Math.random() * height);
      }
      return () => window.removeEventListener('resize', resize);
    }

    let raf = 0;
    let last = 0;
    const step = (t: number) => {
      if (t - last > 55) {
        last = t;
        // Slight trail effect - paints the previous frame over with the page bg,
        // creating the falling streak.
        ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Lead char gets a brighter highlight
          if (Math.random() > 0.975) {
            ctx.fillStyle = `rgba(190, 255, 240, ${Math.min(1, opacity * 4)})`;
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
      window.removeEventListener('resize', resize);
    };
  }, [opacity]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        // Negative z-index puts the canvas behind app content (#root and its
        // descendants) but above the body background, so it shows through any
        // transparent UI panels.
        zIndex: -1,
        mixBlendMode: 'screen',
      }}
    />,
    document.body,
  );
}
