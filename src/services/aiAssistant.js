import assistantData from '../data/assistant.json';

export async function getAssistantSetup() {
  return assistantData;
}

export async function sendAssistantMessage(message, language = 'en') {
  const normalized = message.toLowerCase();
  const response = assistantData.responses.find((item) =>
    item.match.some((keyword) => normalized.includes(keyword))
  );
  const copy = response?.answer ?? assistantData.fallback;
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: copy[language?.startsWith('ar') ? 'ar' : 'en'],
    createdAt: new Date().toISOString(),
  };
}
