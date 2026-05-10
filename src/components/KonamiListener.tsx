import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function KonamiListener() {
  const [unlocked, setUnlocked] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = [...buffer, key].slice(-SEQUENCE.length);
      if (buffer.join(',') === SEQUENCE.join(',')) {
        setGlitch(true);
        setUnlocked(true);
        setTimeout(() => setGlitch(false), 1200);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] pointer-events-none flex items-center justify-center"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(34,211,238,0.06) 0, rgba(34,211,238,0.06) 1px, transparent 1px, transparent 4px), rgba(5,7,10,0.5)',
              mixBlendMode: 'screen',
            }}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="font-mono text-2xl md:text-4xl font-bold text-neon-green text-glow-green text-center px-6"
              style={{ letterSpacing: '0.1em' }}
            >
              ACCESS_GRANTED
              <div className="text-xs mt-3 text-neon-cyan">
                /admin route unlocked · check command palette
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlocked && !glitch && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => {
              navigate('/admin');
              setUnlocked(false);
            }}
            className="fixed bottom-6 right-6 z-[70] panel panel-hover border-neon-green/40 px-4 py-3 flex items-center gap-3 group"
          >
            <ShieldAlert size={16} className="text-neon-green" />
            <div className="text-left">
              <div className="font-mono text-[10px] text-neon-green">developer_mode</div>
              <div className="font-mono text-xs text-ink group-hover:text-neon-cyan transition-colors">
                visit /admin →
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUnlocked(false);
              }}
              className="ml-2 text-ink-mute hover:text-ink text-xs"
              aria-label="Dismiss"
            >
              ×
            </button>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
