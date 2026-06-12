# VOLT API — Back-End Node

API REST em **Node.js + Fastify + TypeScript** com autenticação JWT, validação Zod e persistência em **SQLite** (better-sqlite3, modo WAL). O contrato é estável — trocar por Postgres/Supabase em produção não muda nada para o front.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

API em [http://localhost:8000](http://localhost:8000). O banco SQLite (`data/volt.db`) é criado automaticamente com schema + seed na primeira execução.

### Usuários seed

| E-mail | Senha | Plano | Admin |
|--------|-------|-------|-------|
| `admin@volt.app` | `admin123` | Black | Sim |
| `demo@volt.app` | `demo123` | Free | Não |

## Endpoints

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/signup` | `{ email, password, name? }` → `{ user, accessToken }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ user, accessToken }` |
| GET | `/api/auth/me` | Usuário do token (Bearer) |

### Conteúdo

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/plans` | — | Planos Free/Premium/Black |
| GET | `/api/gamification/stats` | opcional | Stats do usuário (demo sem token) |
| GET | `/api/videos/feed` | opcional | Feed com `locked` calculado pelo plano |
| GET | `/api/videos/:id` | opcional | 403 se o plano não dá acesso |
| POST | `/api/users/profile` | sim | `{ sportLevel, avatarUrl }` |

### Admin (requer token de admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/images` | Imagens para curadoria |
| POST | `/api/admin/categorize` | `{ imageId, category }` → `{ message }` |

Erros seguem o formato `{ detail: string }` (compatível com o front).

## Conectar o front-end

No `front/.env.local`:

```
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Com mocks desligados, o front passa a autenticar via `/api/auth/*` deste servidor e a consumir todos os dados daqui.

## Estrutura

```
src/
├── server.ts          # Entry point
├── app.ts             # Fastify, CORS, error handler, registro de rotas
├── config.ts          # Env vars
├── plugins/auth.ts    # JWT + decorators authenticate/requireAdmin
├── routes/            # auth, plans, videos, gamification, users, admin
├── services/          # Regras de negócio
├── data/              # Seed + dados estáticos (planos, vídeos, badges)
└── lib/               # db.ts (SQLite/better-sqlite3), hash de senha (scrypt)
```

## Banco de dados

SQLite em `data/volt.db` com 3 tabelas: `users`, `gamification` e `admin_images`. Para resetar o banco, apague o arquivo e reinicie o servidor (o seed roda de novo).
