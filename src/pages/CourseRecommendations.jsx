import { BookOpen, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../components/ui/Badge.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { getMajors } from '../services/courseAdvisor.js';
import { localize } from '../utils/localize.js';

export default function CourseRecommendations() {
  const { t, i18n } = useTranslation();
  const [majors, setMajors] = useState([]);
  const [majorId, setMajorId] = useState('cs');
  const [semesterId, setSemesterId] = useState('');
  const [query, setQuery] = useState('');
  const selectedMajor = majors.find((major) => major.id === majorId) ?? majors[0];
  const semesters = selectedMajor?.semesters ?? [];
  const activeSemester = semesters.find((semester) => semester.id === semesterId) ?? semesters[0];

  useEffect(() => {
    getMajors().then((data) => {
      setMajors(data);
      setSemesterId(data[0]?.semesters[0]?.id ?? '');
    });
  }, []);

  const courses = useMemo(() => {
    const items = activeSemester?.courses ?? [];
    return items.filter((course) =>
      `${course.code} ${localize(course.name, i18n.language)}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [activeSemester, i18n.language, query]);

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('courses.eyebrow')} title={t('courses.title')} description={t('courses.desc')} />
      <div className="mt-8 grid gap-4 lg:grid-cols-[260px_1fr]">
        <Panel animate={false} className="p-4">
          <label className="text-label">{t('courses.major')}</label>
          <select value={majorId} onChange={(event) => {
            setMajorId(event.target.value);
            const next = majors.find((major) => major.id === event.target.value);
            setSemesterId(next?.semesters[0]?.id ?? '');
          }} className="input-field mt-2">
            {majors.map((major) => <option key={major.id} value={major.id}>{localize(major.name, i18n.language)}</option>)}
          </select>
          <div className="mt-5 space-y-2">
            <p className="text-label">{t('courses.timeline')}</p>
            {semesters.map((semester) => (
              <button key={semester.id} type="button" onClick={() => setSemesterId(semester.id)} className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm transition ${activeSemester?.id === semester.id ? 'bg-accent text-white' : 'text-ink-secondary hover:bg-surface-subtle dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="min-w-0">
                  <span className="block truncate">{localize(semester.label, i18n.language)}</span>
                  <span className="block text-2xs opacity-70">{semester.requiredCredits} {t('courses.credits')}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>
        <div>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-field ps-9" placeholder={t('courses.search')} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {courses.map((course, index) => (
              <Panel key={course.code} delay={index * 0.03} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><BookOpen size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-accent">{course.code}</p>
                    <h3 className="font-semibold text-ink dark:text-zinc-50">{localize(course.name, i18n.language)}</h3>
                    <p className="mt-2 text-sm text-ink-secondary dark:text-zinc-400">
                      {course.credits} {t('courses.credits')} · {course.type} · {course.mode}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {course.prerequisites.length ? course.prerequisites.map((item) => <Badge key={item}>{item}</Badge>) : <Badge>{t('courses.noPrereq')}</Badge>}
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
