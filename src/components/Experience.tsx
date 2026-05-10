import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { experience } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

function TimelineItem({
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
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 ${
        i % 2 ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 z-10">
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
        initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`pl-12 md:pl-0 ${i % 2 ? 'md:pr-12' : 'md:pl-12'}`}
      >
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
      </motion.div>
      <div className="hidden md:block" />
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
        <SectionHeader index="03." title="experience" subtitle="// timeline[]" />

        <div ref={sectionRef} className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-bg-border md:-translate-x-px" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 md:left-1/2 top-0 w-px md:-translate-x-px bg-gradient-to-b from-neon-green via-neon-cyan to-neon-violet shadow-glow-cyan"
          />

          <div className="flex flex-col gap-12">
            {experience.map((e, i) => (
              <TimelineItem key={e.org} e={e} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
