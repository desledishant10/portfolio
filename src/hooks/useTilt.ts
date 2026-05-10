import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export function useTilt<T extends HTMLElement = HTMLDivElement>(intensity = 5) {
  const ref = useRef<T | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 220,
    damping: 22,
  });

  // Handler uses native event so it can be reused across HTMLElement subtypes (div, a, etc.)
  const onMouseMove = (e: { clientX: number; clientY: number }) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return {
    ref,
    handlers: { onMouseMove, onMouseLeave },
    style: { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' as const },
  };
}
