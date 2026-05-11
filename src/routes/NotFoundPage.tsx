import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MatrixRain } from '../components/MatrixRain';
import { GlitchText } from '../components/ui/GlitchText';

// Sanitize the pathname before rendering. React already escapes text nodes, so
// HTML/script injection is impossible. This extra pass strips control chars,
// bidi-override characters (Trojan Source-style), and caps length — preventing
// visual confusion / very-long-path layout abuse from crafted URLs like
// `/foo<bidi-override>bar`.
function safePath(): string {
  const raw = typeof window !== 'undefined' ? window.location.pathname : '/';
  return raw.replace(/[ --‪-‮⁦-⁩]/g, '').slice(0, 80);
}

export default function NotFoundPage() {
  const path = safePath();
  return (
    <>
      <MatrixRain opacity={0.1} />
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full panel scanline p-8 md:p-12 text-center"
        >
          <div className="font-mono text-xs text-neon-red mb-4">SIGSEGV — segmentation fault</div>
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight gradient-text mb-3">
            <GlitchText className="">404</GlitchText>
          </h1>
          <div className="font-mono text-sm text-ink-dim space-y-1 mb-8">
            <div>
              <span className="text-neon-green">$ </span>cat {path}
            </div>
            <div className="text-neon-red">cat: {path}: No such file or directory</div>
            <div>
              <span className="text-neon-green">$ </span>find / -name "this_page" 2&gt;/dev/null
            </div>
            <div className="text-ink-mute">(nothing returned — page does not exist)</div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-bg font-mono text-sm font-semibold rounded hover:shadow-glow-cyan transition-all"
          >
            <ArrowLeft size={16} /> cd ~
          </Link>
        </motion.div>
      </main>
    </>
  );
}
