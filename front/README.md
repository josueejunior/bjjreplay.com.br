# VOLT — Front-End SaaS de Vídeo e Gamificação Esportiva

Front-end em **Next.js 14 (App Router) + TypeScript + Tailwind CSS** com estética dark premium (preto/cinza escuro, detalhes néon e metálicos), micro-interações com Framer Motion e camada de mocks (MSW) para desenvolvimento independente do back-end.

## Telas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com hero video, funcionalidades e tabela de preços (Free / Premium / Black) |
| `/login` e `/signup` | Autenticação + onboarding em 3 steps (conta → nível esportivo → upload de avatar) |
| `/dashboard` | Sidebar com estatísticas de gamificação (XP, streak, badges) + feed de vídeos com upsell (cadeado para contas Free) |
| `/videos/[id]` | Player imersivo (vertical/horizontal) com download e compartilhamento |
| `/admin` | Curadoria interna: grid de imagens + botões de categoria |

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> Com mocks ativos, qualquer e-mail/senha funciona no login/cadastro.

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_USE_MOCKS` | `true` (padrão) usa MSW; `false` aponta para a API real |
| `NEXT_PUBLIC_API_URL` | URL base do back-end FastAPI (usado quando mocks desligados) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (vazio = auth mock local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

## Integração com o back-end real

1. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — o auth passa a usar o SDK do Supabase automaticamente.
2. Defina `NEXT_PUBLIC_USE_MOCKS=false` e `NEXT_PUBLIC_API_URL` — o Axios passa a chamar o FastAPI diretamente.

### Contrato de API esperado

| Método | Rota | Uso |
|--------|------|-----|
| GET | `/api/plans` | Tabela de preços da landing |
| GET | `/api/gamification/stats` | Sidebar do dashboard |
| GET | `/api/videos/feed` | Feed de vídeos |
| GET | `/api/videos/:id` | Player (403 para vídeo bloqueado) |
| POST | `/api/users/profile` | Onboarding (nível esportivo + avatar) |
| GET | `/api/admin/images` | Grid de curadoria |
| POST | `/api/admin/categorize` | `{ imageId, category }` → `{ message }` |

Os handlers em [`mocks/handlers.ts`](mocks/handlers.ts) documentam o formato exato de cada resposta.

## Estrutura

```
app/            # Rotas (App Router)
components/     # UI base, landing, auth, dashboard, player, admin
lib/            # api (axios), supabase, auth, hooks, utils
mocks/          # MSW handlers + fixtures
types/          # Tipos compartilhados
```
