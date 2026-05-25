import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResourceCard from '../components/cards/ResourceCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { resources } from '../data/siteData.js';

export default function Resources() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const filteredResources = resources.filter((item) => {
    const title = t(`resources.items.${item.key}.title`).toLowerCase();
    const desc = t(`resources.items.${item.key}.desc`).toLowerCase();
    return `${title} ${desc}`.includes(query.toLowerCase());
  });

  return (
    <section className="page-shell py-14">
      <SectionHeader eyebrow={t('resources.eyebrow')} title={t('resources.title')} description={t('resources.desc')} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel h-fit rounded-lg p-3 lg:sticky lg:top-24">
          <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t('resources.sidebar')}</p>
          <div className="grid gap-1">
            {resources.map((item) => (
              <a key={item.key} href={`#${item.key}`} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-900/5 hover:text-ink-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                {t(`resources.items.${item.key}.title`)}
              </a>
            ))}
          </div>
        </aside>

        <div>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <label className="glass-panel flex items-center gap-3 rounded-lg px-4 py-3">
              <Search size={18} className="text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('resources.search')}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <button className="glass-panel inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black">
              <Filter size={17} />
              {t('resources.filter')}
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((item, index) => (
              <div id={item.key} key={item.key} className="scroll-mt-28">
                <ResourceCard item={item} delay={index * 0.04} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
