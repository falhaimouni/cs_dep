import { Menu, MessageCircle, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../BrandLogo.jsx';
import Button from '../ui/Button.jsx';
import { links } from '../../config/links.js';
import { useTheme } from '../../hooks/useTheme.js';

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/advisor', key: 'nav.advisor' },
  { to: '/courses', key: 'nav.courses' },
  { to: '/news', key: 'nav.news' },
  { to: '/team', key: 'nav.team' },
  { to: '/code-reviewer', key: 'nav.reviewer' },
  { to: '/contact', key: 'nav.contact' },
];

function NavItem({ item, onClick }) {
  const { t } = useTranslation();

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `focus-ring nav-link ${isActive ? 'nav-link-active after:scale-x-100' : ''}`
      }
    >
      {t(item.key)}
    </NavLink>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language?.startsWith('ar') ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-[8px] dark:border-zinc-800 dark:bg-[#09090b]/95">
      <nav className="page-shell flex h-14 items-center justify-between gap-4">
        <NavLink to="/" className="focus-ring flex items-center gap-2.5 rounded" onClick={() => setOpen(false)}>
          <BrandLogo className="h-7 w-7" />
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold leading-none text-ink dark:text-zinc-100">{t('brand.name')}</span>
            <span className="mt-0.5 block text-2xs text-ink-tertiary dark:text-zinc-500">{t('brand.tagline')}</span>
          </span>
        </NavLink>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            as="a"
            href={links.whatsappCommunity}
            target="_blank"
            rel="noreferrer"
            variant="accent"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <MessageCircle size={14} />
            {t('common.joinCommunity')}
          </Button>
          <button
            type="button"
            onClick={switchLanguage}
            className="focus-ring grid h-8 min-w-8 place-items-center rounded border border-border bg-surface px-2 text-2xs font-medium text-ink transition-colors duration-200 hover:bg-surface-subtle dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {i18n.language?.startsWith('ar') ? 'EN' : 'AR'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring grid h-8 w-8 place-items-center rounded border border-border bg-surface text-ink-secondary transition-colors duration-200 hover:bg-surface-subtle dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label={t('nav.theme')}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            className="focus-ring grid h-8 w-8 place-items-center rounded border border-border bg-surface text-ink lg:hidden dark:border-zinc-700 dark:bg-zinc-900"
            onClick={() => setOpen((value) => !value)}
            aria-label={t('nav.menu')}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="divider lg:hidden">
          <div className="page-shell py-2">
            <div className="grid gap-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `focus-ring rounded px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-surface-subtle text-ink dark:bg-zinc-800 dark:text-zinc-100'
                        : 'text-ink-secondary hover:bg-surface-subtle dark:text-zinc-400 dark:hover:bg-zinc-800'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
              <a
                href={links.whatsappCommunity}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center justify-center gap-2 rounded bg-accent px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                <MessageCircle size={15} />
                {t('common.joinCommunity')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
