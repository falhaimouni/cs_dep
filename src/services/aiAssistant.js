import assistantData from '../data/assistant.json';
import { apiOrFallback, apiRequest } from './apiClient.js';

export async function getAssistantSetup() {
  return apiOrFallback(
    () => apiRequest('/assistant/setup'),
    () => assistantData
  );
}

export async function sendAssistantMessage(message, language = 'en') {
  return apiOrFallback(
    () => apiRequest('/assistant/message', {
      method: 'POST',
      body: JSON.stringify({ message, language }),
    }),
    () => sendAssistantMessageLocal(message, language)
  );
}

function sendAssistantMessageLocal(message, language = 'en') {
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
