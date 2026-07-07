import { Bot, Code2, FolderOpen, GraduationCap, GripHorizontal, MessageSquare, Minimize2, Newspaper, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getAssistantSetup, sendAssistantMessage } from '../services/aiAssistant.js';
import { formatMockTime } from '../utils/localize.js';

const MotionDiv = motion.div;

const copy = {
  en: {
    title: 'Student AI Assistant',
    subtitle: 'Frontend mock assistant',
    welcome: 'How can I help your semester today?',
    placeholder: 'Ask about courses, resources, or announcements...',
    clear: 'Clear conversation',
    minimize: 'Minimize',
    close: 'Close assistant',
    typing: 'Assistant is typing',
    online: 'AI connected',
    local: 'Local assistant',
    tools: 'Student tools',
  },
  ar: {
    title: 'مساعد الطالب الذكي',
    subtitle: 'نموذج واجهة تجريبي',
    welcome: 'كيف أساعدك في هذا الفصل؟',
    placeholder: 'اسأل عن المواد أو الموارد أو الإعلانات...',
    clear: 'مسح المحادثة',
    minimize: 'تصغير',
    close: 'إغلاق المساعد',
    typing: 'المساعد يكتب',
    online: 'متصل بالذكاء الاصطناعي',
    local: 'مساعد محلي',
    tools: 'أدوات الطالب',
  },
};

const toolCards = [
  {
    key: 'advisor',
    icon: GraduationCap,
    to: '/advisor',
    prompt: { en: 'What courses should I register?', ar: 'ما المواد التي أستطيع تسجيلها؟' },
    label: { en: 'Advisor', ar: 'المرشد' },
  },
  {
    key: 'resources',
    icon: FolderOpen,
    to: '/resources',
    prompt: { en: 'I need Operating Systems resources', ar: 'أريد مصادر نظم التشغيل' },
    label: { en: 'Resources', ar: 'الموارد' },
  },
  {
    key: 'reviewer',
    icon: Code2,
    to: '/code-reviewer',
    prompt: { en: 'Review my code', ar: 'راجع الكود الخاص بي' },
    label: { en: 'Code Review', ar: 'مراجعة الكود' },
  },
  {
    key: 'news',
    icon: Newspaper,
    to: '/news',
    prompt: { en: "What are this week's announcements?", ar: 'ما إعلانات هذا الأسبوع؟' },
    label: { en: 'News', ar: 'الأخبار' },
  },
];

export default function StudentAIAssistant() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');
  const text = isArabic ? copy.ar : copy.en;
  const [setup, setSetup] = useState({ suggestions: [], quickActions: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const dragRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    getAssistantSetup().then(setSetup);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const greeting = useMemo(
    () => ({
      id: 'welcome',
      role: 'assistant',
      content: text.welcome,
      createdAt: new Date().toISOString(),
    }),
    [text.welcome]
  );

  const startConversation = (prompt) => {
    setIsOpen(true);
    setIsMinimized(false);
    if (prompt) {
      window.setTimeout(() => submitMessage(prompt), 150);
    }
  };

  async function submitMessage(value = input) {
    const content = value.trim();
    if (!content) return;
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);
    const response = await sendAssistantMessage(content, i18n.language);
    window.setTimeout(() => {
      setMessages((current) => [...current, response]);
      setIsTyping(false);
    }, 550);
  }

  function beginDrag(event) {
    const startX = event.clientX;
    const startY = event.clientY;
    const initial = position;
    const move = (moveEvent) => {
      setPosition({
        x: Math.max(-260, Math.min(24, initial.x + moveEvent.clientX - startX)),
        y: Math.max(-320, Math.min(80, initial.y + moveEvent.clientY - startY)),
      });
    };
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  }

  const conversation = messages.length ? messages : [greeting];

  return (
    <div
      className="fixed bottom-4 end-4 z-[70] sm:bottom-6 sm:end-6"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <MotionDiv
            ref={dragRef}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/90 shadow-2xl shadow-teal-950/15 backdrop-blur-xl dark:border-zinc-700/70 dark:bg-zinc-950/92 dark:shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-border/70 bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-fuchsia-500/10 px-4 py-3 dark:border-zinc-800">
              <button type="button" onPointerDown={beginDrag} className="focus-ring cursor-grab rounded text-ink-tertiary dark:text-zinc-500" aria-label="Drag assistant">
                <GripHorizontal size={18} />
              </button>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white dark:bg-zinc-100 dark:text-zinc-950">
                <Sparkles size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-ink dark:text-zinc-50">{text.title}</h2>
                <p className="truncate text-xs text-ink-secondary dark:text-zinc-400">
                  {setup.aiEnabled ? text.online : text.local}
                </p>
              </div>
              <button type="button" onClick={() => setIsMinimized(true)} className="icon-button" aria-label={text.minimize}>
                <Minimize2 size={15} />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="icon-button" aria-label={text.close}>
                <X size={15} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {conversation.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-ee-md bg-accent text-white'
                      : 'rounded-es-md border border-border bg-surface text-ink dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.actions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {message.actions.map((item) => (
                          item.to ? (
                            <Link
                              key={`${message.id}-${item.label}`}
                              to={item.to}
                              className="rounded-full border border-border bg-surface px-2.5 py-1 text-2xs font-medium text-ink-secondary transition hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <button
                              key={`${message.id}-${item.label}`}
                              type="button"
                              onClick={() => submitMessage(item.prompt)}
                              className="rounded-full border border-border bg-surface px-2.5 py-1 text-2xs font-medium text-ink-secondary transition hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                            >
                              {item.label}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                    <p className={`mt-1 text-[10px] ${message.role === 'user' ? 'text-white/70' : 'text-ink-tertiary dark:text-zinc-500'}`}>
                      {formatMockTime(new Date(message.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-ink-tertiary dark:text-zinc-500">
                  <span className="typing-dot" />
                  <span className="typing-dot animation-delay-150" />
                  <span className="typing-dot animation-delay-300" />
                  {text.typing}
                </div>
              )}
            </div>

            {messages.length === 0 && (
              <div className="border-t border-border/70 px-4 py-3 dark:border-zinc-800">
                <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-ink-tertiary dark:text-zinc-500">{text.tools}</p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {toolCards.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div key={tool.key} className="rounded-xl border border-border bg-surface p-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <Link to={tool.to} className="flex items-center gap-2 text-xs font-medium text-ink dark:text-zinc-100">
                          <Icon size={14} className="text-accent" />
                          {isArabic ? tool.label.ar : tool.label.en}
                        </Link>
                        <button
                          type="button"
                          onClick={() => submitMessage(isArabic ? tool.prompt.ar : tool.prompt.en)}
                          className="mt-1 text-left text-2xs text-ink-tertiary transition hover:text-accent dark:text-zinc-500"
                        >
                          {isArabic ? tool.prompt.ar : tool.prompt.en}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {setup.suggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => submitMessage(suggestion)} className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-ink-secondary transition hover:border-accent hover:text-accent dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border/70 p-3 dark:border-zinc-800">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {setup.quickActions.map((action) => (
                    <button key={action} type="button" onClick={() => submitMessage(action)} className="rounded bg-surface-subtle px-2 py-1 text-2xs font-medium text-ink-secondary dark:bg-zinc-800 dark:text-zinc-300">
                      {action}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setMessages([])} className="icon-button" aria-label={text.clear}>
                  <RotateCcw size={14} />
                </button>
              </div>
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitMessage();
                }}
              >
                <input value={input} onChange={(event) => setInput(event.target.value)} className="input-field" placeholder={text.placeholder} />
                <button type="submit" className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded bg-accent text-white transition hover:bg-accent-hover" aria-label="Send">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => startConversation()}
        className="group ms-auto flex items-center gap-3 rounded-2xl border border-white/30 bg-ink px-4 py-3 text-white shadow-2xl shadow-teal-950/20 transition hover:-translate-y-0.5 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-950"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/12 dark:bg-zinc-950/10">
          <MessageSquare size={17} />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold">{text.title}</span>
          <span className="block text-xs opacity-70">{text.subtitle}</span>
        </span>
        <Bot size={17} className="opacity-70" />
      </button>
    </div>
  );
}
