import { createElement } from 'react';

const variants = {
  primary:
    'bg-ink text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
  accent:
    'bg-accent text-accent-foreground hover:bg-accent-hover',
  secondary:
    'border border-border bg-surface text-ink hover:bg-surface-subtle dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
  ghost:
    'text-ink-secondary hover:bg-surface-subtle hover:text-ink dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
};

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-9 gap-2 px-4 text-sm',
  lg: 'h-10 gap-2 px-4 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as,
  ...props
}) {
  const classes = `focus-ring inline-flex items-center justify-center rounded font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;

  return createElement(as || 'button', { className: classes, ...props }, children);
}
