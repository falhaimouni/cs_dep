import http from 'node:http';
import https from 'node:https';
import { load } from 'cheerio';

const SOURCE = 'Zarqa University';
const DEFAULT_SOURCE_URL = 'https://www.zu.edu.jo/ar/NewsForm/News.aspx';
const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_DETAIL_LIMIT = 6;
const REQUEST_TIMEOUT_MS = 15000;
const USER_AGENT = 'CS Department Student Platform/1.0 (+https://www.zu.edu.jo)';

let cache = null;
let refreshPromise = null;

function getSourceUrl() {
  return process.env.UNIVERSITY_NEWS_SOURCE_URL || DEFAULT_SOURCE_URL;
}

function getCacheTtlMs() {
  return Number(process.env.UNIVERSITY_NEWS_CACHE_TTL_MS || DEFAULT_CACHE_TTL_MS);
}

function getDetailLimit() {
  return Number(process.env.UNIVERSITY_NEWS_DETAIL_LIMIT || DEFAULT_DETAIL_LIMIT);
}

function isInsecureTlsAllowed() {
  return process.env.UNIVERSITY_NEWS_ALLOW_INSECURE_TLS === 'true';
}

function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeDate(value) {
  const text = cleanText(value);
  const match = text.match(/\d{4}[./-]\d{2}[./-]\d{2}/);
  return match ? match[0].replaceAll('.', '-') : text;
}

function toAbsoluteUrl(value, baseUrl) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return null;
  }
}

async function fetchTextWithNodeRequest(url) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const client = target.protocol === 'http:' ? http : https;
    const request = client.request(
      target,
      {
        headers: { 'User-Agent': USER_AGENT },
        rejectUnauthorized: !isInsecureTlsAllowed(),
        timeout: REQUEST_TIMEOUT_MS,
      },
      (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          response.resume();
          fetchTextWithNodeRequest(new URL(response.headers.location, target).href).then(resolve, reject);
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`University news request failed (${response.statusCode})`));
            return;
          }
          resolve(body);
        });
      }
    );

    request.on('timeout', () => request.destroy(new Error('University news request timed out')));
    request.on('error', reject);
    request.end();
  });
}

async function fetchText(url) {
  if (isInsecureTlsAllowed()) {
    return fetchTextWithNodeRequest(url);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`University news request failed (${response.status})`);
    }
    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function parseNewsListing(html, sourceUrl) {
  const $ = load(html);
  const seen = new Set();
  const items = [];

  $('a[href*="NewsDetails.aspx?id="]').each((_, element) => {
    const link = $(element);
    const table = link.closest('table');
    const url = toAbsoluteUrl(link.attr('href'), sourceUrl);
    const title = cleanText(link.text() || link.attr('title'));
    const date = normalizeDate(table.find('span[id*="lblDate"]').first().text());
    const image = toAbsoluteUrl(
      table.find('img[src*="UploadFile/News"]').first().attr('src') ||
        table.find('a.fancybox[href*="UploadFile/News"]').first().attr('href'),
      sourceUrl
    );

    if (!title || !date || !url || seen.has(url)) return;
    seen.add(url);
    items.push({ title, date, url, image, summary: null });
  });

  return items;
}

function parseSummary(html) {
  const $ = load(html);
  const details = $('span[id*="lblDetails"]').first();
  const firstParagraph = cleanText(details.find('p').first().text());
  if (firstParagraph) return firstParagraph;
  const fullText = cleanText(details.text());
  return fullText || null;
}

function normalizeNewsItem(item) {
  return {
    title: cleanText(item.title),
    date: normalizeDate(item.date),
    url: item.url,
    image: item.image ?? null,
    summary: item.summary ? cleanText(item.summary) : null,
  };
}

async function hydrateSummaries(items) {
  const detailLimit = Math.max(0, getDetailLimit());
  const withSummaries = await Promise.all(
    items.slice(0, detailLimit).map(async (item) => {
      try {
        const detailHtml = await fetchText(item.url);
        return { ...item, summary: parseSummary(detailHtml) };
      } catch {
        return item;
      }
    })
  );

  return [...withSummaries, ...items.slice(detailLimit)];
}

async function refreshUniversityNews() {
  const sourceUrl = getSourceUrl();
  const html = await fetchText(sourceUrl);
  const parsed = parseNewsListing(html, sourceUrl);
  const hydrated = await hydrateSummaries(parsed);
  const news = hydrated.map(normalizeNewsItem).filter((item) => item.title && item.date && item.url);

  if (news.length === 0) {
    throw new Error('No university news items found');
  }

  cache = {
    source: SOURCE,
    lastUpdated: new Date().toISOString(),
    news,
  };

  return cache;
}

async function getFreshOrCachedNews() {
  const now = Date.now();
  const cacheTime = cache?.lastUpdated ? new Date(cache.lastUpdated).getTime() : 0;
  const isFresh = cache && now - cacheTime < getCacheTtlMs();

  if (isFresh) {
    return { ...cache, stale: false, message: null };
  }

  refreshPromise ??= refreshUniversityNews().finally(() => {
    refreshPromise = null;
  });

  const fresh = await refreshPromise;
  return { ...fresh, stale: false, message: null };
}

export async function getUniversityNews() {
  try {
    return await getFreshOrCachedNews();
  } catch {
    if (cache) {
      return {
        ...cache,
        stale: true,
        message: 'Showing cached university news because the official website is currently unavailable.',
      };
    }

    return {
      source: SOURCE,
      lastUpdated: null,
      stale: true,
      message: 'University news is temporarily unavailable. Please try again later.',
      news: [],
    };
  }
}
