# Tasks — Laravel API + Next.js

A small task tracker with full CRUD: create, list (with a status filter), edit and delete tasks.
Built for the Caravea Full-Stack Developer assessment. Started 8 Oct 2026, 20:38 PHT.

- `api/` Laravel 13 JSON API, SQLite
- `web/` Next.js 16 (App Router, TypeScript, Tailwind)

## Run it

Needs PHP 8.3+, Composer and Node 20+.

```bash
# 1. API on http://127.0.0.1:8000
cd api
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve

# 2. Web app on http://localhost:3000 (second terminal)
cd web
npm install
npm run dev
```

If the API runs somewhere else, set `API_URL` (default `http://127.0.0.1:8000/api`).

## Tests

```bash
cd api && php artisan test                     # 7 feature tests, in-memory SQLite
cd web && npx playwright install chromium      # once
cd web && BASE=http://localhost:3000 npm run test:e2e   # real browser: create, validate, edit, filter, delete
```

## The API

| Method | Path | Does |
|---|---|---|
| GET | `/api/tasks?status=todo` | list, newest first, optional status filter |
| POST | `/api/tasks` | create (201) |
| GET | `/api/tasks/{id}` | one task (404 if missing) |
| PATCH/PUT | `/api/tasks/{id}` | update only the fields sent |
| DELETE | `/api/tasks/{id}` | delete (204) |

A task has `title` (required), `notes`, `due_date` (`Y-m-d`), `status` (`todo` / `doing` / `done`) and `priority` (`low` / `medium` / `high`). Bad input returns 422 with an error per field.

## Why it's built this way

- **Laravel is a plain JSON API**, so the Next.js app is just one client of it. Each piece has one job:
  - `TaskRequest` validates.
  - `TaskResource` decides the JSON shape, so the table can change without breaking the frontend.
  - The controller stays a few lines per action.
- **Validation lives in one place: Laravel.** The Next.js form does no validation of its own. It sends the data, and if Laravel answers 422, the error is shown under the right field and what you typed is kept.
- **Next.js calls the API from the server** (Server Components to read, Server Actions to write):
  - The browser never talks to Laravel directly, so there's no CORS setup.
  - The API address is never exposed to the browser.
  - The forms work before JavaScript loads.
- **Pages stream with `<Suspense>`.** Next 16 turns on Cache Components by default. Task data must always be fresh, so it isn't cached; it streams in under a loading state instead.
- **SQLite**, so you can run it with zero database setup. The migration is standard Laravel and works the same on MySQL or PostgreSQL by changing `DB_CONNECTION`.
- **Updates are partial (PATCH).** On update the title is `sometimes` instead of `required`, so you can change only the status without resending the whole task.
- **Left out on purpose:**
  - No auth: the brief didn't ask for it.
  - No pagination: marked in the controller as the next step once a list outgrows one screen.

## AI

How I used AI, what it got wrong and my setup are in [docs/AI.md](docs/AI.md).
