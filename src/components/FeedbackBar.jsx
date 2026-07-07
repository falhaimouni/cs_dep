import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button.jsx';
import { links } from '../config/links.js';

export default function FeedbackBar() {
  const { t } = useTranslation();

  return (
    <section className="page-shell py-8">
      <div className="flex flex-col gap-4 rounded border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <p className="text-label">{t('feedback.eyebrow')}</p>
          <h2 className="mt-1 text-sm font-semibold text-ink dark:text-zinc-100">{t('feedback.title')}</h2>
          <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">{t('feedback.desc')}</p>
        </div>
        <Button as="a" href={links.feedbackForm} target="_blank" rel="noreferrer" variant="secondary" size="md" className="shrink-0">
          {t('feedback.cta')}
          <ArrowUpRight size={14} />
        </Button>
      </div>
    </section>
  );
}
