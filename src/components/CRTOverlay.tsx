import { motion } from 'framer-motion';

export function CRTOverlay() {
  return (
    <>
      {/* horizontal scanlines */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* slow drifting scanline highlight */}
      <motion.div
        aria-hidden
        initial={{ y: '-100%' }}
        animate={{ y: '100vh' }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none fixed inset-x-0 z-[91] h-32"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.04) 50%, transparent 100%)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
