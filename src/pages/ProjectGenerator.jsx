import { Boxes, Database, Layers3, Sparkles } from 'lucide-react';
import { createElement } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { generateProject, getProjectOptions } from '../services/projects.js';

export default function ProjectGenerator() {
  const { t } = useTranslation();
  const [options, setOptions] = useState({ courses: [], difficulties: [], categories: [] });
  const [form, setForm] = useState({ course: '', difficulty: '', category: '' });
  const [project, setProject] = useState(null);

  useEffect(() => {
    getProjectOptions().then((data) => {
      setOptions(data);
      setForm({ course: data.courses[0], difficulty: data.difficulties[0], category: data.categories[0] });
    });
  }, []);

  async function submit(event) {
    event.preventDefault();
    setProject(await generateProject(form));
  }

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('projects.eyebrow')} title={t('projects.title')} description={t('projects.desc')} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel animate={false} className="p-5">
          <form onSubmit={submit} className="space-y-4">
            {[
              ['course', options.courses],
              ['difficulty', options.difficulties],
              ['category', options.categories],
            ].map(([key, values]) => (
              <label key={key} className="block text-sm font-medium capitalize text-ink dark:text-zinc-100">
                {t(`projects.${key}`)}
                <select value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="input-field mt-2">
                  {values.map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
            ))}
            <Button className="w-full"><Sparkles size={14} />{t('projects.generate')}</Button>
          </form>
        </Panel>
        <Panel animate={false} className="overflow-hidden">
          <div className="border-b border-border bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-fuchsia-500/10 p-5 dark:border-zinc-800">
            <p className="text-label">{project?.course ?? 'Course project'}</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink dark:text-zinc-50">{project?.title ?? t('projects.empty')}</h3>
            {project && <p className="mt-2 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{project.description}</p>}
          </div>
          {project && (
            <div className="grid gap-5 p-5 lg:grid-cols-2">
              <Info icon={Layers3} title={t('projects.technologies')} items={project.technologies} />
              <Info icon={Database} title={t('projects.database')} items={[project.database]} />
              <Info icon={Boxes} title={t('projects.apis')} items={project.apis} />
              <Info icon={Sparkles} title={t('projects.extra')} items={project.extraFeatures} />
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold text-ink dark:text-zinc-100">{t('projects.steps')}</h4>
                <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                  {project.steps.map((step, index) => <li key={step} className="rounded border border-border px-3 py-2 text-sm text-ink-secondary dark:border-zinc-800 dark:text-zinc-400">{index + 1}. {step}</li>)}
                </ol>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </section>
  );
}

function Info({ icon, title, items }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-zinc-100">
        {createElement(icon, { size: 16, className: 'text-accent' })}
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full bg-surface-subtle px-2.5 py-1 text-xs text-ink-secondary dark:bg-zinc-800 dark:text-zinc-300">{item}</span>)}</div>
    </div>
  );
}
