import { AlertCircle, AlertTriangle, Bug, Clipboard, Code2, Copy, Lightbulb, ShieldCheck } from 'lucide-react';
import { createElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button.jsx';
import Panel from '../components/ui/Panel.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { reviewCode } from '../services/codeReview.js';

const demoCode = `function calculateAverage(numbers) {
  let sum = 0;

  for (let i = 0; i <= numbers.length; i++) {
    sum += numbers[i];
  }

  return sum / numbers.length;
}

const scores = [90, 80, 70];
console.log(calculateAverage(score));

let name = "Sara";
if (name = "Farah") {
  console.log("Hello Farah");
}

let total = "10";
let price = 5;
console.log(total + price);

function divide(a, b) {
  return a / b;
}
console.log(divide(10, 0));

const user = { name: "Farah" };
console.log(user.email.toLowerCase());

numbers.map((number) => console.log(number));`;

const groups = [
  { key: 'errors', icon: Bug, tone: 'rose' },
  { key: 'warnings', icon: AlertTriangle, tone: 'amber' },
  { key: 'suggestions', icon: Lightbulb, tone: 'teal' },
];

const toneClasses = {
  rose: 'border-rose-200 bg-rose-50/70 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
  amber: 'border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300',
  teal: 'border-teal-200 bg-teal-50/70 text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/20 dark:text-teal-300',
};

const severityClasses = {
  critical: 'bg-rose-700 text-white',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  low: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
};

export default function CodeReviewer() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(demoCode);
  const [result, setResult] = useState(null);

  async function submit() {
    setResult(await reviewCode({ code, language }));
  }

  return (
    <section className="page-shell py-10 sm:py-12">
      <SectionHeader eyebrow={t('reviewer.eyebrow')} title={t('reviewer.title')}/>
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <Panel animate={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-medium text-ink dark:text-zinc-100"><Code2 size={16} /> {t('reviewer.editor')}</div>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="input-field max-w-[170px] py-1.5">
              {['JavaScript', 'Python', 'Java', 'C++', 'HTML/CSS'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <textarea value={code} onChange={(event) => setCode(event.target.value)} className="min-h-[560px] w-full resize-y bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none" spellCheck="false" />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-3 dark:border-zinc-800">
            <Button onClick={submit}>{t('reviewer.review')}</Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCode(demoCode)}>{t('reviewer.demo')}</Button>
              <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(code)}><Copy size={14} />{t('reviewer.copy')}</Button>
            </div>
          </div>
        </Panel>

        <Panel animate={false} className="p-5">
          <div className="flex items-center gap-2"><Clipboard size={18} className="text-accent" /><h3 className="font-semibold text-ink dark:text-zinc-50">{t('reviewer.results')}</h3></div>
          {result ? (
            <div className="mt-4 space-y-5">
              <div className="rounded-xl border border-border bg-surface-subtle p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="text-sm text-ink-secondary dark:text-zinc-300">{result.summary}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {groups.map(({ key }) => (
                    <div key={key} className="rounded border border-border bg-surface p-2 dark:border-zinc-800 dark:bg-zinc-950">
                      <p className="text-lg font-semibold text-ink dark:text-zinc-50">{result.counts[key]}</p>
                      <p className="text-2xs text-ink-tertiary dark:text-zinc-500">{t(`reviewer.${key}`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-ink px-3 py-2 text-white dark:bg-zinc-100 dark:text-zinc-950">
                  <span className="flex items-center gap-2 text-sm font-medium"><ShieldCheck size={15} />{t('reviewer.quality')}</span>
                  <span className="text-sm font-semibold">{result.score}/10 · {result.quality}</span>
                </div>
              </div>

              {groups.map(({ key, icon, tone }) => (
                <div key={key}>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-zinc-100">
                    {createElement(icon, { size: 16 })}
                    {t(`reviewer.${key}`)}
                  </h4>
                  <div className="mt-2 space-y-3">
                    {result[key].length ? result[key].map((finding, index) => (
                      <article key={finding.id} className={`rounded-xl border p-3 ${toneClasses[tone]}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold">{index + 1}. {finding.title}</p>
                            <p className="mt-1 text-2xs opacity-80">{t('reviewer.line')} {finding.line}</p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-2xs font-semibold ${severityClasses[finding.severity] ?? severityClasses.medium}`}>
                            {finding.severity} · {finding.confidence ?? 70}%
                          </span>
                        </div>
                        {(finding.codeSnippet || finding.snippet) && (
                          <pre className="mt-3 overflow-x-auto rounded bg-zinc-950 p-3 text-xs leading-5 text-zinc-100"><code>{finding.codeSnippet || finding.snippet}</code></pre>
                        )}
                        <p className="mt-3 text-sm leading-6">{finding.explanation}</p>
                        {(finding.suggestedImprovement || finding.fix) && (
                          <div className="mt-3">
                            <p className="text-2xs font-semibold uppercase tracking-wider opacity-75">{t('reviewer.fix')}</p>
                            <pre className="mt-1 overflow-x-auto rounded bg-zinc-950 p-3 text-xs leading-5 text-zinc-100"><code>{finding.suggestedImprovement || finding.fix}</code></pre>
                          </div>
                        )}
                      </article>
                    )) : (
                      <p className="rounded border border-border px-3 py-2 text-sm text-ink-secondary dark:border-zinc-800 dark:text-zinc-400">{t('reviewer.none')}</p>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-zinc-100">
                  <AlertCircle size={16} />
                  {t('reviewer.limitations')}
                </h4>
                {result.status && (
                  <div className="mt-2 rounded-xl border border-border bg-surface-subtle p-3 text-sm text-ink-secondary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    <p><span className="font-semibold text-ink dark:text-zinc-100">{t('reviewer.detectedLanguage')}:</span> {result.status.detectedLanguage}</p>
                    <p className="mt-1"><span className="font-semibold text-ink dark:text-zinc-100">{t('reviewer.analysisLevel')}:</span> {result.status.supportedAnalysisLevel}</p>
                    {result.status.rulesExecuted?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {result.status.rulesExecuted.map((rule) => (
                          <span key={rule} className="rounded-full bg-surface px-2 py-1 text-2xs font-medium text-ink-secondary ring-1 ring-border dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">{rule}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 space-y-2">
                  {result.limitations?.length ? result.limitations.map((limitation) => (
                    <div key={limitation.id} className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-sky-300">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-semibold">{limitation.title}</p>
                        <span className={`rounded-full px-2 py-1 text-2xs font-semibold ${severityClasses[limitation.severity] ?? severityClasses.low}`}>
                          {limitation.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{limitation.explanation}</p>
                    </div>
                  )) : (
                    <p className="rounded border border-border px-3 py-2 text-sm text-ink-secondary dark:border-zinc-800 dark:text-zinc-400">{t('reviewer.noLimitations')}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-secondary dark:text-zinc-400">{t('reviewer.empty')}</p>
          )}
        </Panel>
      </div>
    </section>
  );
}
