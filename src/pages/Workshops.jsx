import { useTranslation } from 'react-i18next';
import WorkshopCard from '../components/cards/WorkshopCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { workshops } from '../data/siteData.js';

function WorkshopSection({ title, items }) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{title}</h3>
        <span className="h-px flex-1 bg-border dark:bg-zinc-800" />
        <span className="text-2xs tabular-nums text-ink-tertiary dark:text-zinc-500">{items.length}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <WorkshopCard key={item.key} item={item} delay={index * 0.04} />
        ))}
      </div>
    </div>
  );
}

export default function Workshops() {
  const { t } = useTranslation();
  const upcoming = workshops.filter((workshop) => workshop.status === 'upcoming');
  const previous = workshops.filter((workshop) => workshop.status === 'previous');

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('workshops.eyebrow')} title={t('workshops.title')} description={t('workshops.desc')} />
      <div className="mt-8 space-y-10">
        <WorkshopSection title={t('workshops.upcomingTitle')} items={upcoming} />
        <WorkshopSection title={t('workshops.previousTitle')} items={previous} />
      </div>
    </section>
  );
}
