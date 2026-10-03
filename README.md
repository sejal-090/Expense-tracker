# Ledger — Expense Tracker (MERN)

Production-style personal finance workspace: JWT auth, MongoDB aggregations, and a Stripe/Linear-inspired React dashboard.

## Stack

- **server/** — Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **client/** — React 18, Vite, Tailwind CSS, Recharts, React Router

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## 1. Backend

```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```

On macOS/Linux use `cp .env.example .env`. Edit `MONGO_URI` and `JWT_SECRET` in `server/.env`.

API base: `http://localhost:5000/api`

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | JWT |
| PUT | `/api/auth/me` | JWT |
| PUT | `/api/auth/password` | JWT |
| GET | `/api/transactions` | JWT (query: `page`, `limit`, `search`, `category`, `type`, `from`, `to`) |
| POST | `/api/transactions` | JWT |
| PUT | `/api/transactions/:id` | JWT |
| DELETE | `/api/transactions/:id` | JWT |
| GET | `/api/analytics/summary` | JWT (query: `from`, `to`, `month`, `year`) |
| GET | `/api/budgets` | JWT |
| POST | `/api/budgets` | JWT |
| DELETE | `/api/budgets/:id` | JWT |

## 2. Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

Demo login after `npm run seed` in `server/`: `sejal@ledger.test` / `Password123`.

## Models

- **User:** name, email, password, createdAt
- **Transaction:** userId, title, amount, type (`income` \| `expense`), category, date, notes
- **Budget:** userId, category, monthlyLimit, month, year

## UI

Sidebar: Dashboard, Transactions, Analytics, Budgets, Settings. Top bar: date preset, Add Transaction, profile. Charts: category donut, income vs expense bars, cash-flow area, budget radial gauge.
