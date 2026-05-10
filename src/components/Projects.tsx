import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Folder } from 'lucide-react';
import { projects } from '../data/content';
import { GithubIcon } from './ui/BrandIcons';
import { SectionHeader } from './ui/SectionHeader';

const accentMap = {
  green: { ring: 'border-neon-green/40', glow: 'hover:shadow-glow-green', text: 'text-neon-green' },
  cyan: { ring: 'border-neon-cyan/40', glow: 'hover:shadow-glow-cyan', text: 'text-neon-cyan' },
  violet: { ring: 'border-neon-violet/40', glow: 'hover:shadow-glow-violet', text: 'text-neon-violet' },
};

function ProjectCard({ project, i }: { project: (typeof projects)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const accent = accentMap[project.accent];

  const onMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouse}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className={`panel ${accent.ring} ${accent.glow} p-6 flex flex-col gap-4 transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between gap-3" style={{ transform: 'translateZ(20px)' }}>
        <div className={`p-2 rounded bg-bg-soft border ${accent.ring} ${accent.text}`}>
          <Folder size={18} />
        </div>
        <div className="flex items-center gap-2">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} GitHub repository`}
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded bg-bg-soft border border-bg-border text-ink-dim hover:${accent.text} hover:border-current transition-colors`}
            >
              <GithubIcon size={16} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} demo`}
              onClick={(e) => e.stopPropagation()}
              className={`p-2 rounded bg-bg-soft border border-bg-border text-ink-dim hover:${accent.text} hover:border-current transition-colors`}
            >
              <ExternalLink size={16} />
            </a>
          )}
          {project.metric && (
            <div className="text-right pl-1">
              <div className={`font-mono text-2xl font-bold ${accent.text}`}>{project.metric.value}</div>
              <div className="font-mono text-[10px] text-ink-mute uppercase tracking-wider">
                {project.metric.label}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ transform: 'translateZ(15px)' }}>
        <h3 className="text-lg font-semibold text-ink leading-snug">{project.title}</h3>
        <p className="mt-2 text-sm text-ink-dim leading-relaxed">{project.blurb}</p>
      </div>

      <ul className="space-y-1.5 text-xs text-ink-dim/90" style={{ transform: 'translateZ(10px)' }}>
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className={`${accent.text} mt-0.5`}>▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-2 border-t border-bg-border" style={{ transform: 'translateZ(10px)' }}>
        {project.stack.map((t) => (
          <span key={t} className="chip text-[10px]">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="04." title="projects" subtitle="// builds[]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1000px' }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
