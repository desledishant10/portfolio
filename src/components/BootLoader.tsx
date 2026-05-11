import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  { t: 90, text: 'BIOS v6.6.6 - initializing secure boot...' },
  { t: 200, text: 'mounting /dev/dishant ............ [ OK ]' },
  { t: 280, text: 'loading kernel modules ........... [ OK ]' },
  { t: 360, text: 'verifying signed credentials ..... [ OK ]' },
  { t: 440, text: 'spawning cyber.portfolio ......... [ OK ]' },
  { t: 540, text: 'access granted - welcome.' },
];

const SKIP_KEY = 'portfolio.bootSeen';

export function BootLoader() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SKIP_KEY) === '1') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setShow(true);
    document.documentElement.style.overflow = 'hidden';

    const timeouts: number[] = [];
    lines.forEach((l, i) => {
      timeouts.push(window.setTimeout(() => setStep(i), l.t));
    });
    timeouts.push(
      window.setTimeout(() => {
        sessionStorage.setItem(SKIP_KEY, '1');
        document.documentElement.style.overflow = '';
        setShow(false);
      }, 1700),
    );
    return () => {
      timeouts.forEach(clearTimeout);
      document.documentElement.style.overflow = '';
    };
  }, []);

  const skip = () => {
    sessionStorage.setItem(SKIP_KEY, '1');
    document.documentElement.style.overflow = '';
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={skip}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg cursor-pointer"
        >
          <div className="absolute inset-0 bg-grid-lines bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
          <div className="relative w-full max-w-xl px-8 font-mono text-sm">
            <div className="flex items-center justify-between mb-4 text-[10px] text-ink-mute">
              <span>system_boot.sh</span>
              <span>click anywhere to skip</span>
            </div>
            <div className="space-y-1.5">
              {lines.slice(0, step + 1).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-ink-dim"
                >
                  <span className="text-neon-green">$ </span>
                  {l.text}
                </motion.div>
              ))}
              {step < lines.length - 1 && (
                <span className="inline-block w-2 h-4 bg-neon-cyan animate-blink align-middle ml-2" />
              )}
            </div>

            <div className="mt-6 h-1 bg-bg-border rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-violet"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
