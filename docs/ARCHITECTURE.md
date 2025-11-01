# ChatbotAI – Technical Overview

This document describes the repository structure, runtime architecture, AI prompt strategy, and how key features work end-to-end.

## Repository Structure

- `frontend/` – Vite React app
  - `src/components/` – Reusable components (Dashboard, Builder, Embed, Toast, Modal)
  - `src/pages/` – Page-level components (Home, AuthSlider, etc.)
  - `src/context/` – App context (`AuthContext`)
  - `src/utils/` – API client, alert helper
  - `public/` – Static assets
- `backend/` – Node + Express API
  - `src/config/` – Config for database and Cloudinary
  - `src/controllers/` – Route handlers (auth, chatbots, chat)
  - `src/middleware/` – Auth middleware
  - `src/models/` – Mongoose models (User, Chatbot)
  - `src/routes/` – Express route definitions
  - `src/server.js` – App bootstrap
- `docs/` – Project documentation
  - `ARCHITECTURE.md` – This file
- `.gitignore` – Repo-wide ignores
- `README.md` – Quick start & usage notes

## Environment Variables

Backend (`backend/.env`):
- `PORT` – HTTP port (default 5000)
- `MONGODB_URI` – Mongo connection string
- `JWT_SECRET` – Token signing secret
- Optional:
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `GROQ_API_KEY` – For chat completions

Frontend (`frontend/.env` optional):
- `VITE_API_URL` – e.g. `http://localhost:5000/api`

## Backend Architecture

### Server & Middlewares
- `src/server.js`
  - Loads env, connects Mongo (`connectDB`)
  - Middlewares: `cors`, `express.json`, `urlencoded`
  - Routes mounted at `/api/auth`, `/api/chatbots`, `/api/chat`
  - Health check: `/health`

### Data Models
- `User` (`src/models/User.js`)
  - Fields: `email`, `password` (hashed via `bcryptjs` in schema), `name`
  - Instance method: `comparePassword`
- `Chatbot` (`src/models/Chatbot.js`)
  - Fields: name, description, behavior, knowledge, details, avatarUrl, placeholder, headerColor/Size, chatbotSize, chat colors, flags (audioInput, desktop, mobile, autoOpen), icon config, arrays (`images`, `links`, `faqs`), and `contact` (email/phone/website/socials)

### Routes & Controllers
- `auth` (`/api/auth`) – `authController.js`
  - `POST /signup`: create user and return JWT
  - `POST /login`: verify user, return JWT
- `chatbots` (`/api/chatbots`) – `chatbotController.js`
  - CRUD: create, get all, get by id, update, delete
  - Supports image uploads (Cloudinary if configured)
- `chat` (`/api/chat`) – `chatController.js`
  - `POST /chat`: send conversation + message → returns structured response

### AI Prompting & Response Shaping
- Provider: Groq SDK (`groq-sdk`) using `GROQ_API_KEY`
- Model: `llama-3.3-70b-versatile`
- System prompt content (summarized):
  - Identity: `You are ${chatbot.name}`; includes trimmed description, behavior, knowledge, details
  - Includes limited images/links/contacts as contextual info
  - Output schema (JSON only):
    - `{ "text": string, "images": [{ url, alt }], "links": [{ url, label }], "contacts": { ... }, "suggestions": string[] }`
  - Rules: include only relevant info; suggestions are concise; JSON only
- Response flow:
  1. Build messages = [system, recent history, user message]
  2. Call `groq.chat.completions.create`
  3. Try parse JSON; if fails, wrap as a fallback structured object
  4. Suggestions: use model-provided or generate a second lightweight completion to produce 3 short follow-ups

## Frontend Architecture

### Routing & Auth
- `main.jsx` sets up Router and wraps app with `AuthProvider` and `ToastProvider`.
- `AuthContext.jsx` manages auth token/user in `localStorage`.
  - `login(user, token)` stores and updates state
  - `logout()` clears storage, sets a session `toast` message, and redirects to `/`
- `ProtectedRoute.jsx` gates access to protected pages

### Global Toasts
- Implemented via `ToastProvider.jsx` + SweetAlert2 (`Swal.fire` toast)
- API:
  - `const toast = useToast()`
  - `toast.success | error | info | warning(message, opts)`
- Reads `sessionStorage.toast` on mount to show logout info toasts after redirects

### Modal
- `components/Modal.jsx`: Accessible modal with backdrop, ESC to close, focusable
- Supports: `size`, `hideHeader`, `containerClassName`
- Z-index set above header and toasts (`z-[2000]`)

### Dashboard
- `components/Dashboard/Dashboard.jsx`
  - Analytics cards (mock data)
  - Chatbot grid – each card shows avatar in a circular frame and actions
    - Edit, View Embed, Delete, Get Embed Code (opens modal)
  - Empty state – polished card with mini action tiles (Create, Embed Guide)
- Embed Modal:
  - Shows instructions matching the Create page (curl + import + component usage)
  - Actions: Copy Code, Download Component (`botembed.tsx` from GitHub), Download Instructions

### Builder (MVP)
- `components/ChatbotBuilder/ChatbotBuilder.jsx`
  - Large form to configure a bot’s identity, colors, UI sizing, data (images, links, FAQs, contact)
  - Save creates/updates a bot via API
  - Uses global toasts for success/error
  - Shows an embed instructions modal after creation (option)

### Embed Chatbot
- `components/embed/ChatBot.tsx`
  - Fetches bot config by id
  - Renders chat UI with bot/user bubbles themed by config colors
  - Typing indicator: 3 blinking dots (no surrounding bubble)
  - Suggestions: buttons under bot messages
  - Message sending: builds `history` and posts to `/api/chat`

### Auth Pages
- `pages/AuthSlider.jsx` with `auth-slider.css`
  - Animated sliding panel UX between login and signup
  - CSS optimized to smooth translate3d transitions (0.8s)
  - Uses global toasts for success/error

## Data Flow: Sending a Message
1. User types a message in `ChatBot.tsx` → `sendMessage()`
2. UI appends user bubble, sets `loading=true` → shows typing indicator
3. Frontend posts `{ botId, message, history }` to `/api/chat`
4. Backend loads bot config, builds system prompt and `messages`
5. Groq returns completion; backend parses to structured JSON
6. Backend returns `{ response, suggestions }`
7. Frontend renders structured content (text, images, links), suggestion chips, and clears typing indicator

## Styling & Design System
- Tailwind utility classes across the UI (buttons, cards, headers)
- Custom CSS modules:
  - `auth-slider.css` – slider layout & animations
  - `builder-slider.css` – builder page styles
- Icons: `lucide-react`

## Error Handling & Notifications
- Frontend toasts surfaced for auth failures, CRUD errors, copies/downloads, etc.
- Backend responds with `{ error, details? }` on failures; clients display errors via toasts

## Security Notes
- JWT stored in `localStorage` and attached via Axios interceptor (`Authorization: Bearer ...`)
- Use strong `JWT_SECRET`
- Validate/limit uploads (Cloudinary optional)
- Sanitize/limit prompt context size; repository includes truncation for large texts and lists

## Extensibility
- Swap model/provider in `chatController.js`
- Extend structured JSON schema to add buttons/forms/CTA payloads
- Add analytics endpoints to back UI cards
- Move embed delivery to npm package or your CDN

## Known Limitations (MVP)
- Analytics are mocked on Dashboard
- No rate-limiting on chat endpoint
- Upload handling simplified; production apps should enforce size/type constraints and signed uploads

## Useful Commands

Backend:
```
npm run dev   # nodemon
npm start     # node src/server.js
```

Frontend:
```
npm run dev   # Vite dev server
npm run build # Production build
```
