# VOLT — SaaS de Vídeo e Gamificação Esportiva

Monorepo com front-end e back-end separados:

```
STRAVA/
├── front/   # Next.js 14 + Tailwind + Framer Motion (5 telas dark premium)
└── back/    # Node.js + Fastify + TypeScript (API REST + JWT)
```

## Rodando o projeto completo

Um único comando sobe back e front juntos:

```bash
npm run install:all   # primeira vez: instala raiz + back + front
npm run dev           # back em :8000 + front em :3000
```

Scripts disponíveis na raiz:

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe back + front em paralelo (logs com prefixo colorido) |
| `npm run dev:back` | Só a API (http://localhost:8000) |
| `npm run dev:front` | Só o front (http://localhost:3000) |
| `npm run build` | Build de produção dos dois |
| `npm run install:all` | Instala dependências de tudo |

### Modos do front

- **Mocks (padrão)**: funciona sem back-end (`NEXT_PUBLIC_USE_MOCKS=true`)
- **API real**: em `front/.env.local`, defina `NEXT_PUBLIC_USE_MOCKS=false` e `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Login de teste (API real)

| E-mail | Senha | Acesso |
|--------|-------|--------|
| `admin@volt.app` | `admin123` | Black + Admin |
| `demo@volt.app` | `demo123` | Free |

Veja os READMEs de [`front/`](front/README.md) e [`back/`](back/README.md) para detalhes.
