import { Lightbulb, MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { links } from '../config/links.js';

export default function FeedbackBar() {
  const { t } = useTranslation();

  return (
    <section className="page-shell py-12">
      <div className="glass-panel grid gap-5 rounded-lg p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-brand-400/20 text-brand-700 dark:text-brand-300">
          <Lightbulb size={26} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MessageCircle size={18} className="text-brand-600 dark:text-brand-300" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{t('feedback.eyebrow')}</p>
          </div>
          <h2 className="mt-2 text-2xl font-black text-ink-950 dark:text-white">{t('feedback.title')}</h2>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{t('feedback.desc')}</p>
        </div>
        <a
          href={links.feedbackForm}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950"
        >
          <Send size={17} />
          {t('feedback.cta')}
        </a>
      </div>
    </section>
  );
}