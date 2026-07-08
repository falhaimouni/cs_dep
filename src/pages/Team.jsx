import { Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { createElement } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { teamGroups } from '../data/siteData.js';

const socials = [
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Github, label: 'GitHub' },
  { icon: Mail, label: 'Email' },
];

const MotionArticle = motion.article;

export default function Team() {
  const { t } = useTranslation();

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('team.eyebrow')} title={t('team.title')} description={t('team.desc')} />
      <div className="mt-8 space-y-8">
        {teamGroups.map((group) => (
          <div key={group.key}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t(`team.groups.${group.key}`)}</h3>
              <span className="h-px flex-1 bg-border dark:bg-zinc-800" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.members.map((member, index) => (
                <MotionArticle
                  key={member}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-teal-950/10 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-fuchsia-500 opacity-80" />
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 text-lg font-semibold text-white">
                      {member.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ink dark:text-zinc-50">{member}</h3>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-2xs font-medium text-accent">
                        <Sparkles size={11} />
                        {t(`team.groups.${group.key}`)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex gap-2">
                    {socials.map(({ icon, label }) => (
                      <button key={label} type="button" className="icon-button" aria-label={label}>
                        {createElement(icon, { size: 15 })}
                      </button>
                    ))}
                  </div>
                </MotionArticle>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
