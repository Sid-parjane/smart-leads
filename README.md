# SmartLeads Dashboard

Full-stack Lead Management Dashboard — MERN + TypeScript.

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Zustand, React Router v6, Axios
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT
- **Infra**: Docker, Docker Compose, Nginx

## Features

- JWT auth (register / login / protected routes)
- Role-Based Access Control (Admin / Sales)
- Full CRUD for leads
- Advanced filtering: status, source, search (debounced), sort
- Backend pagination (10/page, skip+limit)
- CSV export (admin only)
- Dark mode
- Responsive UI with loading, empty, and error states

## Quick Start (Local)

```bash
# 1. Clone repo and install deps
cd backend && npm install
cd ../frontend && npm install

# 2. Setup env
cp backend/.env.example backend/.env
# Edit backend/.env with your MONGO_URI and JWT_SECRET

# 3. Run backend
cd backend && npm run dev

# 4. Run frontend (new terminal)
cd frontend && npm run dev
```

## Docker

```bash
cp .env.example .env
# Edit .env: set JWT_SECRET

docker-compose up --build
```

App at http://localhost:5173

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Leads (all protected)
| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | /api/leads | All | List with filters + pagination |
| GET | /api/leads/export | Admin | CSV export |
| GET | /api/leads/:id | All | Single lead |
| POST | /api/leads | All | Create lead |
| PUT | /api/leads/:id | All | Update lead |
| DELETE | /api/leads/:id | Admin | Delete lead |

### Query Params (GET /api/leads)
- `status` — New | Contacted | Qualified | Lost
- `source` — Website | Instagram | Referral
- `search` — name or email substring
- `sort` — latest | oldest
- `page` — page number (default: 1)
- `limit` — per page (default: 10)

## Project Structure

```
smart-leads/
├── backend/
│   └── src/
│       ├── config/       # DB connection
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Auth + error
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routers
│       ├── types/        # TypeScript interfaces
│       └── index.ts      # Entry point
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI + feature components
│       ├── hooks/        # useLeads, useDebounce, useDarkMode
│       ├── pages/        # Login, Register, Dashboard
│       ├── services/     # Axios API layer
│       ├── store/        # Zustand auth store
│       └── types/        # Shared TS types
└── docker-compose.yml
```

## Submission

Send to: ritik.yadav@servicehive.tech  
Subject: `MERN Internship Assignment Submission - Your Name`
