# CS Student Community

A bilingual Arabic/English platform for a Computer Science student department/community with a React frontend and a lightweight local API backend.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- i18next
- Framer Motion
- Node HTTP API
- Netlify-ready static deployment

## Scripts

```bash
npm install
npm run dev
npm run api
npm run build
```

Run the frontend and backend in separate terminals during development:

```bash
npm run dev
npm run api:dev
```

Frontend URL:

```bash
http://localhost:5173
```

Backend API URL:

```bash
http://localhost:4000/api
```

The React service layer calls the backend first and falls back to local JSON if the API is unavailable. Set `VITE_API_URL` to point the frontend at another backend later.

## AI Integration

The chatbot and code reviewer can call OpenAI from the backend. Set an API key before starting the API:

```bash
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_MODEL="gpt-5.5"
npm run api
```

Or create a local `.env` file using `.env.example` as a template.

If `OPENAI_API_KEY` is not set, the backend automatically falls back to the local mock assistant and static code reviewer. The key is only read by the backend and is never exposed to React.

## API Endpoints

- `GET /api/health`
- `GET /api/majors`
- `POST /api/advisor/recommend`
- `GET /api/resources`
- `GET /api/resources/:id`
- `GET /api/announcements`
- `GET /api/university-info`
- `POST /api/study-planner`
- `GET /api/projects/options`
- `POST /api/projects/generate`
- `POST /api/code-review`
- `GET /api/assistant/setup`
- `GET /api/assistant/tools`
- `POST /api/assistant/message`

## Deployment

The app is ready for Netlify. Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Routing fallback is configured in `netlify.toml`.
