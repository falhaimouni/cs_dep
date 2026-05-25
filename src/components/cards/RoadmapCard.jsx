import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard.jsx';

export default function RoadmapCard({ item, delay = 0 }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const base = `roadmaps.items.${item.key}`;

  return (
    <GlassCard delay={delay} className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-400/20 text-brand-600 dark:text-brand-300">
          <Icon size={22} />
        </div>
        <a href="https://roadmap.sh" className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-brand-600 dark:hover:bg-white/10">
          <ExternalLink size={17} />
        </a>
      </div>
      <h3 className="mt-5 text-xl font-black">{t(`${base}.title`)}</h3>
      <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{t(`${base}.desc`)}</p>
      <div className="mt-6 space-y-3">
        {item.steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-ink-900 text-xs font-black text-white dark:bg-white dark:text-ink-950">
              {index + 1}
            </span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{step}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
