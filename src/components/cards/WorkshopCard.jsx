import { Calendar, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard.jsx';

export default function WorkshopCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `workshops.items.${item.key}`;
  const isUpcoming = item.status === 'upcoming';

  return (
    <GlassCard delay={delay} className="h-full">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-ink-900 text-white dark:bg-brand-400 dark:text-ink-950">
          <Icon size={22} />
        </div>
        <span className={`rounded-md px-3 py-1 text-xs font-black ${isUpcoming ? 'bg-mint-400/20 text-mint-500' : 'bg-brand-400/15 text-brand-600 dark:text-brand-300'}`}>
          {t(`workshops.${item.status}`)}
        </span>
      </div>
      <h3 className="text-xl font-black">{t(`${base}.title`)}</h3>
      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{t(`${base}.desc`)}</p>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{t(`${base}.date`)}</span>
        </div>
        <a href="https://youtube.com" className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
          <Video size={16} />
          <span>{isUpcoming ? t('workshops.register') : t('workshops.recording')}</span>
        </a>
      </div>
    </GlassCard>
  );
}
