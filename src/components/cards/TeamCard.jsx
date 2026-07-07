import { Github, Linkedin } from 'lucide-react';

export default function TeamCard({ name, role }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('');

  return (
    <article className="panel flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded border border-border bg-surface-muted text-xs font-medium text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-ink dark:text-zinc-100">{name}</h3>
        <p className="truncate text-xs text-ink-secondary dark:text-zinc-400">{role}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        {[Github, Linkedin].map((Icon, iconIndex) => (
          <a
            key={iconIndex}
            href="#"
            className="focus-ring grid h-7 w-7 place-items-center rounded text-ink-tertiary transition-colors duration-200 hover:bg-surface-subtle hover:text-ink dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label={Icon === Github ? 'GitHub' : 'LinkedIn'}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    </article>
  );
}
