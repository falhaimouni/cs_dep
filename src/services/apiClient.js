const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';
const API_TIMEOUT_MS = 2500;

export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    signal: options.signal ?? controller.signal,
    ...options,
  }).finally(() => globalThis.clearTimeout(timeoutId));

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function apiOrFallback(request, fallback) {
  try {
    return await request();
  } catch {
    return fallback();
  }
}
