## Book Hub — Setup Guide

Next.js + NestJS app for sharing/exchanging books.

### Tech
- Frontend: Next.js (App Router), TS, MUI, Redux Toolkit
- Backend: NestJS, Prisma, PostgreSQL, JWT, Nodemailer, Cloudinary

---

## 1) Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally

---

## 2) Environment
Copy example envs and edit values:

```
backend/.env.example -> backend/.env
frontend/env.example -> frontend/.env.local
```

Important:
- Backend DB: `DATABASE_URL`
- JWT: `JWT_SECRET`
- Emails: set SMTP_* for real emails or `MAIL_TEST_ETHEREAL=true` for preview links
- Cloudinary: `CLOUDINARY_*` for image uploads

---

## 3) Install deps
```
cd backend && npm i
cd ../frontend && npm i
```

---

## 4) Database (backend)
```
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## 5) Run
Backend (NestJS, http://localhost:3000):
```
cd backend
npm run start:dev
```

Frontend (Next.js):
```
cd frontend
npm run dev
# if port clash with backend, run: npm run dev -- -p 3001
```

Open the app at the printed frontend URL.

---

## 6) Email sending
- Real SMTP: set SMTP_HOST/PORT/USER/PASS and `MAIL_DRY_RUN=false`
- Ethereal test mode: `MAIL_TEST_ETHEREAL=true` (console shows preview URL)
- Dry run (no SMTP): `MAIL_DRY_RUN=true` logs email payloads

---

## 7) Useful scripts
Backend:
- `npm run start:dev` — start Nest in watch mode
- `npm run prisma:studio` — Prisma Studio

Frontend:
- `npm run dev` — start Next.js dev server

---

## 8) Default URLs
- API: http://localhost:3000
- Web: http://localhost:3000 (or http://localhost:3001 if you changed the port)
