import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Panel from '../ui/Panel.jsx';

export default function RoadmapCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `roadmaps.items.${item.key}`;

  return (
    <Panel delay={delay} className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="grid h-8 w-8 place-items-center rounded border border-border bg-surface-muted text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <Icon size={16} />
        </div>
        <a
          href="https://roadmap.sh"
          className="focus-ring grid h-7 w-7 place-items-center rounded text-ink-tertiary transition-colors duration-200 hover:bg-surface-subtle hover:text-accent dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-teal-400"
          aria-label="Open roadmap"
        >
          <ExternalLink size={14} />
        </a>
      </div>
      <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t(`${base}.title`)}</h3>
      <p className="mt-1.5 text-sm leading-5 text-ink-secondary dark:text-zinc-400">{t(`${base}.desc`)}</p>
      <ol className="mt-4 space-y-2 border-t border-border pt-3 dark:border-zinc-800">
        {item.steps.map((step, index) => (
          <li key={step} className="flex items-start gap-2.5 text-sm text-ink-secondary dark:text-zinc-400">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-border text-2xs font-medium text-ink-tertiary dark:border-zinc-700 dark:text-zinc-500">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
