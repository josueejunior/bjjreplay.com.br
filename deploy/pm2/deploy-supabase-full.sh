#!/usr/bin/env bash
# Deploy migração 100% Supabase
set -euo pipefail
PROJECT=/opt/bjj-replay/bjjreplay.com.br
cd "$PROJECT"

grep -q '^USE_SUPABASE=' .env 2>/dev/null && sed -i 's/^USE_SUPABASE=.*/USE_SUPABASE=true/' .env || echo 'USE_SUPABASE=true' >> .env

echo "[deploy] backend build..."
cd back && npm run build

echo "[deploy] frontend build..."
cd "$PROJECT/front"
set -a; source "$PROJECT/.env"; set +a
NEXT_TELEMETRY_DISABLED=1 npm run build
STANDALONE="$PROJECT/front/.next/standalone"
cp -r "$PROJECT/front/public" "$STANDALONE/public"
mkdir -p "$STANDALONE/.next"
cp -r "$PROJECT/front/.next/static" "$STANDALONE/.next/static"

echo "[deploy] pm2 restart..."
cd "$PROJECT"
set -a; source .env; set +a
pm2 restart deploy/pm2/ecosystem.config.cjs --update-env
pm2 save

sleep 3
echo "[deploy] health supabase:"
curl -s "http://127.0.0.1:${BACK_PORT:-7871}/api/health/supabase" | head -c 500
echo
bash deploy/pm2/test-supabase.sh 2>/dev/null | tail -15 || true
