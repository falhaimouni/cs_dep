import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WorkshopCard from '../components/cards/WorkshopCard.jsx';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { links } from '../config/links.js';
import { quickLinks, stats, workshops } from '../data/siteData.js';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <section className="divider">
        <div className="page-shell py-12 sm:py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl"
          >
            <p className="text-label">{t('home.hero.eyebrow')}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink dark:text-zinc-50 sm:text-4xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-4 text-base leading-7 text-ink-secondary dark:text-zinc-400">{t('home.hero.subtitle')}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button as={Link} to="/resources" variant="primary">
                {t('home.hero.cta')}
                <ArrowRight size={14} />
              </Button>
              <Button as={Link} to="/workshops" variant="secondary">
                {t('home.hero.secondary')}
              </Button>
              <Button as="a" href={links.whatsappCommunity} target="_blank" rel="noreferrer" variant="accent">
                {t('common.joinCommunity')}
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </MotionDiv>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-800">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="bg-surface px-4 py-4 dark:bg-zinc-950">
                <p className="text-lg font-semibold tabular-nums text-ink dark:text-zinc-100">{stat.value}</p>
                <p className="mt-0.5 text-xs text-ink-secondary dark:text-zinc-400">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader eyebrow={t('home.about.eyebrow')} title={t('home.about.title')} description={t('home.about.desc')} />
        <div className="mt-6 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-800">
          <div className="bg-surface p-5 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t('home.mission.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{t('home.mission.desc')}</p>
          </div>
          <div className="bg-surface p-5 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t('home.vision.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{t('home.vision.desc')}</p>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader eyebrow={t('home.quick.eyebrow')} title={t('home.quick.title')} description={t('home.quick.desc')} />
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.titleKey}
                href={link.href}
                className="group flex items-start gap-3 rounded border border-border bg-surface p-4 transition-colors duration-200 hover:border-border-strong hover:bg-surface-subtle dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded border border-border bg-surface-muted text-ink-secondary transition-colors duration-200 group-hover:border-accent/30 group-hover:text-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-ink dark:text-zinc-100">{t(link.titleKey)}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-ink-secondary dark:text-zinc-400">{t(link.descKey)}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader
          eyebrow={t('home.featured.eyebrow')}
          title={t('home.featured.title')}
          description={t('home.featured.desc')}
          action={
            <Button as={Link} to="/workshops" variant="ghost" size="sm" className="shrink-0 self-start sm:self-auto">
              View all
              <ArrowRight size={14} />
            </Button>
          }
        />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {workshops.slice(0, 2).map((workshop, index) => (
            <WorkshopCard key={workshop.key} item={workshop} delay={index * 0.04} />
          ))}
        </div>
      </section>

    </>
  );
}
