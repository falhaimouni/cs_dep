import { Github, Linkedin } from 'lucide-react';

export default function TeamCard({ name, role, index }) {
  return (
    <article className="glass-panel rounded-lg p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-400 via-mint-300 to-coral-300 text-lg font-black text-ink-950">
          {name
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black">{name}</h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-md bg-slate-900/5 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">#{String(index + 1).padStart(2, '0')}</span>
        <div className="flex gap-2">
          {[Github, Linkedin].map((Icon, iconIndex) => (
            <a key={iconIndex} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/70 text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
