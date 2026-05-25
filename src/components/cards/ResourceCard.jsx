import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard.jsx';

export default function ResourceCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `resources.items.${item.key}`;
  const types = t('resources.types', { returnObjects: true });

  return (
    <GlassCard delay={delay} className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${item.color} text-ink-950`}>
          <Icon size={22} />
        </div>
        <a href="https://drive.google.com" className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-white/10">
          <ExternalLink size={17} />
        </a>
      </div>
      <div>
        <h3 className="text-xl font-black">{t(`${base}.title`)}</h3>
        <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{t(`${base}.desc`)}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {types.map((type) => (
          <span key={type} className="rounded-md border border-slate-200 bg-white/60 px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {type}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
