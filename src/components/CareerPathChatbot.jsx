import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Download, Map, MessageCircle, RefreshCcw, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { analyzeCareerAnswers, getCareerQuestions } from '../data/careerChatbot.js';

const MotionArticle = motion.article;
const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionSpan = motion.span;

const chatbotCopy = {
  en: {
    intro: 'Hi! I will help you discover which tech field might fit your personality and interests 🚀',
    typing: 'Assistant is typing',
    complete: 'Great answers. I analyzed your interests, work style, and curiosity patterns. Here are your strongest career matches.',
    open: 'Open career path chatbot',
    close: 'Close career path chatbot',
    title: 'AI Career Path Assistant',
    subtitle: 'Career counselor for tech beginners',
    launcherTitle: 'Career Chatbot',
    launcherSubtitle: 'Find your tech path',
    progress: 'Progress',
    bestMatch: 'Best Match',
    match: 'Match',
    why: 'Why it matches:',
    whyText: 'Your answers point toward',
    technologies: 'Technologies',
    plan: 'Plan',
    viewRoadmap: 'View Roadmap',
    exploreResources: 'Explore Resources',
    exportRoadmap: 'Export Roadmap',
    restartQuiz: 'Restart Quiz',
    signals: 'Signals',
    signalItems: ['Interests', 'Personality', 'Work style', 'Logic vs creativity', 'Hardware vs software', 'Building vs analyzing'],
    howItWorks: 'How matching works',
    howItWorksText: 'Each answer adds weighted points to realistic tech paths. Strong repeated patterns create stronger matches.',
    savedResult: 'Saved Result',
    stored: 'match stored locally',
    exportTitle: 'IT Zone Career Match',
    difficulty: 'Difficulty',
    learningTime: 'Estimated learning time',
    beginnerRoadmap: 'Beginner roadmap',
    roadmapFor: 'Roadmap for',
    requiredSkills: 'Required skills',
    suggestedNextSteps: 'Suggested next steps',
    nextSteps: ['Build one beginner project', 'Share it on GitHub', 'Ask for feedback', 'Repeat with a slightly harder project'],
  },
  ar: {
    intro: 'أهلا! سأساعدك على اكتشاف المجال التقني الأقرب لشخصيتك واهتماماتك 🚀',
    typing: 'المساعد يكتب',
    complete: 'إجابات رائعة. حللت اهتماماتك وطريقة عملك وفضولك التقني، وهذه أقوى المسارات المناسبة لك.',
    open: 'فتح مساعد اختيار المسار التقني',
    close: 'إغلاق مساعد اختيار المسار التقني',
    title: 'مساعد اختيار المسار بالذكاء الاصطناعي',
    subtitle: 'مرشد مهني للمبتدئين في التقنية',
    launcherTitle: 'شات بوت المسار',
    launcherSubtitle: 'اكتشف مجالك التقني',
    progress: 'التقدم',
    bestMatch: 'أفضل تطابق',
    match: 'تطابق',
    why: 'لماذا يناسبك:',
    whyText: 'إجاباتك تشير إلى',
    technologies: 'التقنيات',
    plan: 'الخطة',
    viewRoadmap: 'عرض المسار',
    exploreResources: 'استكشاف الموارد',
    exportRoadmap: 'تصدير الخطة',
    restartQuiz: 'إعادة الاختبار',
    signals: 'المؤشرات',
    signalItems: ['الاهتمامات', 'الشخصية', 'أسلوب العمل', 'المنطق مقابل الإبداع', 'العتاد مقابل البرمجيات', 'البناء مقابل التحليل'],
    howItWorks: 'كيف يتم التحليل',
    howItWorksText: 'كل إجابة تضيف نقاطا موزونة لمسارات تقنية واقعية. تكرار الأنماط القوية يعطي نتائج أدق.',
    savedResult: 'النتيجة المحفوظة',
    stored: 'تطابق محفوظ محليا',
    exportTitle: 'نتيجة مسارك في IT Zone',
    difficulty: 'مستوى الصعوبة',
    learningTime: 'مدة التعلم المتوقعة',
    beginnerRoadmap: 'خطة البداية',
    roadmapFor: 'خطة مسار',
    requiredSkills: 'المهارات المطلوبة',
    suggestedNextSteps: 'الخطوات المقترحة',
    nextSteps: ['ابنِ مشروعا بسيطا كبداية', 'ارفعه على GitHub', 'اطلب ملاحظات عليه', 'كرر التجربة بمشروع أصعب قليلا'],
  },
};

function TypingDots({ label }) {
  return (
    <div className="flex items-center gap-1 px-1 py-2" aria-label={label}>
      {[0, 1, 2].map((dot) => (
        <MotionSpan
          key={dot}
          className="h-2 w-2 rounded-full bg-brand-400"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, delay: dot * 0.12, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ message, isArabic }) {
  const isUser = message.from === 'user';

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${isArabic ? 'text-right' : 'text-left'} ${
          isUser
            ? 'bg-ink-900 text-white dark:bg-brand-400 dark:text-ink-950'
            : 'border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-100'
        }`}
      >
        {message.text}
      </div>
    </MotionDiv>
  );
}

function RecommendationCard({ result, rank, copy, isArabic }) {
  const accent = rank === 0 ? 'border-brand-300 bg-brand-400/10' : 'border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/[0.06]';

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`rounded-lg border p-4 ${accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            {rank === 0 ? copy.bestMatch : `${copy.match} ${rank + 1}`}
          </p>
          <h3 className="mt-1 text-xl font-black text-ink-950 dark:text-white">{result.name}</h3>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-ink-900 text-sm font-black text-white dark:bg-brand-400 dark:text-ink-950">
          {result.match}%
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.description}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <span className="font-black">{copy.why}</span> {copy.whyText} {result.skills.slice(0, 3).join(isArabic ? '، ' : ', ').toLowerCase()}.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.technologies}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.technologies.map((tech) => (
              <span key={tech} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.plan}</p>
          <p className="mt-2 text-sm font-bold text-ink-900 dark:text-white">{result.difficulty}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{result.learningTime}</p>
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {result.roadmap.map((step, index) => (
          <li key={step} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-400/15 text-xs font-black text-brand-700 dark:text-brand-200">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </MotionArticle>
  );
}

function RoadmapDetail({ result, copy }) {
  if (!result) return null;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-brand-300 bg-white p-4 shadow-glow dark:bg-white/[0.07]"
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{copy.roadmapFor}</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-black text-ink-950 dark:text-white">{result.name}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{result.description}</p>
        </div>
        <div className="rounded-lg bg-ink-900 px-4 py-3 text-center text-white dark:bg-brand-400 dark:text-ink-950">
          <p className="text-2xl font-black">{result.match}%</p>
          <p className="text-xs font-black uppercase tracking-[0.14em]">{copy.match}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-ink-900/60">
          <p className="text-sm font-black text-ink-950 dark:text-white">{copy.beginnerRoadmap}</p>
          <ol className="mt-3 space-y-3">
            {result.roadmap.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-400 text-xs font-black text-ink-950">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-ink-900/60">
            <p className="text-sm font-black text-ink-950 dark:text-white">{copy.requiredSkills}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.skills.map((skill) => (
                <span key={skill} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-ink-900/60">
            <p className="text-sm font-black text-ink-950 dark:text-white">{copy.suggestedNextSteps}</p>
            <ul className="mt-3 space-y-2">
              {copy.nextSteps.map((step) => (
                <li key={step} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-black text-ink-950 dark:text-white">{copy.technologies}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.technologies.map((tech) => (
            <span key={tech} className="rounded-md bg-ink-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-brand-400 dark:text-ink-950">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </MotionArticle>
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
    }, 550);

    return () => window.clearTimeout(timer);
  }, [currentQuestion, isOpen, messages.length]);

  useEffect(() => {
    if (!isComplete || !results[0]) return;
    window.localStorage.setItem(
      'it-zone-career-result',
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
    }, 720);
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
      <MotionButton
        type="button"
        onClick={() => setIsOpen(true)}
        className={`focus-ring fixed bottom-5 z-40 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-lg border border-brand-300 bg-white/95 px-3 py-3 text-ink-950 shadow-glow backdrop-blur-xl transition hover:-translate-y-1 hover:border-purple-300 hover:bg-purple-50 dark:border-brand-400/40 dark:bg-ink-900/95 dark:text-white dark:hover:bg-ink-800 ${isArabic ? 'left-5' : 'right-5'}`}
        aria-label={copy.open}
        whileTap={{ scale: 0.96 }}
      >
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ink-900 text-brand-300 dark:bg-brand-400 dark:text-ink-950">
          <MotionSpan
            className="absolute inset-0 rounded-lg border border-brand-300"
            animate={{ opacity: [0.75, 0], scale: [1, 1.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-400 dark:border-ink-900" />
          <span className="absolute inset-0 rounded-lg bg-brand-400/25" />
          <MessageCircle className="relative" size={24} />
        </span>
        <span className={`min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
          <span className="flex items-center gap-1.5 text-sm font-black">
            <Sparkles size={15} className="text-purple-500" />
            <span>{copy.launcherTitle}</span>
          </span>
          <span className="mt-0.5 block truncate text-xs font-bold text-slate-500 dark:text-slate-300">{copy.launcherSubtitle}</span>
        </span>
      </MotionButton>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionSection
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 230 }}
              className={`flex h-[min(760px,92vh)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-white/20 bg-slate-50 shadow-2xl dark:bg-ink-950 ${isArabic ? 'text-right' : 'text-left'}`}
              dir={isArabic ? 'rtl' : 'ltr'}
              role="dialog"
              aria-modal="true"
              aria-label={copy.open}
            >
              <header className="border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink-900 text-brand-300 dark:bg-brand-400 dark:text-ink-950">
                      <Bot size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-lg font-black text-ink-950 dark:text-white">{copy.title}</h2>
                        <Sparkles className="hidden text-brand-500 sm:block" size={16} />
                      </div>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                    aria-label={copy.close}
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <span>{copy.progress}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <MotionDiv className="h-full rounded-full bg-brand-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
                  </div>
                </div>
              </header>

              <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_380px]">
                <div className="flex min-h-0 flex-col">
                  <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
                    {messages.map((message, index) => (
                      <ChatBubble key={`${message.from}-${message.text}-${index}`} message={message} isArabic={isArabic} />
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="rounded-lg border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.08]">
                          <TypingDots label={copy.typing} />
                        </div>
                      </div>
                    )}

                    {isComplete && (
                      <div className="space-y-4 pt-2">
                        {results.map((result, index) => (
                          <RecommendationCard key={result.key} result={result} rank={index} copy={copy} isArabic={isArabic} />
                        ))}
                        <RoadmapDetail result={selectedRoadmap} copy={copy} />
                      </div>
                    )}
                  </div>

                  <footer className="border-t border-slate-200 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    {!isComplete ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {currentQuestion?.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            disabled={isTyping}
                            onClick={() => answerQuestion(option)}
                            className={`focus-ring flex min-h-12 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink-900 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1] ${isArabic ? 'text-right' : 'text-left'}`}
                          >
                            <span>{option.label}</span>
                            <Send size={16} className="shrink-0 text-brand-500" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={showRoadmap}
                          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-black text-white transition hover:bg-brand-600 dark:bg-brand-400 dark:text-ink-950"
                        >
                          <Map size={17} />
                          {copy.viewRoadmap}
                        </button>
                        <Link
                          to="/resources"
                          onClick={() => setIsOpen(false)}
                          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-ink-900 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                          <Sparkles size={17} />
                          {copy.exploreResources}
                        </Link>
                        <button
                          type="button"
                          onClick={exportRoadmap}
                          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-ink-900 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                          <Download size={17} />
                          {copy.exportRoadmap}
                        </button>
                        <button
                          type="button"
                          onClick={restartQuiz}
                          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-ink-900 transition hover:border-coral-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        >
                          <RefreshCcw size={17} />
                          {copy.restartQuiz}
                        </button>
                      </div>
                    )}
                  </footer>
                </div>

                <aside className="hidden border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.035] lg:block ltr:border-l rtl:border-r">
                  <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.06]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{copy.signals}</p>
                    <div className="mt-4 space-y-3">
                      {copy.signalItems.map((signal) => (
                        <div key={signal} className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{signal}</span>
                          <span className="h-2 w-16 rounded-full bg-slate-200 dark:bg-white/10">
                            <span className="block h-2 rounded-full bg-brand-400" style={{ width: `${Math.max(18, progress)}%` }} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.06]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{copy.howItWorks}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.howItWorksText}</p>
                  </div>

                  {results[0] && (
                    <div className="mt-4 rounded-lg border border-brand-300 bg-brand-400/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{copy.savedResult}</p>
                      <p className="mt-2 text-lg font-black text-ink-950 dark:text-white">{results[0].shortName}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{results[0].match}% {copy.stored}</p>
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
