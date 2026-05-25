import { Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo.jsx';
import { links } from '../../config/links.js';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 py-10 dark:border-white/10 dark:bg-ink-950/70">
      <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo className="h-20 w-20"/>
          <div>
            <p className="text-lg font-extrabold">{t('brand.name')}</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{t('footer.copy')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={links.whatsappCommunity} target="_blank" rel="noreferrer" className="rounded-lg bg-purple-300 px-4 py-2 text-sm font-black text-ink-950 transition hover:bg-purple-400">
            {t('common.joinCommunity')}
          </a>
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
