import { useTranslation } from 'react-i18next';
import SectionHeader from './ui/SectionHeader.jsx';

export default function FAQ() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true });

  return (
    <section className="page-shell py-12">
      <SectionHeader eyebrow={t('faq.eyebrow')} title={t('faq.title')} description={t('faq.desc')} />
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="glass-panel group rounded-lg p-5">
            <summary className="cursor-pointer list-none text-lg font-black marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-900/5 text-xl leading-none dark:bg-white/10">+</span>
              </span>
            </summary>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
