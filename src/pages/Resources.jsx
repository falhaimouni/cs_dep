import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getResources } from '../services/resources.js';
import { localize } from '../utils/localize.js';

export default function Resources() {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    getResources().then(setResources);
  }, []);

  const categories = ['all', ...new Set(resources.map((item) => item.category))];
  const filteredResources = resources.filter((item) => {
    const title = localize(item.title, i18n.language).toLowerCase();
    const desc = localize(item.description, i18n.language).toLowerCase();
    const matchesQuery = `${item.code} ${title} ${desc}`.includes(query.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('resources.eyebrow')} title={t('resources.title')} description={t('resources.desc')} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-16 lg:self-start">
          <p className="text-label mb-2 px-1">{t('resources.sidebar')}</p>
          <nav className="flex flex-wrap gap-1 lg:flex-col">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category === 'all' ? null : category)}
                className={`focus-ring rounded px-2.5 py-1.5 text-left text-sm capitalize transition-colors duration-200 ${
                  (category === 'all' && !activeCategory) || activeCategory === category
                    ? 'bg-surface-subtle font-medium text-ink dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-ink-secondary hover:bg-surface-subtle dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {category === 'all' ? t('common.all') : category}
              </button>
            ))}
          </nav>
        </aside>

        <div>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-tertiary dark:text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('resources.search')}
              className="input-field ps-9"
            />
          </div>

          {filteredResources.length === 0 ? (
            <EmptyState
              icon={Search}
              title={t('resources.emptyTitle')}
              description={t('resources.emptyDesc')}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveCategory(null);
                  }}
                  className="text-sm font-medium text-accent hover:text-accent-hover dark:text-teal-400"
                >
                  {t('resources.clear')}
                </button>
              }
            />
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((item, index) => (
                <Panel key={item.id} delay={index * 0.03} className="group flex h-full flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                      <BookOpen size={18} />
                    </div>
                    <span className="rounded-full bg-surface-subtle px-2 py-1 text-2xs font-medium uppercase text-ink-tertiary dark:bg-zinc-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-accent">{item.code}</p>
                  <h3 className="mt-1 font-semibold text-ink dark:text-zinc-50">{localize(item.title, i18n.language)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{localize(item.description, i18n.language)}</p>
                  <Link to={`/resources/${item.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
                    {t('resources.openDetails')}
                    <ArrowRight size={14} />
                  </Link>
                </Panel>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
