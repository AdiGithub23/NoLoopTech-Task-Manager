# NoLoopTech-Task-Manager

## Overview

A small Task Manager with a NestJS REST API and a Next.js web interface.

- **Backend (`/api`):** NestJS, Prisma 7, SQLite, class-validator
- **Frontend (`/web`):** Next.js (App Router), shadcn/ui, Tailwind CSS, react-hook-form, zod

## Features

- Create, view, edit and delete tasks (title, description, status, due date)
- Tasks shown in a table with a status badge
- Create/edit form in a dialog, with validation
- Confirmation before deleting
- Loading, error (with Retry) and empty states, plus toast messages on success
- Filter by status, sort by due date, Docker Compose setup

## Prerequisites

- Node.js (v22+) and npm
- Git
- Docker Desktop (optional)

## Run locally

Use two separate terminals.
Terminal 1: Start the API first.
Terminal 2: Then the web app.

### 1. Clone

```bash
git clone https://github.com/AdiGithub23/NoLoopTech-Task-Manager.git
cd NoLoopTech-Task-Manager
```

### 2. API (http://localhost:3001)

Run in the `api` folder:

```bash
cd api
copy .env.example .env
npm install
npx prisma migrate deploy
npm run start:dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

`npx prisma migrate deploy` creates the SQLite database file (`api/dev.db`) from the committed migration.

Environment variables (`api/.env`):

| Variable | Value | Purpose |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | SQLite database location |
| `PORT` | `3001` | Port the API listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Web app origin allowed to call the API |

### 3. Web app (http://localhost:3000)

In a second terminal, run in the `web` folder:

```bash
cd web
copy .env.example .env.local
npm install
npm run dev
```

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

Environment variables (`web/.env.local`):

| Variable | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Base URL of the API |

Open http://localhost:3000.

## Run with Docker Compose

Required:
- Running Docker Desktop
- Free Ports 3000 and 3001

Run in the repository root:
```bash
docker compose up --build
```

Open http://localhost:3000.

To stop:
```bash
docker compose down
```

To stop and delete the stored tasks:
```bash
docker compose down -v
```

## API

Base URL: `http://localhost:3001`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/tasks` | List all tasks (newest first) | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Create a task | 201 |
| PATCH | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 204 |

Task fields: `id` (UUID), `title` (required, max 120 characters), `description` (optional, max 1000 characters), `status` (`TODO`, `IN_PROGRESS` or `DONE`, default `TODO`), `dueDate` (optional, ISO 8601 date), `createdAt`.

Errors:
- `400` for invalid input: a missing or blank title, an invalid status or date, unknown fields, or a malformed `id`
- `404` when a task does not exist

## Project structure

```
api/
  prisma/              schema and migrations
  src/tasks/           controller, service and DTOs
  src/prisma/          Prisma module and service
web/
  src/app/             page and layout
  src/components/      task table, dialogs, toolbar and shadcn/ui components
  src/hooks/           useTasks hook
  src/lib/             API client, form schema, date formatting
docker-compose.yml
```

## How I used AI

I used **Claude (Anthropic)** as a chat assistant throughout this project. Claude generated the code, including the UI layout and styling. I directed the work, made the decisions, and tested everything.

**What I did:**
- Set the scope and rules: keep the code simple and readable, follow only what the assignment requires, and add no extra features beyond the brief.
- Reviewed and approved the plan and the technical decisions before any code was written: SQLite with Prisma, UUID ids, DTO validation with class-validator, a plain `fetch` client with a custom hook, react-hook-form with zod, and 204 on delete.
- Built the project step by step, creating each file and running each command myself.
- Tested every step: all API endpoints with `curl` (including the 400 and 404 cases) and every UI state in the browser (loading, error, empty, success toasts, delete confirmation, filter and sort).
- Reported the problems I found, and Claude proposed the fixes, which I applied and re-tested:
  - A lint error (`react-hooks/set-state-in-effect`) in the `useTasks` hook.
  - A build error caused by the shadcn `form` component not being available, which was replaced with shadcn's `Field` components and react-hook-form's `Controller`.
  - The whole page scrolling sideways on narrow screens.
  - A 500 error on a fresh clone, because the Google-hosted fonts timed out, so I switched to the bundled `geist` package.
- Removed the default Nest boilerplate.
- Verified the whole project from a fresh clone.
