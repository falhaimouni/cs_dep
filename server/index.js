import http from 'node:http';
import { URL } from 'node:url';
import { loadEnvFile } from './env.js';
import { getOpenAIModel, isOpenAIConfigured } from './ai/openaiClient.js';
import { getAnnouncements } from './tools/announcements.js';
import { getAssistantSetup, sendAssistantMessage } from './tools/assistant.js';
import { assistantTools } from './tools/registry.js';
import { reviewCode } from './tools/codeReview.js';
import { getMajors, recommendCourses } from './tools/courseAdvisor.js';
import { getResourceById, getResources } from './tools/resources.js';
import { getUniversityInfo } from './tools/universityInfo.js';
import { getUniversityNews } from './tools/universityNews.js';

loadEnvFile();

const port = Number(process.env.API_PORT || process.env.PORT || 4000);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;

  try {
    if (request.method === 'GET' && path === '/api/health') {
      sendJson(response, 200, {
        ok: true,
        name: 'cs-department-api',
        aiEnabled: isOpenAIConfigured(),
        model: getOpenAIModel(),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === 'GET' && path === '/api/majors') {
      sendJson(response, 200, await getMajors());
      return;
    }

    if (request.method === 'POST' && path === '/api/advisor/recommend') {
      sendJson(response, 200, await recommendCourses(await readBody(request)));
      return;
    }

    if (request.method === 'GET' && path === '/api/resources') {
      sendJson(response, 200, await getResources());
      return;
    }

    if (request.method === 'GET' && path.startsWith('/api/resources/')) {
      const id = decodeURIComponent(path.split('/').pop());
      const resource = await getResourceById(id);
      sendJson(response, resource ? 200 : 404, resource ?? { error: 'Resource not found' });
      return;
    }

    if (request.method === 'GET' && path === '/api/announcements') {
      sendJson(response, 200, await getAnnouncements());
      return;
    }

    if (request.method === 'GET' && path === '/api/university-info') {
      sendJson(response, 200, await getUniversityInfo());
      return;
    }

    if (request.method === 'GET' && path === '/api/news/university') {
      sendJson(response, 200, await getUniversityNews());
      return;
    }

    if (request.method === 'POST' && path === '/api/code-review') {
      sendJson(response, 200, await reviewCode(await readBody(request)));
      return;
    }

    if (request.method === 'GET' && path === '/api/assistant/setup') {
      sendJson(response, 200, await getAssistantSetup());
      return;
    }

    if (request.method === 'GET' && path === '/api/assistant/tools') {
      sendJson(response, 200, assistantTools);
      return;
    }

    if (request.method === 'POST' && path === '/api/assistant/message') {
      sendJson(response, 200, await sendAssistantMessage(await readBody(request)));
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(response, 500, {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`CS Department API running at http://localhost:${port}/api`);
});
