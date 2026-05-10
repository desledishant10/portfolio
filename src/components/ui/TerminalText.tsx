import { useEffect, useState } from 'react';
import clsx from 'clsx';

type Line = { prompt?: string; text: string; delay?: number };

export function TerminalText({
  lines,
  className,
  speed = 28,
  loop = false,
  showCursor = true,
}: {
  lines: Line[];
  className?: string;
  speed?: number;
  loop?: boolean;
  showCursor?: boolean;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= lines.length) {
      if (loop) {
        const t = setTimeout(() => {
          setLineIdx(0);
          setCharIdx(0);
        }, 2000);
        return () => clearTimeout(t);
      }
      setDone(true);
      return;
    }
    const current = lines[lineIdx];
    if (charIdx === 0 && current.delay) {
      const t = setTimeout(() => setCharIdx(1), current.delay);
      return () => clearTimeout(t);
    }
    if (charIdx < current.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 220);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, lines, speed, done, loop]);

  return (
    <div className={clsx('font-mono text-sm leading-relaxed', className)}>
      {lines.slice(0, lineIdx).map((l, i) => (
        <div key={i}>
          {l.prompt && <span className="text-neon-green">{l.prompt}</span>}
          <span className="text-ink">{l.text}</span>
        </div>
      ))}
      {lineIdx < lines.length && (
        <div>
          {lines[lineIdx].prompt && <span className="text-neon-green">{lines[lineIdx].prompt}</span>}
          <span className="text-ink">{lines[lineIdx].text.slice(0, charIdx)}</span>
          {showCursor && <span className="inline-block w-2 h-4 bg-neon-cyan align-middle ml-0.5 animate-blink" />}
        </div>
      )}
    </div>
  );
}
