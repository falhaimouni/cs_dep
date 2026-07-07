const OPENAI_API_URL = 'https://api.openai.com/v1/responses';

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || 'gpt-5.5';
}

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function extractText(response) {
  if (response.output_text) return response.output_text;

  const textParts = [];
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && content.text) {
        textParts.push(content.text);
      }
      if (content.type === 'text' && content.text) {
        textParts.push(content.text);
      }
    }
  }
  return textParts.join('\n').trim();
}

export async function generateAIText({ instructions, input, maxOutputTokens = 900, textFormat }) {
  if (!isOpenAIConfigured()) return null;

  const text = textFormat ? { format: textFormat } : undefined;
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      instructions,
      input,
      max_output_tokens: maxOutputTokens,
      store: false,
      ...(text ? { text } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${details}`);
  }

  return extractText(await response.json());
}

export async function generateAIJson({ instructions, input, fallback, maxOutputTokens = 1600, schema, name = 'structured_result' }) {
  const text = await generateAIText({
    instructions,
    input,
    maxOutputTokens,
    textFormat: schema
      ? {
          type: 'json_schema',
          name,
          strict: true,
          schema,
        }
      : undefined,
  });
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  }
}
