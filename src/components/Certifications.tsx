import { motion } from 'framer-motion';
import { Award, BadgeCheck } from 'lucide-react';
import { certifications } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

export function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="06." title="certifications_&_badges" subtitle="// credentials[]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="panel panel-hover p-5 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-cyan/0 to-neon-violet/0 group-hover:from-neon-cyan/5 group-hover:to-neon-violet/5 transition-all" />
              <div className="relative flex items-start gap-3">
                <div className="p-2 rounded bg-bg-soft border border-bg-border text-neon-cyan group-hover:text-neon-green group-hover:border-neon-green/30 transition-colors">
                  {i % 3 === 0 ? <BadgeCheck size={18} /> : <Award size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-ink leading-snug">{c.name}</h4>
                  <div className="mt-1 text-xs text-ink-dim">{c.issuer}</div>
                  <div className="mt-2 font-mono text-[10px] text-neon-cyan">{c.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
