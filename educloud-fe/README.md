# EduCloud Frontend

React + Vite frontend for EduCloud learning document storage.

## Setup

```bash
cd educloud-fe
npm install
npm run dev
```

Open http://localhost:5173

## Environment

| Variable | Default |
|----------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1/eduCloud` |
| `VITE_USE_MOCKS` | `true` |

Set `VITE_USE_MOCKS=false` to call real APIs where implemented (auth, users).

## Stack

React 18, Vite, Tailwind CSS 3, Shadcn/ui (JSX), React Router 6, TanStack Query, Zustand, React Hook Form + Zod, Framer Motion, Recharts, Sonner.
