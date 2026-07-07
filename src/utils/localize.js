export function localize(value, language = 'en') {
  if (!value || typeof value !== 'object') return value;
  return value[language?.startsWith('ar') ? 'ar' : 'en'] ?? value.en ?? '';
}

export function formatMockTime(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
