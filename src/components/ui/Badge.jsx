const variants = {
  default: 'border-border bg-surface-subtle text-ink-secondary dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  accent: 'border-accent/20 bg-accent-muted text-accent-hover dark:border-accent/30 dark:bg-accent/10 dark:text-teal-300',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  muted: 'border-transparent bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-2xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
