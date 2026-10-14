#!/usr/bin/env bash
# Testa Supabase: auth + tabelas REST
set -euo pipefail

PROJECT=/opt/bjj-replay/bjjreplay.com.br
ENV_FILE="$PROJECT/.env"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

URL="${NEXT_PUBLIC_SUPABASE_URL}"
KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
SECRET="${SUPABASE_SERVICE_ROLE_KEY:-$KEY}"

if [[ -z "$URL" || -z "$KEY" ]]; then
  echo "ERRO: faltam NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

echo "=== Supabase integration test ==="
echo "URL: $URL"
echo

echo "--- OpenAPI (discover tables) ---"
OPENAPI=$(curl -s "$URL/rest/v1/" -H "apikey: $SECRET" -H "Accept: application/openapi+json")
echo "$OPENAPI" | head -c 1500
echo -e "\n"

curl -s "$URL/auth/v1/health" -H "apikey: $KEY" | head -c 200
echo -e "\n"

TABLES=(alunos aluno_modalidades checkins estatisticas_biomecanicas faturas_mensalidades linha_do_tempo_eventos midia_marcacoes midias sessoes_sparring treinos_gerais)

echo "--- Tables (secret key, apikey header only) ---"
OK=()
FAIL=()
for t in "${TABLES[@]}"; do
  RESP=$(curl -s -w "\n%{http_code}" "$URL/rest/v1/${t}?select=*&limit=1" \
    -H "apikey: $SECRET" \
    -H "Accept: application/json")
  BODY=$(echo "$RESP" | head -n -1)
  CODE=$(echo "$RESP" | tail -n 1)
  if [[ "$CODE" == "200" ]]; then
    OK+=("$t")
    echo "  OK  $t — $BODY"
  else
    FAIL+=("$t")
    echo "  FAIL $t (HTTP $CODE) — $BODY"
  fi
done

echo
echo "--- Auth signUp test ---"
TEST_EMAIL="integration-$(date +%s)@gmail.com"
TEST_PASS="TestPass123!Aa"
SIGNUP=$(curl -s -w "\n%{http_code}" -X POST "$URL/auth/v1/signup" \
  -H "apikey: $KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}")
SBODY=$(echo "$SIGNUP" | head -n -1)
SCODE=$(echo "$SIGNUP" | tail -n 1)
echo "  signUp HTTP $SCODE"
echo "  $SBODY" | head -c 300
echo

echo "=== Summary ==="
echo "Tabelas OK (${#OK[@]}): ${OK[*]:-nenhuma}"
echo "Tabelas FAIL (${#FAIL[@]}): ${FAIL[*]:-nenhuma}"
echo "Auth signUp: $([[ "$SCODE" == "200" || "$SCODE" == "201" ]] && echo OK || echo FAIL)"

echo
echo "--- Backend API (/api/health/supabase) ---"
API=$(curl -s -w "\n%{http_code}" "http://127.0.0.1:${BACK_PORT:-7871}/api/health/supabase")
ABODY=$(echo "$API" | head -n -1)
ACODE=$(echo "$API" | tail -n 1)
echo "  HTTP $ACODE"
echo "  $ABODY" | head -c 800
echo
