import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { generateStudyPlan } from '../services/studyPlanner.js';
import { localize } from '../utils/localize.js';

export default function StudyPlanner() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ subject: 'Data Structures', examDate: '', chaptersCompleted: 2 });
  const [plan, setPlan] = useState([]);
  const progress = plan.length ? Math.round((Number(form.chaptersCompleted) / (Number(form.chaptersCompleted) + plan.length)) * 100) : 20;

  async function submit(event) {
    event.preventDefault();
    setPlan(await generateStudyPlan(form));
  }

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('planner.eyebrow')} title={t('planner.title')} description={t('planner.desc')} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel animate={false} className="p-5">
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-ink dark:text-zinc-100">{t('planner.subject')}<input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="input-field mt-2" /></label>
            <label className="block text-sm font-medium text-ink dark:text-zinc-100">{t('planner.examDate')}<input type="date" value={form.examDate} onChange={(event) => setForm({ ...form, examDate: event.target.value })} className="input-field mt-2" /></label>
            <label className="block text-sm font-medium text-ink dark:text-zinc-100">{t('planner.completed')}<input type="number" min="0" value={form.chaptersCompleted} onChange={(event) => setForm({ ...form, chaptersCompleted: event.target.value })} className="input-field mt-2" /></label>
            <Button className="w-full">{t('planner.generate')}</Button>
          </form>
        </Panel>
        <div>
          <Panel animate={false} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label">{t('planner.progress')}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink dark:text-zinc-50">{progress}%</h3>
              </div>
              <CalendarDays className="text-accent" />
            </div>
            <div className="mt-4 h-2 rounded-full bg-surface-subtle dark:bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500" style={{ width: `${progress}%` }} /></div>
          </Panel>
          <div className="mt-4 grid gap-3">
            {(plan.length ? plan : []).map((day, index) => (
              <Panel key={day.id} delay={index * 0.03} className="p-4">
                <div className="flex gap-4">
                  <div className="text-center"><p className="text-2xs text-ink-tertiary">{day.date}</p><CheckCircle2 className="mt-2 text-accent" size={18} /></div>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-zinc-50">{localize(day.title, i18n.language)} · {day.chapterRange}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {day.tasks.map((task) => <span key={task} className="rounded-full bg-surface-subtle px-2 py-1 text-xs text-ink-secondary dark:bg-zinc-800 dark:text-zinc-300">{task}</span>)}
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
