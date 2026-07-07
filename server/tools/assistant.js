import { readJsonData } from '../dataStore.js';
import { generateAIText, isOpenAIConfigured } from '../ai/openaiClient.js';
import { recommendCourses } from './courseAdvisor.js';

export async function getAssistantSetup() {
  const setup = await readJsonData('assistant.json');
  return { ...setup, aiEnabled: isOpenAIConfigured() };
}

async function getAssistantContext() {
  const [majors, resources, announcements, universityInfo] = await Promise.all([
    readJsonData('majors.json'),
    readJsonData('resources.json'),
    readJsonData('announcements.json'),
    readJsonData('universityInfo.json'),
  ]);

  return {
    majors: majors.majors.map((major) => ({
      id: major.id,
      name: major.name,
      totalCredits: major.totalCredits,
      planNumber: major.planNumber,
      sections: major.semesters.map((section) => ({
        id: section.id,
        label: section.label,
        requiredCredits: section.requiredCredits,
        courses: section.courses.map((course) => ({
          code: course.code,
          name: course.name,
          credits: course.credits,
          prerequisites: course.prerequisites,
        })),
      })),
    })),
    resources: resources.courses.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      links: {
        drive: course.resources.drive,
        notion: course.resources.notion,
        youtube: course.resources.youtube,
      },
      pdfs: course.resources.pdfs,
      practice: course.resources.practice,
    })),
    announcements: announcements.items,
    universityInfo,
  };
}

function isArabicLanguage(language) {
  return language?.startsWith('ar');
}

function action(label, to, prompt) {
  return { label, to, prompt };
}

function getIntentActions(normalized, language) {
  const isArabic = isArabicLanguage(language);
  if (/(course|register|advisor|تسجيل|مواد|مرشد)/i.test(normalized)) {
    return [
      action(isArabic ? 'افتح المرشد الأكاديمي' : 'Open Academic Advisor', '/advisor'),
      action(isArabic ? 'عرض خطة المواد' : 'View Course Plan', '/courses'),
    ];
  }
  if (/(resource|pdf|drive|notion|youtube|مصادر|موارد|ملفات)/i.test(normalized)) {
    return [action(isArabic ? 'افتح الموارد' : 'Open Resources', '/resources')];
  }
  if (/(code|review|bug|كود|مراجعة)/i.test(normalized)) {
    return [action(isArabic ? 'افتح مراجع الكود' : 'Open Code Reviewer', '/code-reviewer')];
  }
  if (/(announcement|news|week|أخبار|إعلانات)/i.test(normalized)) {
    return [action(isArabic ? 'افتح أخبار القسم' : 'Open Department News', '/news')];
  }
  return [
    action(isArabic ? 'اسأل عن تسجيل المواد' : 'Ask about registration', null, isArabic ? 'ما المواد التي أستطيع تسجيلها؟' : 'What courses should I register?'),
    action(isArabic ? 'اطلب مصادر' : 'Find resources', null, isArabic ? 'أريد مصادر نظم التشغيل' : 'I need Operating Systems resources'),
  ];
}

async function buildResourceAnswer(normalized, language) {
  if (!/(resource|resources|pdf|drive|notion|youtube|مصادر|موارد|ملفات)/i.test(normalized)) return null;

  const resources = await readJsonData('resources.json');
  const isArabic = isArabicLanguage(language);
  const course = resources.courses.find((item) => {
    const content = `${item.id} ${item.code} ${item.title.en} ${item.title.ar} ${item.description.en} ${item.description.ar}`.toLowerCase();
    return normalized.split(/\s+/).some((word) => word.length > 3 && content.includes(word));
  }) ?? resources.courses[0];

  const title = isArabic ? course.title.ar : course.title.en;
  const pdfs = course.resources.pdfs.slice(0, 2).join(', ');
  const practice = course.resources.practice.slice(0, 2).join(', ');
  return {
    content: isArabic
      ? `وجدت لك موارد ${title}: ملفات PDF مثل ${pdfs}، شرائح، تمارين مثل ${practice}، وروابط Drive وNotion وYouTube. افتح صفحة التفاصيل لرؤية كل الموارد.`
      : `I found ${title} resources: PDFs like ${pdfs}, slides, practice such as ${practice}, plus Drive, Notion, and YouTube links. Open the detail page to see everything.`,
    actions: [action(isArabic ? 'فتح تفاصيل المادة' : 'Open course resources', `/resources/${course.id}`)],
  };
}

async function buildNewsAnswer(normalized, language) {
  if (!/(announcement|announcements|news|week|أخبار|إعلانات|هذا الأسبوع)/i.test(normalized)) return null;

  const announcements = await readJsonData('announcements.json');
  const isArabic = isArabicLanguage(language);
  const topItems = announcements.items.slice(0, 3);
  return {
    content: topItems
      .map((item) => {
        const title = isArabic ? item.title.ar : item.title.en;
        const summary = isArabic ? item.summary.ar : item.summary.en;
        return `• ${title}: ${summary}`;
      })
      .join('\n'),
    actions: [action(isArabic ? 'فتح أخبار القسم' : 'Open Department News', '/news')],
  };
}

function extractCourseCodes(message) {
  return [...new Set(String(message ?? '').match(/\b\d{7}\b/g) ?? [])];
}

function extractCreditHours(message) {
  const match = String(message ?? '').match(/(\d{1,3})\s*(credit|credits|hour|hours|ساعة|ساعات)/i);
  return match ? Number(match[1]) : 0;
}

async function buildCourseAdvisorAnswer(message, normalized, language) {
  if (!/(course|courses|register|advisor|مواد|تسجيل|مرشد|اسجل|أسجل)/i.test(normalized)) return null;

  const isArabic = isArabicLanguage(language);
  const completedCourses = extractCourseCodes(message);
  const completedCreditHours = extractCreditHours(message);

  if (completedCourses.length === 0) {
    return {
      content: isArabic
        ? 'حتى أعطيك توصية دقيقة، أرسل لي الساعات المكتملة ورموز المواد التي أنهيتها. مثال: أنهيت 30 ساعة والمواد 0300153 1501110 1501111.'
        : 'To give an accurate recommendation, send your completed credit hours and completed course codes. Example: I completed 30 credits and courses 0300153 1501110 1501111.',
      actions: [
        action(isArabic ? 'افتح المرشد الأكاديمي' : 'Open Academic Advisor', '/advisor'),
        action(isArabic ? 'عرض خطة 132 ساعة' : 'View 132-hour plan', '/courses'),
      ],
    };
  }

  const result = await recommendCourses({
    majorId: 'cs',
    completedCreditHours,
    completedCourses,
    failedCourses: [],
  });

  const recommended = result.recommendations.slice(0, 6).map((course) => {
    const name = isArabic ? course.name.ar : course.name.en;
    const reason = isArabic ? course.reason.ar : course.reason.en;
    return `• ${course.code} - ${name} (${course.credits}): ${reason}`;
  });
  const blocked = result.blocked.slice(0, 4).map((course) => {
    const name = isArabic ? course.name.ar : course.name.en;
    const missing = course.missingPrerequisites.map((item) => item.code).join(', ');
    return `• ${course.code} - ${name}: ${isArabic ? 'ينقصك' : 'missing'} ${missing}`;
  });

  return {
    content: isArabic
      ? `بناء على المواد المكتملة التي أرسلتها، الهدف المناسب هو ${result.targetCredits} ساعة.\n\nالمواد المقترحة:\n${recommended.join('\n')}\n\nمواد غير متاحة بعد:\n${blocked.join('\n')}`
      : `Based on the completed courses you sent, a balanced target is ${result.targetCredits} credits.\n\nRecommended courses:\n${recommended.join('\n')}\n\nNot available yet:\n${blocked.join('\n')}`,
    actions: [
      action(isArabic ? 'افتح المرشد الأكاديمي' : 'Open Academic Advisor', '/advisor'),
      action(isArabic ? 'عرض خطة المواد' : 'View Course Plan', '/courses'),
    ],
  };
}

async function localAssistantResponse(message, language, assistantData) {
  const normalized = String(message ?? '').toLowerCase();
  const advisorAnswer = await buildCourseAdvisorAnswer(message, normalized, language);
  const resourceAnswer = await buildResourceAnswer(normalized, language);
  const newsAnswer = await buildNewsAnswer(normalized, language);
  const richAnswer = advisorAnswer ?? resourceAnswer ?? newsAnswer;

  if (richAnswer) {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: richAnswer.content,
      actions: richAnswer.actions,
      createdAt: new Date().toISOString(),
      provider: 'local-tool',
    };
  }

  const response = assistantData.responses.find((item) =>
    item.match.some((keyword) => normalized.includes(keyword))
  );
  const copy = response?.answer ?? assistantData.fallback;
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: copy[language?.startsWith('ar') ? 'ar' : 'en'],
    actions: getIntentActions(normalized, language),
    createdAt: new Date().toISOString(),
    provider: 'local-tool',
  };
}

export async function sendAssistantMessage({ message, language = 'en' }) {
  const assistantData = await readJsonData('assistant.json');
  const toolAnswer = await localAssistantResponse(message, language, assistantData);
  const shouldPreferTool = toolAnswer.provider === 'local-tool' && (
    toolAnswer.actions?.some((item) => item.to) ||
    /recommended courses|المواد المقترحة|resources|موارد|announcements|إعلانات/i.test(toolAnswer.content)
  );

  if (shouldPreferTool) {
    return toolAnswer;
  }

  if (isOpenAIConfigured()) {
    try {
      const context = await getAssistantContext();
      const content = await generateAIText({
        instructions: [
          'You are the CS Department AI Assistant for Zarqa University students.',
          'Answer as a helpful academic assistant, not as a generic chatbot.',
          'Use only the provided JSON context for course plans, prerequisites, resources, announcements, and university information.',
          'If the student asks what courses to register, ask for major, completed credit hours, completed courses, failed courses, and optional GPA if missing.',
          'For course recommendations, explain prerequisites and missing prerequisites clearly.',
          'Keep answers concise, practical, and student-friendly.',
          'Respond in Arabic when language starts with ar, otherwise respond in English.',
        ].join('\n'),
        input: JSON.stringify({ language, studentMessage: message, context }),
        maxOutputTokens: 1000,
      });

      if (content) {
        return {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          actions: getIntentActions(String(message ?? '').toLowerCase(), language),
          createdAt: new Date().toISOString(),
          provider: 'openai',
        };
      }
    } catch (error) {
      console.warn(error instanceof Error ? error.message : error);
    }
  }

  return toolAnswer;
}
