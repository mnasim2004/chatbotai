# ChatbotAI

A full-stack chatbot builder and embed solution with a modern React frontend (Vite + Tailwind) and a Node/Express + MongoDB backend.

## Monorepo Structure

- `frontend/`: Vite React app (Toast system, Dashboard, Builder, Embed UI)
- `backend/`: Express API (auth, chatbot CRUD, chat via Groq)

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or hosted)

## Quick Start

1) Install dependencies

```bash
# From repo root
cd backend && npm i
cd ../frontend && npm i
```

2) Configure environment

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatbotai
JWT_SECRET=your-strong-secret

# Optional services
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GROQ_API_KEY=xxx
```

Optionally, create `frontend/.env` if your API runs on a different URL/port:

```
VITE_API_URL=http://localhost:5000/api
```

3) Run

```bash
# Backend
cd backend
npx nodemon src/server.js

# Frontend (in a separate terminal)
cd frontend
npm run dev
```

- Backend health: `http://localhost:5000/health`
- Frontend dev: as printed by Vite (e.g., `http://localhost:5173`)

## Embedding a Bot

Use the modal in Dashboard → Bot card → code icon.

Instructions shown (example):

```
// 1. Download the ChatBot component
curl -o botembed.tsx https://raw.githubusercontent.com/mnasim2004/chatbotai/main/components/botembed.tsx

// 2. Import and use in your React app
import ChatBot from "./botembed";

<ChatBot botId="YOUR_BOT_ID" />
```

The modal also lets you copy the code, download instructions, or download the actual `botembed.tsx` component.

## Global Toasts

- Implemented with SweetAlert2 and a `ToastProvider`. Use anywhere:

```js
import { useToast } from './src/components/Toast/ToastProvider.jsx'
const toast = useToast()
toast.success('Saved successfully')
```

## Typing Indicator

The embed chatbot shows a clean three-dot typing animation while waiting for responses.

## Scripts

Common npm scripts are defined in each package. For development, use `nodemon` in backend and `vite` in frontend.

## License

MIT



