import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useScrambleReveal(target: string, active: boolean) {
  const [text, setText] = useState(active ? '' : target);

  useEffect(() => {
    if (!active) return;
    const total = target.length;
    let frame = 0;
    let raf = 0;
    const reveals = Array.from({ length: total }, (_, i) =>
      Math.floor(8 + i * 1.5 + Math.random() * 8),
    );

    const tick = () => {
      let out = '';
      let allDone = true;
      for (let i = 0; i < total; i++) {
        if (frame >= reveals[i]) {
          out += target[i];
        } else if (frame >= reveals[i] - 6) {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          allDone = false;
        } else {
          out += ' ';
          allDone = false;
        }
      }
      setText(out);
      if (!allDone) {
        frame++;
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return text;
}

export function SectionHeader({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const scrambled = useScrambleReveal(title, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col gap-2"
    >
      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-neon-cyan">{index}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        <span className="text-ink whitespace-pre">{scrambled}</span>
      </h2>
      {subtitle && <p className="text-ink-dim font-mono text-sm">{subtitle}</p>}
    </motion.div>
  );
}
