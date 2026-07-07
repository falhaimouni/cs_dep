import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { links } from '../config/links.js';
import { communityItems } from '../data/siteData.js';

const socialLinks = [
  { name: 'WhatsApp', href: links.whatsappCommunity },
  { name: 'Instagram', href: links.instagrm },
  { name: 'GitHub', href: links.github },
  { name: 'Team', href: '/team' },
];

export default function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <section className="page-shell py-10 sm:py-12">
        <SectionHeader eyebrow={t('community.eyebrow')} title={t('community.title')} description={t('community.desc')} />
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {communityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Panel key={item.key} delay={index * 0.03}>
                <div className="mb-3 grid h-8 w-8 place-items-center rounded border border-border bg-surface-muted text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  <Icon size={15} />
                </div>
                <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t(`community.items.${item.key}.title`)}</h3>
                <p className="mt-1 text-sm leading-5 text-ink-secondary dark:text-zinc-400">{t(`community.items.${item.key}.desc`)}</p>
              </Panel>
            );
          })}
        </div>
      </section>

      <section className="page-shell pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel animate={false}>
            <SectionHeader eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.desc')} />
            <div className="mt-6 divide-y divide-border rounded border border-border dark:divide-zinc-800 dark:border-zinc-800">
              {socialLinks.map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="focus-ring flex items-center justify-between px-4 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface-subtle dark:text-zinc-100 dark:hover:bg-zinc-900/50"
                >
                  {name}
                  <ArrowUpRight size={14} className="text-ink-tertiary dark:text-zinc-500" />
                </a>
              ))}
            </div>
          </Panel>

          <Panel animate={false}>
            <h3 className="text-sm font-semibold text-ink dark:text-zinc-100">{t('contact.form.submit')}</h3>
            <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">
              {t('contact.desc')}
            </p>
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-zinc-400">{t('contact.form.name')}</label>
                  <input className="input-field" readOnly aria-readonly="true" placeholder="—" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-zinc-400">{t('contact.form.email')}</label>
                  <input type="email" className="input-field" readOnly aria-readonly="true" placeholder="—" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-zinc-400">{t('contact.form.track')}</label>
                <select className="input-field" defaultValue="" disabled>
                  <option value="">{t('contact.form.academic')}</option>
                  <option>{t('contact.form.technical')}</option>
                  <option>{t('contact.form.events')}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-secondary dark:text-zinc-400">{t('contact.form.message')}</label>
                <textarea rows="4" className="input-field resize-none" readOnly aria-readonly="true" placeholder="—" />
              </div>
              <Button as="a" href={links.teamjoin} target="_blank" rel="noreferrer" variant="primary" className="w-full sm:w-auto">
                {t('contact.form.submit')}
                <ArrowUpRight size={14} />
              </Button>
              <p className="text-2xs text-ink-tertiary dark:text-zinc-500">
                Form submissions are handled via Google Forms.
              </p>
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
