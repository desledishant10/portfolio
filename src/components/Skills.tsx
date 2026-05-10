import { motion } from 'framer-motion';
import { Cloud, Code2, Radar, Shield } from 'lucide-react';
import { skills, type SkillCategory } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { useTilt } from '../hooks/useTilt';

const iconMap = {
  radar: Radar,
  shield: Shield,
  cloud: Cloud,
  code: Code2,
};

function SkillCard({ cat, i }: { cat: SkillCategory; i: number }) {
  const Icon = iconMap[cat.icon as keyof typeof iconMap];
  const tilt = useTilt(5);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.handlers.onMouseMove}
      onMouseLeave={tilt.handlers.onMouseLeave}
      style={tilt.style}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="panel panel-hover p-6 group"
    >
      <div className="flex items-center gap-3 mb-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="p-2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 group-hover:shadow-glow-cyan transition-shadow">
          <Icon size={18} />
        </div>
        <h3 className="font-mono text-sm tracking-wider text-ink uppercase">{cat.label}</h3>
      </div>
      <div className="flex flex-wrap gap-2" style={{ transform: 'translateZ(12px)' }}>
        {cat.items.map((item, j) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 + j * 0.04 }}
            whileHover={{ scale: 1.05 }}
            className="chip group-hover:border-neon-cyan/30"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="02." title="skills_&_tooling" subtitle="// stack[]" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ perspective: '1000px' }}>
          {skills.map((cat, i) => (
            <SkillCard key={cat.label} cat={cat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
