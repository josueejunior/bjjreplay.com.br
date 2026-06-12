#!/usr/bin/env bash
# BJJ Replay — instala dependências, build e sobe com PM2 (um comando).
# Uso (na raiz do projeto ou de qualquer pasta):
#   bash deploy/pm2/setup-and-start.sh
#
# Requisitos: Ubuntu/Debian (VPS). Rode como usuário com sudo.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[bjj-replay]${NC} $*"; }
warn() { echo -e "${YELLOW}[bjj-replay]${NC} $*"; }
err()  { echo -e "${RED}[bjj-replay]${NC} $*" >&2; }

SKIP_APT=false
SKIP_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --skip-apt) SKIP_APT=true ;;
    --no-build) SKIP_BUILD=true ;;
    -h|--help)
      echo "Uso: bash deploy/pm2/setup-and-start.sh [--skip-apt] [--no-build]"
      echo "  --skip-apt   não instala pacotes do sistema (node, pm2, build-essential)"
      echo "  --no-build   só reinicia PM2 (sem npm ci / build)"
      exit 0
      ;;
  esac
done

# ── 1. Pacotes do sistema ──────────────────────────────────────────────────────
if [[ "$SKIP_APT" == false ]]; then
  log "Verificando pacotes do sistema..."

  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq \
      curl ca-certificates gnupg \
      python3 make g++ build-essential \
      >/dev/null
  else
    warn "apt-get não encontrado — instale manualmente: python3, make, g++"
  fi

  if ! command -v node >/dev/null 2>&1 || ! node -v | grep -qE 'v(18|20|22)\.'; then
    log "Instalando Node.js 20..."
    if command -v apt-get >/dev/null 2>&1; then
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      sudo apt-get install -y -qq nodejs
    else
      err "Instale Node.js 20+ manualmente: https://nodejs.org"
      exit 1
    fi
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    log "Instalando PM2 globalmente..."
    sudo npm install -g pm2
  fi

  log "Node $(node -v) | npm $(npm -v) | PM2 $(pm2 -v)"
fi

# ── 2. Arquivo .env ──────────────────────────────────────────────────────────
ENV_FILE="$ROOT/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  log "Criando .env a partir do exemplo..."
  if [[ -f "$ROOT/deploy/.env.production.example" ]]; then
    cp "$ROOT/deploy/.env.production.example" "$ENV_FILE"
  else
    cat >"$ENV_FILE" <<'EOF'
JWT_SECRET=
CORS_ORIGIN=https://bjjreplay.com.br,https://www.bjjreplay.com.br
FRONT_PORT=7870
BACK_PORT=7871
DOMAIN=bjjreplay.com.br
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_USE_MOCKS=false
EOF
  fi
fi

# Gera JWT_SECRET se estiver vazio
if grep -qE '^JWT_SECRET=\s*$' "$ENV_FILE" || ! grep -q '^JWT_SECRET=' "$ENV_FILE"; then
  SECRET="$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p -c 64)"
  if grep -q '^JWT_SECRET=' "$ENV_FILE"; then
    sed -i "s/^JWT_SECRET=.*/JWT_SECRET=${SECRET}/" "$ENV_FILE"
  else
    echo "JWT_SECRET=${SECRET}" >>"$ENV_FILE"
  fi
  log "JWT_SECRET gerado automaticamente em .env"
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"
export NEXT_PUBLIC_USE_MOCKS="${NEXT_PUBLIC_USE_MOCKS:-false}"

# ── 3. Build back + front ────────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == false ]]; then
  log "Instalando dependências do backend..."
  cd "$ROOT/back"
  npm ci
  log "Build do backend (TypeScript)..."
  npm run build

  log "Instalando dependências do frontend..."
  cd "$ROOT/front"
  npm ci
  log "Build do frontend (Next.js standalone)..."
  NEXT_TELEMETRY_DISABLED=1 npm run build

  log "Preparando pacote standalone do Next.js..."
  STANDALONE="$ROOT/front/.next/standalone"
  if [[ ! -f "$STANDALONE/server.js" ]]; then
    err "Build standalone falhou — server.js não encontrado em $STANDALONE"
    exit 1
  fi
  cp -r "$ROOT/front/public" "$STANDALONE/public"
  mkdir -p "$STANDALONE/.next"
  cp -r "$ROOT/front/.next/static" "$STANDALONE/.next/static"

  mkdir -p "$ROOT/back/data"
  log "Build concluído."
fi

# ── 4. PM2 ───────────────────────────────────────────────────────────────────
cd "$ROOT"
log "Reiniciando apps no PM2..."

pm2 delete bjj-replay-back 2>/dev/null || true
pm2 delete bjj-replay-front 2>/dev/null || true

pm2 start "$ROOT/deploy/pm2/ecosystem.config.cjs"
pm2 save

log "Status:"
pm2 list

FRONT_PORT="${FRONT_PORT:-7870}"
BACK_PORT="${BACK_PORT:-7871}"
DOMAIN="${DOMAIN:-bjjreplay.com.br}"

echo ""
log "Pronto! Serviços rodando:"
echo "  • Front:  http://127.0.0.1:${FRONT_PORT}"
echo "  • API:    http://127.0.0.1:${BACK_PORT}/api"
echo ""
warn "Apache/Nginx deve fazer proxy:"
echo "  /     → 127.0.0.1:${FRONT_PORT}"
echo "  /api  → 127.0.0.1:${BACK_PORT}/api"
echo ""
warn "Template Apache: deploy/pm2/apache-bjjreplay.com.br.conf"
warn "SSL: sudo certbot --apache -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
warn "PM2 no boot: execute o comando que aparecer abaixo (se ainda não configurou):"
pm2 startup 2>/dev/null | tail -1 || true
