import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import { experience, type Role } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

function RoleBlock({ role }: { role: Role }) {
  return (
    <div className="relative pl-4 border-l border-bg-border hover:border-neon-cyan/30 transition-colors group/role">
      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-bg-border group-hover/role:bg-neon-cyan group-hover/role:shadow-glow-cyan transition-all" />
      <div className="font-mono text-[10px] text-neon-cyan uppercase tracking-wider">
        {role.start} → {role.end}
      </div>
      <h4 className="text-base font-semibold text-ink mt-0.5">{role.title}</h4>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-dim leading-relaxed">
        {role.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-neon-green mt-0.5 shrink-0">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {role.skills && role.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {role.skills.map((s) => (
            <span key={s} className="chip text-[10px] py-0.5">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({
  e,
  i,
}: {
  e: (typeof experience)[number];
  i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.4'],
  });
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.4]);
  const dotOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-12"
    >
      <div className="absolute left-4 top-6 -translate-x-1/2 z-10">
        <motion.span
          style={{ scale: dotScale, opacity: dotOpacity }}
          className="block w-4 h-4 rounded-full bg-neon-cyan shadow-glow-cyan ring-4 ring-bg"
        />
        <motion.span
          style={{ opacity: dotOpacity }}
          className="absolute inset-0 m-auto block w-4 h-4 rounded-full bg-neon-cyan/40 animate-ping"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="panel panel-hover p-6"
      >
        <div className="flex items-start gap-3 pb-4 mb-5 border-b border-bg-border">
          <div className="p-2 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
            <Briefcase size={16} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-ink">{e.org}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono text-ink-mute">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} /> {e.location}
              </span>
              {e.type && <span>· {e.type}</span>}
              <span className="text-neon-green">
                · {e.roles.length} role{e.roles.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {e.roles.map((r, ri) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.1 + ri * 0.08 }}
            >
              <RoleBlock role={r} />
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* unused but reserves the index var */}
      <span className="hidden">{i}</span>
    </motion.div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.6', 'end 0.6'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="04." title="experience" subtitle="// timeline[]" />

        <div ref={sectionRef} className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-bg-border -translate-x-px" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 top-0 w-px -translate-x-px bg-gradient-to-b from-neon-green via-neon-cyan to-neon-violet shadow-glow-cyan"
          />

          <div className="flex flex-col gap-12">
            {experience.map((e, i) => (
              <ExperienceCard key={e.org} e={e} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
