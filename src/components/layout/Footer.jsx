import { Github, Instagram, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../BrandLogo.jsx';
import Button from '../ui/Button.jsx';
import { links } from '../../config/links.js';

const socialLinks = [
  { Icon: Instagram, href: links.instagrm, label: 'Instagram' },
  { Icon: Github, href: links.github, label: 'GitHub' },
  { Icon: Users, href: '/team', label: 'Team' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="divider mt-auto bg-surface dark:bg-zinc-950">
      <div className="page-shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <BrandLogo className="h-7 w-7" />
          <div>
            <p className="text-sm font-semibold text-ink dark:text-zinc-100">{t('brand.name')}</p>
            <p className="mt-1 max-w-md text-sm leading-5 text-ink-secondary dark:text-zinc-400">{t('footer.copy')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button as="a" href={links.whatsappCommunity} target="_blank" rel="noreferrer" variant="accent" size="sm">
            {t('common.joinCommunity')}
          </Button>
          {socialLinks.map((social) => {
            const SocialIcon = social.Icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="focus-ring grid h-8 w-8 place-items-center rounded border border-border text-ink-secondary transition-colors duration-200 hover:border-border-strong hover:text-ink dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                aria-label={social.label}
              >
                <SocialIcon size={15} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
