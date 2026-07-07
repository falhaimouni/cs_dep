import { Calendar, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from '../ui/Badge.jsx';
import Panel from '../ui/Panel.jsx';

export default function WorkshopCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `workshops.items.${item.key}`;
  const isUpcoming = item.status === 'upcoming';

  return (
    <Panel delay={delay} className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="grid h-8 w-8 place-items-center rounded border border-border bg-surface-muted text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <Icon size={16} />
        </div>
        <Badge variant={isUpcoming ? 'success' : 'muted'}>{t(`workshops.${item.status}`)}</Badge>
      </div>
      <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t(`${base}.title`)}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-5 text-ink-secondary dark:text-zinc-400">{t(`${base}.desc`)}</p>
      <div className="mt-4 space-y-2 border-t border-border pt-3 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-ink-secondary dark:text-zinc-400">
          <Calendar size={13} />
          <span>{t(`${base}.date`)}</span>
        </div>
        <a
          href="https://youtube.com"
          className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover dark:text-teal-400 dark:hover:text-teal-300"
        >
          <Video size={13} />
          <span>{isUpcoming ? t('workshops.register') : t('workshops.recording')}</span>
        </a>
      </div>
    </Panel>
  );
}
