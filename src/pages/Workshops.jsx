import { useTranslation } from 'react-i18next';
import WorkshopCard from '../components/cards/WorkshopCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { workshops } from '../data/siteData.js';

export default function Workshops() {
  const { t } = useTranslation();
  const upcoming = workshops.filter((workshop) => workshop.status === 'upcoming');
  const previous = workshops.filter((workshop) => workshop.status === 'previous');

  return (
    <section className="page-shell py-14">
      <SectionHeader eyebrow={t('workshops.eyebrow')} title={t('workshops.title')} description={t('workshops.desc')} />
      <div className="mt-10">
        <h3 className="mb-4 text-2xl font-black">{t('workshops.upcomingTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((item, index) => (
            <WorkshopCard key={item.key} item={item} delay={index * 0.06} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h3 className="mb-4 text-2xl font-black">{t('workshops.previousTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {previous.map((item, index) => (
            <WorkshopCard key={item.key} item={item} delay={index * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
