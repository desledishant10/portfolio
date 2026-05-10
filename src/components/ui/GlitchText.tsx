import clsx from 'clsx';

export function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={clsx('glitch relative inline-block', className)} data-text={children}>
      {children}
    </span>
  );
}
