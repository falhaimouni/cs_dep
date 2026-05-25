import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/workshops', key: 'nav.workshops' },
  { to: '/roadmaps', key: 'nav.roadmaps' },
  { to: '/team', key: 'nav.team' },
  { to: '/contact', key: 'nav.contact' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language?.startsWith('ar') ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/[0.82]">
      <nav className="page-shell flex h-20 items-center justify-between gap-4">
        <NavLink to="/" className="focus-ring flex items-center gap-3 rounded-lg" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink-900 text-sm font-black text-white shadow-glow dark:bg-brand-400 dark:text-ink-950">
            CS
          </span>
          <span>
            <span className="block text-base font-extrabold leading-tight">{t('brand.name')}</span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">{t('brand.tagline')}</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950'
                    : 'text-slate-600 hover:bg-slate-900/5 hover:text-ink-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </div>

        <div className="hidden min-w-[210px] items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 xl:flex">
          <Search size={17} />
          <input
            aria-label={t('nav.search')}
            placeholder={t('nav.search')}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchLanguage}
            className="focus-ring rounded-lg border border-slate-200 bg-white/75 px-3 py-2 text-sm font-bold text-ink-900 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {i18n.language?.startsWith('ar') ? 'EN' : 'AR'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white/75 text-ink-900 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label={t('nav.theme')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white/75 text-ink-900 dark:border-white/10 dark:bg-white/5 dark:text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={t('nav.menu')}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="page-shell pb-4 lg:hidden">
          <div className="glass-panel grid gap-1 rounded-lg p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${isActive ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'text-slate-700 dark:text-slate-200'}`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
