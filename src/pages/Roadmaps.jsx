import { useTranslation } from 'react-i18next';
import RoadmapCard from '../components/cards/RoadmapCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { roadmaps } from '../data/siteData.js';

export default function Roadmaps() {
  const { t } = useTranslation();

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('roadmaps.eyebrow')} title={t('roadmaps.title')} description={t('roadmaps.desc')} />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((item, index) => (
          <RoadmapCard key={item.key} item={item} delay={index * 0.03} />
        ))}
      </div>
    </section>
  );
}
