import { CalendarDays, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../components/ui/Badge.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getAnnouncements } from '../services/announcements.js';
import { localize } from '../utils/localize.js';

export default function DepartmentNews() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({ categories: [], items: [] });
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getAnnouncements().then(setData);
  }, []);

  const items = useMemo(() => data.items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const content = `${localize(item.title, i18n.language)} ${localize(item.summary, i18n.language)}`.toLowerCase();
    return matchesCategory && content.includes(query.toLowerCase());
  }), [category, data.items, i18n.language, query]);
  const featured = items.find((item) => item.featured) ?? items[0];

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('news.eyebrow')} title={t('news.title')} description={t('news.desc')} />
      {featured && (
        <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-ink to-zinc-800 p-6 text-white shadow-xl shadow-zinc-950/10 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-200"><Star size={15} />{t('news.featured')}</div>
          <h3 className="mt-4 max-w-2xl text-2xl font-semibold">{localize(featured.title, i18n.language)}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">{localize(featured.summary, i18n.language)}</p>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-tertiary" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="input-field ps-9" placeholder={t('news.search')} /></div>
        <div className="flex flex-wrap gap-2">
          {['all', ...data.categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3 py-2 text-xs font-medium transition ${category === item ? 'bg-accent text-white' : 'bg-surface-subtle text-ink-secondary dark:bg-zinc-800 dark:text-zinc-300'}`}>{t(`news.categories.${item}`)}</button>)}
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <Panel key={item.id} delay={index * 0.03} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <Badge>{t(`news.categories.${item.category}`)}</Badge>
              <span className="flex items-center gap-1 text-xs text-ink-tertiary"><CalendarDays size={13} />{item.date}</span>
            </div>
            <h3 className="mt-4 font-semibold text-ink dark:text-zinc-50">{localize(item.title, i18n.language)}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{localize(item.summary, i18n.language)}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
