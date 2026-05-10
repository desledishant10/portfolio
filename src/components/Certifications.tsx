import { motion } from 'framer-motion';
import { Award, BadgeCheck, ExternalLink } from 'lucide-react';
import { certifications, type Certification } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';
import { useTilt } from '../hooks/useTilt';

function CertInner({ c, Icon }: { c: Certification; Icon: typeof Award }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-cyan/0 to-neon-violet/0 group-hover:from-neon-cyan/5 group-hover:to-neon-violet/5 transition-all" />
      <div className="relative flex items-start gap-3" style={{ transform: 'translateZ(15px)' }}>
        <div className="p-2 rounded bg-bg-soft border border-bg-border text-neon-cyan group-hover:text-neon-green group-hover:border-neon-green/30 transition-colors">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink leading-snug">{c.name}</h4>
          <div className="mt-1 text-xs text-ink-dim">{c.issuer}</div>
          <div className="mt-2 font-mono text-[10px] text-neon-cyan">{c.date}</div>
        </div>
        {c.url && (
          <ExternalLink
            size={12}
            className="text-ink-mute group-hover:text-neon-cyan transition-colors shrink-0"
          />
        )}
      </div>
    </>
  );
}

function LinkedCertCard({ c, i, Icon }: { c: Certification; i: number; Icon: typeof Award }) {
  const tilt = useTilt<HTMLAnchorElement>(5);
  return (
    <motion.a
      href={c.url}
      target="_blank"
      rel="noreferrer"
      ref={tilt.ref}
      onMouseMove={tilt.handlers.onMouseMove}
      onMouseLeave={tilt.handlers.onMouseLeave}
      style={tilt.style}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="panel panel-hover p-5 group relative overflow-hidden block cursor-pointer"
    >
      <CertInner c={c} Icon={Icon} />
    </motion.a>
  );
}

function PlainCertCard({ c, i, Icon }: { c: Certification; i: number; Icon: typeof Award }) {
  const tilt = useTilt<HTMLDivElement>(5);
  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.handlers.onMouseMove}
      onMouseLeave={tilt.handlers.onMouseLeave}
      style={tilt.style}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="panel panel-hover p-5 group relative overflow-hidden block"
    >
      <CertInner c={c} Icon={Icon} />
    </motion.div>
  );
}

function CertCard({ c, i }: { c: Certification; i: number }) {
  const Icon = i % 3 === 0 ? BadgeCheck : Award;
  if (c.url) return <LinkedCertCard c={c} i={i} Icon={Icon} />;
  return <PlainCertCard c={c} i={i} Icon={Icon} />;
}

export function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeader index="07." title="certifications_&_badges" subtitle="// credentials[]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ perspective: '1000px' }}>
          {certifications.map((c, i) => (
            <CertCard key={c.name} c={c} i={i} />
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-ink-mute">
          // tip: cards with no link will become clickable once you add their URL in src/data/content.ts
        </p>
      </div>
    </section>
  );
}
