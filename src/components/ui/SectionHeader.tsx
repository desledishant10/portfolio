import { motion } from 'framer-motion';

export function SectionHeader({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col gap-2"
    >
      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-neon-cyan">{index}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        <span className="text-ink">{title}</span>
      </h2>
      {subtitle && <p className="text-ink-dim font-mono text-sm">{subtitle}</p>}
    </motion.div>
  );
}
