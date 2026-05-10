import { motion } from 'framer-motion';
import { profile } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

const stats = [
  { label: 'years studying security', value: '2+' },
  { label: 'cyber competitions', value: '2' },
  { label: 'certifications', value: '8' },
  { label: 'detection rate', value: '98%' },
];

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="01." title="about_me" subtitle="// background()" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 panel p-8 leading-relaxed text-ink-dim"
          >
            <p className="text-lg">{profile.bio}</p>
            <p className="mt-5 text-ink-dim/90">
              Most days I'm reading logs, automating things that shouldn't need a human, and chasing
              the small anomaly that turns out to be the start of a much bigger story. I care about
              clean playbooks, reproducible labs, and catching attackers before they get past stage one.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 font-mono text-sm">
              {[
                ['location', profile.location],
                ['focus', 'threat_detection'],
                ['status', 'open_to_work'],
                ['grad', 'Aug 2026'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-neon-cyan">{k}:</span>
                  <span className="text-ink">"{v}"</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 grid grid-cols-2 gap-3"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                className="panel panel-hover p-5 flex flex-col gap-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="font-mono text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-ink-dim font-mono">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
