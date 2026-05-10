import { motion } from 'framer-motion';
import { ArrowRight, Download, MapPin, Terminal } from 'lucide-react';
import { profile } from '../data/content';
import { GlitchText } from './ui/GlitchText';
import { BadgesStrip } from './BadgesStrip';
import { Magnetic } from './ui/Magnetic';
import { InteractiveTerminal } from './ui/InteractiveTerminal';

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />

      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-neon-green">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
            </span>
            <span>system_online · open_to_work</span>
          </div>

          <div>
            <p className="font-mono text-sm text-ink-dim mb-3">// hello, world. i'm</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <GlitchText className="text-ink">Dishant</GlitchText>{' '}
              <GlitchText className="gradient-text">Desle.</GlitchText>
            </h1>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-ink-dim">
              I secure systems & hunt threats.
            </h2>
          </div>

          <p className="max-w-xl text-ink-dim text-base md:text-lg leading-relaxed">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <span className="chip-accent">
              <Terminal size={12} /> {profile.title}
            </span>
            <span className="chip">
              <MapPin size={12} /> {profile.location}
            </span>
            <span className="chip">{profile.focus}</span>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <Magnetic strength={12}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-bg font-mono text-sm font-semibold rounded hover:shadow-glow-cyan transition-all"
              >
                get_in_touch()
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
            <Magnetic strength={10}>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-bg-border text-ink font-mono text-sm rounded hover:border-neon-cyan/50 hover:text-neon-cyan transition-all"
              >
                view_projects/
              </a>
            </Magnetic>
            <Magnetic strength={10}>
              <a
                href={profile.resumePath}
                download="dishant-desle-resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-bg-border text-ink-dim font-mono text-sm rounded hover:border-neon-green/50 hover:text-neon-green transition-all"
              >
                <Download size={14} /> resume.pdf
              </a>
            </Magnetic>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-3"
        >
          <BadgesStrip />

          <div className="panel scanline overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-bg-border bg-bg-soft">
              <span className="w-3 h-3 rounded-full bg-neon-red/70" />
              <span className="w-3 h-3 rounded-full bg-neon-amber/70" />
              <span className="w-3 h-3 rounded-full bg-neon-green/70" />
              <span className="ml-2 font-mono text-xs text-ink-mute">~/dishant — zsh</span>
            </div>
            <div className="p-5 min-h-[260px]">
              <InteractiveTerminal />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-ink-mute flex flex-col items-center gap-1"
      >
        <span>scroll</span>
        <span className="w-px h-8 bg-gradient-to-b from-neon-cyan to-transparent" />
      </motion.div>
    </section>
  );
}
