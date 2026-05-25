import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../components/ui/GlassCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { links } from '../config/links.js';
import { communityItems } from '../data/siteData.js';
import { link } from 'framer-motion/client';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <section className="page-shell py-14">
        <SectionHeader eyebrow={t('community.eyebrow')} title={t('community.title')} description={t('community.desc')} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {communityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard key={item.key} delay={index * 0.05}>
                <Icon className="mb-5 text-brand-600 dark:text-brand-300" size={26} />
                <h3 className="text-lg font-black">{t(`community.items.${item.key}.title`)}</h3>
                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{t(`community.items.${item.key}.desc`)}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <GlassCard>
            <SectionHeader eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.desc')} />
            <div className="mt-8 grid gap-3">
              {[
                ['WhatsApp', links.whatsappCommunity],
                ['Instagram' , links.instagrm],
                ['GitHub', links.github],
                ['LinkedIn', links.linkedin],
              ].map(([social, href]) => (
                <a key={social} href={href} target={href === '#' ? undefined : '_blank'} rel={href === '#' ? undefined : 'noreferrer'} className="rounded-lg border border-slate-200 bg-white/60 px-4 py-3 font-bold transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5">
                  {social}
                </a>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <form className="grid gap-4">
              <label className="grid gap-2 text-sm font-bold">
                {t('contact.form.name')}
                <input className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                {t('contact.form.email')}
                <input type="email" className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                {t('contact.form.track')}
                <select className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-brand-400 dark:border-white/10 dark:bg-ink-900">
                  <option>{t('contact.form.academic')}</option>
                  <option>{t('contact.form.technical')}</option>
                  <option>{t('contact.form.events')}</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                {t('contact.form.message')}
                <textarea rows="5" className="resize-none rounded-lg border border-slate-200 bg-white/80 px-4 py-3 outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5" />
              </label>
              <a href={links.teamjoin} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950">
                <Send size={17} />
                {t('contact.form.submit')}
              </a>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  );
}