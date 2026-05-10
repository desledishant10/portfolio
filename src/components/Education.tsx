import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { education } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

export function Education() {
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="03." title="education" subtitle="// schools[]" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {education.map((e, i) => (
            <motion.div
              key={e.school}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="panel panel-hover p-6 flex gap-4"
            >
              <div className="p-3 rounded bg-neon-violet/10 text-neon-violet border border-neon-violet/20 h-fit">
                <GraduationCap size={20} />
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs text-neon-violet mb-1">{e.date}</div>
                <h3 className="text-lg font-semibold text-ink">{e.degree}</h3>
                <div className="text-ink-dim mt-1">{e.school}</div>
                {e.detail && <div className="text-sm text-ink-dim/80 mt-2">{e.detail}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
