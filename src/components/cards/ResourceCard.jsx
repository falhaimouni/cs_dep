import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from '../ui/Badge.jsx';
import Panel from '../ui/Panel.jsx';

export default function ResourceCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `resources.items.${item.key}`;
  const types = t('resources.types', { returnObjects: true });

  return (
    <Panel delay={delay} className="group flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="grid h-8 w-8 place-items-center rounded border border-border bg-surface-muted text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <Icon size={16} />
        </div>
        <a
          href="https://drive.google.com"
          className="focus-ring grid h-7 w-7 place-items-center rounded text-ink-tertiary opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-surface-subtle hover:text-accent dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-teal-400"
          aria-label="Open resource"
        >
          <ExternalLink size={14} />
        </a>
      </div>
      <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t(`${base}.title`)}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-5 text-ink-secondary dark:text-zinc-400">{t(`${base}.desc`)}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {types.map((type) => (
          <Badge key={type}>{type}</Badge>
        ))}
      </div>
    </Panel>
  );
}
