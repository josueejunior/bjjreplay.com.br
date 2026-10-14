#!/usr/bin/env bash
# Copia public/ e .next/static/ para o bundle standalone (obrigatório após next build).
set -eu

ROOT="${1:-/opt/bjj-replay/bjjreplay.com.br}"
FRONT="$ROOT/front"
STANDALONE="$FRONT/.next/standalone"

if [[ ! -f "$STANDALONE/server.js" ]]; then
  echo "ERRO: $STANDALONE/server.js não encontrado — rode npm run build no front antes."
  exit 1
fi

if [[ ! -d "$FRONT/.next/static" ]]; then
  echo "ERRO: $FRONT/.next/static não encontrado."
  exit 1
fi

rm -rf "$STANDALONE/public" "$STANDALONE/.next/static"
cp -r "$FRONT/public" "$STANDALONE/public"
mkdir -p "$STANDALONE/.next"
cp -r "$FRONT/.next/static" "$STANDALONE/.next/static"

echo "[sync-standalone] OK — public + .next/static em $STANDALONE"
