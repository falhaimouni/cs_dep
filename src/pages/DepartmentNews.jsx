import { CalendarDays, ExternalLink, Search, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../components/ui/Badge.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getAnnouncements } from '../services/announcements.js';
import { getUniversityNews } from '../services/universityNews.js';
import { localize } from '../utils/localize.js';

function UniversityNewsCard({ item }) {
  const { t } = useTranslation();

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group overflow-hidden rounded border border-border bg-surface transition-colors duration-200 hover:border-accent dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="aspect-[16/9] overflow-hidden bg-surface-subtle dark:bg-zinc-900">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-ink-tertiary dark:text-zinc-500">
            {t('news.university.noImage')}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-xs text-ink-tertiary dark:text-zinc-500">
            <CalendarDays size={13} />
            {item.date}
          </span>
          <ExternalLink size={14} className="text-ink-tertiary transition-colors group-hover:text-accent dark:text-zinc-500" />
        </div>
        <h3 className="mt-3 text-sm font-semibold leading-6 text-ink dark:text-zinc-50">{item.title}</h3>
        {item.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{item.summary}</p>
        )}
      </div>
    </a>
  );
}

export default function DepartmentNews() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({ categories: [], items: [] });
  const [universityNews, setUniversityNews] = useState({
    source: 'Zarqa University',
    lastUpdated: null,
    stale: false,
    message: null,
    news: [],
  });
  const [universityNewsStatus, setUniversityNewsStatus] = useState('loading');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getAnnouncements().then(setData);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setUniversityNewsStatus('loading');

    getUniversityNews()
      .then((payload) => {
        if (!isMounted) return;
        setUniversityNews({
          source: payload.source ?? 'Zarqa University',
          lastUpdated: payload.lastUpdated ?? null,
          stale: Boolean(payload.stale),
          message: payload.message ?? null,
          news: Array.isArray(payload.news) ? payload.news : [],
        });
        setUniversityNewsStatus('ready');
      })
      .catch(() => {
        if (!isMounted) return;
        setUniversityNews((current) => ({
          ...current,
          stale: true,
          message: t('news.university.error'),
          news: [],
        }));
        setUniversityNewsStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  const items = useMemo(() => data.items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const content = `${localize(item.title, i18n.language)} ${localize(item.summary, i18n.language)}`.toLowerCase();
    return matchesCategory && content.includes(query.toLowerCase());
  }), [category, data.items, i18n.language, query]);
  const featured = items.find((item) => item.featured) ?? items[0];

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('news.eyebrow')} title={t('news.title')}/>
      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label">{t('news.university.eyebrow')}</p>
            <h2 className="mt-1 text-xl font-semibold text-ink dark:text-zinc-50">{t('news.university.title')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary dark:text-zinc-400">
              {t('news.university.desc')}
            </p>
          </div>
          {universityNews.lastUpdated && (
            <span className="text-xs text-ink-tertiary dark:text-zinc-500">
              {t('news.university.updated')} {new Date(universityNews.lastUpdated).toLocaleString(i18n.language)}
            </span>
          )}
        </div>

        {universityNewsStatus === 'loading' && (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Panel key={item} animate={false} className="p-0">
                <div className="aspect-[16/9] animate-pulse bg-surface-subtle dark:bg-zinc-900" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-surface-subtle dark:bg-zinc-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-surface-subtle dark:bg-zinc-800" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface-subtle dark:bg-zinc-800" />
                </div>
              </Panel>
            ))}
          </div>
        )}

        {universityNewsStatus !== 'loading' && (universityNews.message || universityNewsStatus === 'error') && (
          <div className="mt-5 rounded border border-border bg-surface p-4 text-sm text-ink-secondary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            {universityNews.message || t('news.university.error')}
          </div>
        )}

        {universityNewsStatus !== 'loading' && universityNews.news.length > 0 && (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {universityNews.news.slice(0, 6).map((item) => (
              <UniversityNewsCard key={item.url} item={item} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-12">
        <p className="text-label">{t('news.department')}</p>
      </div>
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
