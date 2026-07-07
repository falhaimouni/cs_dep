import { ArrowUpRight, FileText, FolderOpen, Presentation, Youtube } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createElement } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getResourceById } from '../services/resources.js';
import { localize } from '../utils/localize.js';

const resourceBlocks = [
  { key: 'pdfs', icon: FileText },
  { key: 'slides', icon: Presentation },
  { key: 'practice', icon: FolderOpen },
];

export default function ResourceDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    getResourceById(id).then(setCourse);
  }, [id]);

  if (!course) {
    return (
      <section className="page-shell py-12">
        <Panel className="p-6">{t('resources.notFound')}</Panel>
      </section>
    );
  }

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={course.code} title={localize(course.title, i18n.language)} description={localize(course.description, i18n.language)} action={<Button as={Link} to="/resources" variant="secondary">{t('common.back')}</Button>} />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <a href={course.resources.drive} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent dark:border-zinc-800 dark:bg-zinc-950">
          <FolderOpen className="text-accent" size={22} />
          <h3 className="mt-4 font-semibold text-ink dark:text-zinc-50">Google Drive</h3>
          <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">{t('resources.openCollection')}</p>
        </a>
        <a href={course.resources.notion} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent dark:border-zinc-800 dark:bg-zinc-950">
          <FileText className="text-accent" size={22} />
          <h3 className="mt-4 font-semibold text-ink dark:text-zinc-50">Notion</h3>
          <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">{t('resources.openCollection')}</p>
        </a>
        <a href={course.resources.youtube} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent dark:border-zinc-800 dark:bg-zinc-950">
          <Youtube className="text-accent" size={22} />
          <h3 className="mt-4 font-semibold text-ink dark:text-zinc-50">YouTube</h3>
          <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">{t('resources.watchRecordings')}</p>
        </a>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {resourceBlocks.map(({ key, icon }) => (
          <Panel key={key} className="p-5">
            {createElement(icon, { size: 20, className: 'text-accent' })}
            <h3 className="mt-3 font-semibold capitalize text-ink dark:text-zinc-50">{t(`resources.detail.${key}`)}</h3>
            <div className="mt-4 space-y-2">
              {course.resources[key].map((item) => (
                <button key={item} type="button" className="flex w-full items-center justify-between rounded border border-border px-3 py-2 text-left text-sm text-ink-secondary transition hover:border-accent hover:text-accent dark:border-zinc-800 dark:text-zinc-400">
                  {item}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
