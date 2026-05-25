import { useTranslation } from 'react-i18next';
import TeamCard from '../components/cards/TeamCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { teamGroups } from '../data/siteData.js';

export default function Team() {
  const { t } = useTranslation();

  return (
    <section className="page-shell py-14">
      <SectionHeader eyebrow={t('team.eyebrow')} title={t('team.title')} description={t('team.desc')} />
      <div className="mt-10 space-y-10">
        {teamGroups.map((group) => (
          <div key={group.key}>
            <h3 className="mb-4 text-2xl font-black">{t(`team.groups.${group.key}`)}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.members.map((member, index) => (
                <TeamCard key={member} name={member} role={t(`team.groups.${group.key}`)} index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
