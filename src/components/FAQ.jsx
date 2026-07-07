import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import faqData from '../data/faq.json';
import { localize } from '../utils/localize.js';
import SectionHeader from './ui/SectionHeader.jsx';

export default function FAQ() {
  const { t, i18n } = useTranslation();

  return (
    <section className="page-shell py-12">
      <SectionHeader eyebrow={t('faq.eyebrow')} title={t('faq.title')} description={t('faq.desc')} />
      <div className="mt-6 divide-y divide-border rounded border border-border dark:divide-zinc-800 dark:border-zinc-800">
        {faqData.items.map((item) => (
          <details key={localize(item.question, 'en')} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface-subtle dark:text-zinc-100 dark:hover:bg-zinc-900/50 [&::-webkit-details-marker]:hidden">
              {localize(item.question, i18n.language)}
              <ChevronDown
                size={16}
                className="shrink-0 text-ink-tertiary transition-transform duration-200 group-open:rotate-180 dark:text-zinc-500"
              />
            </summary>
            <p className="border-t border-border px-4 py-3 text-sm leading-6 text-ink-secondary dark:border-zinc-800 dark:text-zinc-400">
              {localize(item.answer, i18n.language)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
