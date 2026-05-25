import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ.jsx';
import WorkshopCard from '../components/cards/WorkshopCard.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { quickLinks, stats, workshops } from '../data/siteData.js';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <section className="page-shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-300/50 bg-brand-400/10 px-4 py-2 text-sm font-bold text-brand-700 dark:text-brand-300">
            <Sparkles size={16} />
            {t('home.hero.eyebrow')}
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.05] text-ink-950 dark:text-white md:text-7xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t('home.hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/resources" className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950">
              {t('home.hero.cta')}
              <ArrowRight size={17} />
            </Link>
            <Link to="/workshops" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/75 px-5 py-3 text-sm font-black text-ink-900 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <Play size={17} />
              {t('home.hero.secondary')}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="rounded-lg border border-slate-200 bg-white/[0.65] p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="glass-panel rounded-lg p-4">
          <div className="rounded-lg bg-ink-950 p-5 text-slate-100 shadow-glow">
            <div className="mb-5 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-coral-400" />
              <span className="h-3 w-3 rounded-full bg-brand-400" />
              <span className="h-3 w-3 rounded-full bg-mint-400" />
            </div>
            <pre className="overflow-hidden whitespace-pre-wrap text-sm leading-7 text-brand-100">
              <code>{t('home.hero.code')}</code>
            </pre>
          </div>
        </motion.div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader eyebrow={t('home.about.eyebrow')} title={t('home.about.title')} description={t('home.about.desc')} />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-2xl font-black">{t('home.mission.title')}</h3>
            <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">{t('home.mission.desc')}</p>
          </GlassCard>
          <GlassCard delay={0.08}>
            <h3 className="text-2xl font-black">{t('home.vision.title')}</h3>
            <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">{t('home.vision.desc')}</p>
          </GlassCard>
        </div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader eyebrow={t('home.quick.eyebrow')} title={t('home.quick.title')} description={t('home.quick.desc')} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a key={link.titleKey} href={link.href} className="glass-panel rounded-lg p-5 transition hover:-translate-y-1 hover:border-brand-300">
                <Icon className="mb-5 text-brand-600 dark:text-brand-300" size={26} />
                <h3 className="text-lg font-black">{t(link.titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(link.descKey)}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="page-shell py-12">
        <SectionHeader eyebrow={t('home.featured.eyebrow')} title={t('home.featured.title')} description={t('home.featured.desc')} />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {workshops.slice(0, 2).map((workshop, index) => (
            <WorkshopCard key={workshop.key} item={workshop} delay={index * 0.08} />
          ))}
        </div>
      </section>
      <FAQ />
    </>
  );
}
