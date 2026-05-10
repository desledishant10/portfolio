import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { experience } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

export function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="03." title="experience" subtitle="// timeline[]" />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-bg-border to-transparent md:-translate-x-px" />

          <div className="flex flex-col gap-12">
            {experience.map((e, i) => (
              <motion.div
                key={e.org}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  i % 2 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
                  <span className="block w-3 h-3 rounded-full bg-neon-cyan shadow-glow-cyan" />
                </div>

                <div className={`pl-12 md:pl-0 ${i % 2 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="panel panel-hover p-6">
                    <div className="font-mono text-xs text-neon-cyan mb-1">
                      {e.start} → {e.end}
                    </div>
                    <h3 className="text-xl font-semibold text-ink">{e.role}</h3>
                    <div className="text-ink-dim mt-1">{e.org}</div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-ink-mute mt-1">
                      <MapPin size={11} /> {e.location}
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-ink-dim leading-relaxed">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-neon-green mt-0.5 shrink-0">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
