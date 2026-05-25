import { Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 py-10 dark:border-white/10 dark:bg-ink-950/70">
      <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-extrabold">{t('brand.name')}</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{t('footer.copy')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/contact" className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950">
            {t('footer.join')}
          </Link>
          {[Github, Linkedin, Mail].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              aria-label="Social link"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
