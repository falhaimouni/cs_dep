import { ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getMajors, recommendCourses } from '../services/courseAdvisor.js';
import { localize } from '../utils/localize.js';

const steps = ['major', 'credits', 'completed', 'failed', 'recommendations'];

export default function AcademicAdvisor() {
  const { t, i18n } = useTranslation();
  const [majors, setMajors] = useState([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ majorId: 'cs', credits: 45, completedCourses: [], failedCourses: [] });
  const [advisorResult, setAdvisorResult] = useState(null);

  useEffect(() => {
    getMajors().then(setMajors);
  }, []);

  const selectedMajor = majors.find((major) => major.id === form.majorId) ?? majors[0];
  const courses = useMemo(() => selectedMajor?.semesters.flatMap((semester) => semester.courses) ?? [], [selectedMajor]);

  async function showRecommendations() {
    const data = await recommendCourses({
      majorId: form.majorId,
      completedCourses: form.completedCourses,
      failedCourses: form.failedCourses,
      completedCreditHours: form.credits,
    });
    setAdvisorResult(data);
    setStep(4);
  }

  function toggleCourse(field, code) {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(code)
        ? current[field].filter((item) => item !== code)
        : [...current[field], code],
    }));
  }

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('advisor.eyebrow')} title={t('advisor.title')}/>
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <Panel animate={false} className="p-4">
          <div className="space-y-2">
            {steps.map((item, index) => (
              <button key={item} type="button" onClick={() => setStep(index)} className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm transition ${step === index ? 'bg-accent text-white' : 'text-ink-secondary hover:bg-surface-subtle dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
                <span className="grid h-6 w-6 place-items-center rounded-full border border-current text-2xs">{index + 1}</span>
                {t(`advisor.steps.${item}`)}
              </button>
            ))}
          </div>
        </Panel>

        <Panel animate={false} className="p-5">
          {step === 0 && (
            <div>
              <h3 className="text-lg font-semibold text-ink dark:text-zinc-50">{t('advisor.chooseMajor')}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {majors.map((major) => (
                  <button key={major.id} type="button" onClick={() => setForm((current) => ({ ...current, majorId: major.id }))} className={`rounded-xl border p-4 text-left transition ${form.majorId === major.id ? 'border-accent bg-accent/10' : 'border-border hover:border-border-strong dark:border-zinc-800'}`}>
                    <GraduationCap size={18} className="mb-3 text-accent" />
                    <span className="font-medium text-ink dark:text-zinc-100">{localize(major.name, i18n.language)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-ink dark:text-zinc-50">{t('advisor.credits')}</h3>
              <input type="number" min="0" max="132" value={form.credits} onChange={(event) => setForm((current) => ({ ...current, credits: event.target.value }))} className="input-field mt-4 max-w-xs" />
            </div>
          )}

          {(step === 2 || step === 3) && (
            <div>
              <h3 className="text-lg font-semibold text-ink dark:text-zinc-50">{step === 2 ? t('advisor.completed') : t('advisor.failed')}</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {courses.map((course) => (
                  <button key={`${step}-${course.code}`} type="button" onClick={() => toggleCourse(step === 2 ? 'completedCourses' : 'failedCourses', course.code)} className={`flex items-center justify-between rounded border p-3 text-left transition ${form[step === 2 ? 'completedCourses' : 'failedCourses'].includes(course.code) ? 'border-accent bg-accent/10' : 'border-border hover:bg-surface-subtle dark:border-zinc-800 dark:hover:bg-zinc-900'}`}>
                    <span>
                      <span className="block text-sm font-medium text-ink dark:text-zinc-100">{course.code}</span>
                      <span className="text-xs text-ink-secondary dark:text-zinc-400">{localize(course.name, i18n.language)}</span>
                    </span>
                    <CheckCircle2 size={16} className="text-accent" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink dark:text-zinc-50">{t('advisor.recommended')}</h3>
                  <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">
                    {advisorResult?.totalRecommendedCredits ?? 0} / {advisorResult?.targetCredits ?? 18} {t('courses.credits')} · {t('advisor.balanced')}
                  </p>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {advisorResult?.recommendations.length ?? 0} {t('advisor.available')}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {advisorResult?.recommendations.map((course) => (
                  <div key={course.code} className="rounded-xl border border-border bg-gradient-to-br from-white to-teal-50/60 p-4 dark:border-zinc-800 dark:from-zinc-950 dark:to-teal-950/20">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-accent">{course.code}</p>
                        <h4 className="mt-1 font-semibold text-ink dark:text-zinc-50">{localize(course.name, i18n.language)}</h4>
                      </div>
                      <span className="rounded-full bg-ink px-2 py-1 text-2xs text-white dark:bg-zinc-100 dark:text-zinc-950">{course.credits} {t('courses.credits')}</span>
                    </div>
                    <p className="mt-3 text-sm text-ink-secondary dark:text-zinc-400">{localize(course.reason, i18n.language)}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {course.prerequisites.length ? course.prerequisites.map((code) => (
                        <span key={code} className="rounded-full bg-white px-2 py-1 text-2xs font-medium text-ink-secondary ring-1 ring-border dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">
                          {t('advisor.prereq')} {code}
                        </span>
                      )) : (
                        <span className="rounded-full bg-white px-2 py-1 text-2xs font-medium text-ink-secondary ring-1 ring-border dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">
                          {t('courses.noPrereq')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-ink dark:text-zinc-50">{t('advisor.blocked')}</h3>
                <p className="mt-1 text-sm text-ink-secondary dark:text-zinc-400">{t('advisor.blockedDesc')}</p>
                <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pe-1">
                  {advisorResult?.blocked.slice(0, 18).map((course) => (
                    <div key={course.code} className="rounded-xl border border-border bg-surface p-4 dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{course.code}</p>
                          <h4 className="mt-1 font-semibold text-ink dark:text-zinc-50">{localize(course.name, i18n.language)}</h4>
                        </div>
                        <span className="rounded-full bg-rose-50 px-2 py-1 text-2xs font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                          {t('advisor.missing')}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-ink-secondary dark:text-zinc-400">{localize(course.reason, i18n.language)}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {course.missingPrerequisites.map((item) => (
                          <span key={item.code} className="rounded-full bg-surface-subtle px-2 py-1 text-2xs font-medium text-ink-secondary dark:bg-zinc-800 dark:text-zinc-300">
                            {item.code} · {localize(item.name, i18n.language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-2">
            {step > 0 && <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>{t('common.back')}</Button>}
            {step < 3 && <Button onClick={() => setStep((value) => value + 1)}>{t('common.next')}<ArrowRight size={14} /></Button>}
            {step === 3 && <Button onClick={showRecommendations}>{t('advisor.show')}<ArrowRight size={14} /></Button>}
          </div>
        </Panel>
      </div>
    </section>
  );
}
