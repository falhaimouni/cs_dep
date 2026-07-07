import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Download, Map, RefreshCcw, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';
import { analyzeCareerAnswers, getCareerQuestions } from '../data/careerChatbot.js';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionSpan = motion.span;

const chatbotCopy = {
  en: {
    intro: 'Answer a few questions and we will suggest tech career paths that match your interests and work style.',
    typing: 'Loading next question',
    complete: 'Based on your answers, here are the career paths that align best with your profile.',
    open: 'Open career path quiz',
    close: 'Close career path quiz',
    title: 'Career Path Finder',
    subtitle: 'Discover your fit in tech',
    launcherTitle: 'Career Finder',
    launcherSubtitle: '8-question quiz',
    progress: 'Progress',
    bestMatch: 'Top match',
    match: 'Match',
    why: 'Why it fits:',
    whyText: 'Your answers suggest strengths in',
    technologies: 'Technologies',
    plan: 'Difficulty & timeline',
    viewRoadmap: 'View full roadmap',
    exploreResources: 'Browse resources',
    exportRoadmap: 'Export plan',
    restartQuiz: 'Start over',
    signals: 'Profile signals',
    signalItems: ['Interests', 'Personality', 'Work style', 'Logic vs creativity', 'Hardware vs software', 'Building vs analyzing'],
    howItWorks: 'How scoring works',
    howItWorksText: 'Each answer adds weighted points to career paths. Strong repeated patterns produce higher match scores.',
    savedResult: 'Saved locally',
    stored: 'match score',
    exportTitle: 'CS Department Career Match',
    difficulty: 'Difficulty',
    learningTime: 'Estimated learning time',
    beginnerRoadmap: 'Beginner roadmap',
    roadmapFor: 'Roadmap for',
    requiredSkills: 'Required skills',
    suggestedNextSteps: 'Suggested next steps',
    nextSteps: ['Build one beginner project', 'Share it on GitHub', 'Ask for feedback', 'Repeat with a slightly harder project'],
  },
  ar: {
    intro: 'أجب على بعض الأسئلة وسنقترح مسارات تقنية تناسب اهتماماتك وأسلوب عملك.',
    typing: 'جاري تحميل السؤال التالي',
    complete: 'بناءً على إجاباتك، هذه المسارات الأقرب لملفك.',
    open: 'فتح اختبار المسار المهني',
    close: 'إغلاق اختبار المسار المهني',
    title: 'اكتشاف المسار المهني',
    subtitle: 'اعرف مجالك في التقنية',
    launcherTitle: 'اكتشاف المسار',
    launcherSubtitle: 'اختبار من 8 أسئلة',
    progress: 'التقدم',
    bestMatch: 'أفضل تطابق',
    match: 'تطابق',
    why: 'لماذا يناسبك:',
    whyText: 'إجاباتك تشير إلى نقاط قوة في',
    technologies: 'التقنيات',
    plan: 'الصعوبة والمدة',
    viewRoadmap: 'عرض الخطة الكاملة',
    exploreResources: 'تصفح الموارد',
    exportRoadmap: 'تصدير الخطة',
    restartQuiz: 'البدء من جديد',
    signals: 'مؤشرات الملف',
    signalItems: ['الاهتمامات', 'الشخصية', 'أسلوب العمل', 'المنطق مقابل الإبداع', 'العتاد مقابل البرمجيات', 'البناء مقابل التحليل'],
    howItWorks: 'كيف يعمل التقييم',
    howItWorksText: 'كل إجابة تضيف نقاطاً موزونة لمسارات مهنية. تكرار الأنماط يعطي درجات تطابق أعلى.',
    savedResult: 'محفوظ محلياً',
    stored: 'درجة التطابق',
    exportTitle: 'نتيجة مسارك — CS Department',
    difficulty: 'مستوى الصعوبة',
    learningTime: 'مدة التعلم المتوقعة',
    beginnerRoadmap: 'خطة البداية',
    roadmapFor: 'خطة مسار',
    requiredSkills: 'المهارات المطلوبة',
    suggestedNextSteps: 'الخطوات المقترحة',
    nextSteps: ['ابنِ مشروعاً بسيطاً', 'ارفعه على GitHub', 'اطلب ملاحظات', 'كرر بمشروع أصعب قليلاً'],
  },
};

function TypingDots({ label }) {
  return (
    <div className="flex items-center gap-1 px-1 py-2" aria-label={label}>
      {[0, 1, 2].map((dot) => (
        <MotionSpan
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-ink-tertiary dark:bg-zinc-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, delay: dot * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ message, isArabic }) {
  const isUser = message.from === 'user';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded px-3 py-2 text-sm leading-5 ${isArabic ? 'text-right' : 'text-left'} ${
          isUser
            ? 'bg-ink text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'border border-border bg-surface text-ink-secondary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
        }`}
      >
        {message.text}
      </div>
    </MotionDiv>
  );
}

function RecommendationCard({ result, rank, copy, isArabic }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: rank * 0.05 }}
      className={`rounded border p-4 ${rank === 0 ? 'border-accent/40 bg-accent-muted/30 dark:border-accent/30 dark:bg-accent/5' : 'border-border dark:border-zinc-800'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-label">{rank === 0 ? copy.bestMatch : `${copy.match} ${rank + 1}`}</p>
          <h3 className="mt-0.5 text-sm font-semibold text-ink dark:text-zinc-100">{result.name}</h3>
        </div>
        <span className="text-lg font-semibold tabular-nums text-accent dark:text-teal-400">{result.match}%</span>
      </div>

      <p className="mt-2 text-sm leading-5 text-ink-secondary dark:text-zinc-400">{result.description}</p>
      <p className="mt-2 text-xs leading-5 text-ink-secondary dark:text-zinc-400">
        <span className="font-medium text-ink dark:text-zinc-300">{copy.why}</span>{' '}
        {copy.whyText} {result.skills.slice(0, 3).join(isArabic ? '، ' : ', ').toLowerCase()}.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {result.technologies.slice(0, 4).map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </MotionDiv>
  );
}

function RoadmapDetail({ result, copy }) {
  if (!result) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded border border-border p-4 dark:border-zinc-800"
    >
      <p className="text-label">{copy.roadmapFor}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink dark:text-zinc-100">{result.name}</h3>
          <p className="mt-1 max-w-xl text-sm leading-5 text-ink-secondary dark:text-zinc-400">{result.description}</p>
        </div>
        <Badge variant="accent">{result.match}% {copy.match}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded border border-border p-3 dark:border-zinc-800">
          <p className="text-xs font-medium text-ink dark:text-zinc-100">{copy.beginnerRoadmap}</p>
          <ol className="mt-2 space-y-2">
            {result.roadmap.map((step, index) => (
              <li key={step} className="flex gap-2 text-sm text-ink-secondary dark:text-zinc-400">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-border text-2xs font-medium dark:border-zinc-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <div className="rounded border border-border p-3 dark:border-zinc-800">
            <p className="text-xs font-medium text-ink dark:text-zinc-100">{copy.requiredSkills}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded border border-border p-3 dark:border-zinc-800">
            <p className="text-xs font-medium text-ink dark:text-zinc-100">{copy.suggestedNextSteps}</p>
            <ul className="mt-2 space-y-1.5">
              {copy.nextSteps.map((step) => (
                <li key={step} className="flex gap-2 text-sm text-ink-secondary dark:text-zinc-400">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-tertiary dark:bg-zinc-500" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

export default function CareerPathChatbot() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');
  const copy = isArabic ? chatbotCopy.ar : chatbotCopy.en;
  const questions = useMemo(() => getCareerQuestions(i18n.language), [i18n.language]);
  const botIntro = useMemo(() => ({ from: 'bot', text: copy.intro }), [copy.intro]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([botIntro]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const scrollRef = useRef(null);
  const currentQuestion = questions[questionIndex];
  const results = useMemo(() => (isComplete ? analyzeCareerAnswers(answers, i18n.language) : []), [answers, i18n.language, isComplete]);
  const progress = Math.round((answers.length / questions.length) * 100);

  useEffect(() => {
    setMessages([botIntro]);
    setQuestionIndex(0);
    setAnswers([]);
    setIsTyping(false);
    setIsComplete(false);
    setSelectedRoadmap(null);
  }, [botIntro]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, isOpen, isComplete]);

  useEffect(() => {
    if (!isOpen || messages.length > 1 || !currentQuestion) return;

    const timer = window.setTimeout(() => {
      setMessages((current) => [...current, { from: 'bot', text: currentQuestion.text }]);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [currentQuestion, isOpen, messages.length]);

  useEffect(() => {
    if (!isComplete || !results[0]) return;
    window.localStorage.setItem(
      'cs-dep-career-result',
      JSON.stringify({
        createdAt: new Date().toISOString(),
        topMatch: results[0].name,
        match: results[0].match,
        results: results.map(({ name, match }) => ({ name, match })),
      }),
    );
  }, [isComplete, results]);

  function answerQuestion(option) {
    if (isTyping || isComplete) return;

    const nextAnswers = [...answers, option];
    const nextQuestion = questions[questionIndex + 1];
    setAnswers(nextAnswers);
    setMessages((current) => [...current, { from: 'user', text: option.label }]);
    setIsTyping(true);

    window.setTimeout(() => {
      if (nextQuestion) {
        setQuestionIndex((index) => index + 1);
        setMessages((current) => [...current, { from: 'bot', text: nextQuestion.text }]);
      } else {
        setIsComplete(true);
        setMessages((current) => [...current, { from: 'bot', text: copy.complete }]);
        setSelectedRoadmap(null);
      }
      setIsTyping(false);
    }, 500);
  }

  function restartQuiz() {
    setMessages([botIntro]);
    setQuestionIndex(0);
    setAnswers([]);
    setIsTyping(false);
    setIsComplete(false);
    setSelectedRoadmap(null);
  }

  function showRoadmap() {
    if (!results[0]) return;
    setSelectedRoadmap(results[0]);
    window.setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 60);
  }

  function exportRoadmap() {
    if (!results[0]) return;
    const roadmapText = [
      `${copy.exportTitle}: ${results[0].name}`,
      `${copy.match}: ${results[0].match}%`,
      `${copy.difficulty}: ${results[0].difficulty}`,
      `${copy.learningTime}: ${results[0].learningTime}`,
      '',
      `${copy.beginnerRoadmap}:`,
      ...results[0].roadmap.map((step, index) => `${index + 1}. ${step}`),
      '',
      `${copy.technologies}: ${results[0].technologies.join(', ')}`,
    ].join('\n');
    const blob = new Blob([roadmapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${results[0].key}-roadmap.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`focus-ring fixed bottom-4 z-40 flex items-center gap-2.5 rounded border border-border bg-surface px-3 py-2 shadow-sm transition-colors duration-200 hover:border-border-strong hover:bg-surface-subtle dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600 dark:hover:bg-zinc-900 ${isArabic ? 'left-4' : 'right-4'}`}
        aria-label={copy.open}
      >
        <span className="grid h-8 w-8 place-items-center rounded border border-border bg-surface-muted text-accent dark:border-zinc-700 dark:bg-zinc-900 dark:text-teal-400">
          <Compass size={16} />
        </span>
        <span className={`hidden min-w-0 sm:block ${isArabic ? 'text-right' : 'text-left'}`}>
          <span className="block text-sm font-medium text-ink dark:text-zinc-100">{copy.launcherTitle}</span>
          <span className="block text-2xs text-ink-tertiary dark:text-zinc-500">{copy.launcherSubtitle}</span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 p-3 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MotionSection
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className={`flex h-[min(680px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded border border-border bg-surface-muted dark:border-zinc-800 dark:bg-zinc-950 ${isArabic ? 'text-right' : 'text-left'}`}
              dir={isArabic ? 'rtl' : 'ltr'}
              role="dialog"
              aria-modal="true"
              aria-label={copy.open}
            >
              <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 dark:border-zinc-800">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-ink dark:text-zinc-100">{copy.title}</h2>
                  <p className="truncate text-xs text-ink-secondary dark:text-zinc-400">{copy.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded border border-border text-ink-secondary transition-colors duration-200 hover:bg-surface-subtle dark:border-zinc-700 dark:hover:bg-zinc-800"
                  aria-label={copy.close}
                >
                  <X size={16} />
                </button>
              </header>

              <div className="border-b border-border px-4 py-2 dark:border-zinc-800">
                <div className="mb-1 flex items-center justify-between text-2xs text-ink-tertiary dark:text-zinc-500">
                  <span>{copy.progress}</span>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-subtle dark:bg-zinc-800">
                  <MotionDiv className="h-full rounded-full bg-accent" animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
                </div>
              </div>

              <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_240px]">
                <div className="flex min-h-0 flex-col">
                  <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                    {messages.map((message, index) => (
                      <ChatBubble key={`${message.from}-${message.text}-${index}`} message={message} isArabic={isArabic} />
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="rounded border border-border bg-surface px-3 dark:border-zinc-700 dark:bg-zinc-900">
                          <TypingDots label={copy.typing} />
                        </div>
                      </div>
                    )}

                    {isComplete && (
                      <div className="space-y-3 pt-1">
                        {results.map((result, index) => (
                          <RecommendationCard key={result.key} result={result} rank={index} copy={copy} isArabic={isArabic} />
                        ))}
                        <RoadmapDetail result={selectedRoadmap} copy={copy} />
                      </div>
                    )}
                  </div>

                  <footer className="border-t border-border p-3 dark:border-zinc-800">
                    {!isComplete ? (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {currentQuestion?.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            disabled={isTyping}
                            onClick={() => answerQuestion(option)}
                            className={`focus-ring rounded border border-border bg-surface px-3 py-2.5 text-sm text-ink transition-colors duration-200 hover:border-accent/40 hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-accent/30 dark:hover:bg-zinc-800 ${isArabic ? 'text-right' : 'text-left'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={showRoadmap} variant="primary" size="sm">
                          <Map size={14} />
                          {copy.viewRoadmap}
                        </Button>
                        <Button as={Link} to="/resources" onClick={() => setIsOpen(false)} variant="secondary" size="sm">
                          {copy.exploreResources}
                        </Button>
                        <Button type="button" onClick={exportRoadmap} variant="secondary" size="sm">
                          <Download size={14} />
                          {copy.exportRoadmap}
                        </Button>
                        <Button type="button" onClick={restartQuiz} variant="ghost" size="sm">
                          <RefreshCcw size={14} />
                          {copy.restartQuiz}
                        </Button>
                      </div>
                    )}
                  </footer>
                </div>

                <aside className="hidden border-border p-4 lg:block ltr:border-l rtl:border-r dark:border-zinc-800">
                  <p className="text-label">{copy.signals}</p>
                  <div className="mt-3 space-y-2">
                    {copy.signalItems.map((signal) => (
                      <div key={signal} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-ink-secondary dark:text-zinc-400">{signal}</span>
                        <span className="h-1 w-12 overflow-hidden rounded-full bg-surface-subtle dark:bg-zinc-800">
                          <span className="block h-1 rounded-full bg-accent" style={{ width: `${Math.max(12, progress)}%` }} />
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded border border-border p-3 dark:border-zinc-800">
                    <p className="text-label">{copy.howItWorks}</p>
                    <p className="mt-2 text-xs leading-5 text-ink-secondary dark:text-zinc-400">{copy.howItWorksText}</p>
                  </div>

                  {results[0] && (
                    <div className="mt-3 rounded border border-accent/30 bg-accent-muted/20 p-3 dark:border-accent/20 dark:bg-accent/5">
                      <p className="text-label">{copy.savedResult}</p>
                      <p className="mt-1 text-sm font-medium text-ink dark:text-zinc-100">{results[0].shortName}</p>
                      <p className="text-xs text-ink-secondary dark:text-zinc-400">{results[0].match}% {copy.stored}</p>
                    </div>
                  )}
                </aside>
              </div>
            </MotionSection>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
