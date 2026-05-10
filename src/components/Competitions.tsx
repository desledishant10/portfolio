import { motion } from 'framer-motion';
import { Swords, Trophy } from 'lucide-react';
import { competitions } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

export function Competitions() {
  return (
    <section id="competitions" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="06." title="competitions" subtitle="// blue_team_ops[]" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {competitions.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="panel panel-hover p-6 group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-neon-amber/5 blur-2xl group-hover:bg-neon-amber/10 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="p-3 rounded bg-neon-amber/10 text-neon-amber border border-neon-amber/20">
                  {i === 0 ? <Swords size={20} /> : <Trophy size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-ink">{c.name}</h3>
                    <span className="font-mono text-xs text-neon-amber">{c.detail}</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-ink-dim">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-neon-amber mt-0.5">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
