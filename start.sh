#!/usr/bin/env bash
# Sobe a aplicação localmente: confere o Node e o .env, instala as
# dependências quando preciso e inicia o Vite.

set -euo pipefail
cd "$(dirname "$0")"

usage() {
  cat <<'EOF'
Uso: ./start.sh [opções] [-- argumentos extras do Vite]

  (sem opções)  servidor de desenvolvimento em http://localhost:5173
  --host        abre também na rede local (para testar no celular)
  --sync        valida e publica o conteúdo no Supabase antes de subir
  --preview     gera o build de produção e serve o resultado
  -h, --help    mostra esta ajuda

Exemplos:
  ./start.sh --host
  ./start.sh --sync -- --port 3000
EOF
}

if [ -t 1 ]; then
  G=$'\e[32m'; Y=$'\e[33m'; R=$'\e[31m'; N=$'\e[0m'
else
  G=''; Y=''; R=''; N=''
fi
info() { printf '%s>%s %s\n' "$G" "$N" "$*"; }
fail() { printf '%serro:%s %s\n' "$R" "$N" "$*" >&2; exit 1; }

# ---------------------------------------------------------------
# Opções
# ---------------------------------------------------------------
mode=dev
host=0
sync=0
extra=()
while [ $# -gt 0 ]; do
  case "$1" in
    --host)    host=1 ;;
    --sync)    sync=1 ;;
    --preview) mode=preview ;;
    -h|--help) usage; exit 0 ;;
    --)        shift; extra=("$@"); break ;;
    *)         usage >&2; fail "opção desconhecida: $1" ;;
  esac
  shift
done

# ---------------------------------------------------------------
# Node (o projeto usa --env-file, que exige 20.6+)
# ---------------------------------------------------------------
command -v node >/dev/null 2>&1 \
  || fail "Node.js não encontrado. Instale a versão 20.6 ou mais nova (https://nodejs.org)."
node -e 'const [a, b] = process.versions.node.split(".").map(Number); process.exit(a > 20 || (a === 20 && b >= 6) ? 0 : 1)' \
  || fail "Node $(node -v) é antigo demais; o projeto pede 20.6 ou mais nova."

# ---------------------------------------------------------------
# .env
# ---------------------------------------------------------------
if [ ! -f .env ]; then
  cp .env.example .env
  fail "criei o .env a partir do .env.example. Preencha a URL e as chaves do Supabase (Project Settings > API) e rode de novo."
fi

env_value() { sed -n "s/^$1=//p" .env | tail -n 1 | tr -d "\r\"'"; }
require_env() {
  case "$(env_value "$1")" in
    ''|*SEU-PROJETO*|eyJ...*) fail "$1 não está preenchida no .env." ;;
  esac
}
require_env VITE_SUPABASE_URL
require_env VITE_SUPABASE_ANON_KEY

# ---------------------------------------------------------------
# Dependências (instala se faltar node_modules ou se o lock mudou)
# ---------------------------------------------------------------
stamp=node_modules/.package-lock.json
if [ ! -d node_modules ] || [ package-lock.json -nt "$stamp" ] || [ package.json -nt "$stamp" ]; then
  info "Instalando dependências..."
  npm install
  touch "$stamp"
fi

# ---------------------------------------------------------------
# Conteúdo (opcional)
# ---------------------------------------------------------------
if [ "$sync" = 1 ]; then
  require_env SUPABASE_SERVICE_ROLE_KEY
  info "Validando o conteúdo..."
  npm run content:check
  info "Publicando o conteúdo no Supabase..."
  npm run content:sync
fi

# ---------------------------------------------------------------
# Servidor
# ---------------------------------------------------------------
args=()
if [ "$host" = 1 ]; then args+=(--host); fi
args+=(${extra[@]+"${extra[@]}"})

if [ "$mode" = preview ]; then
  info "Gerando o build de produção..."
  npm run build
  info "Servindo o build em http://localhost:4173"
  exec npm run preview -- ${args[@]+"${args[@]}"}
fi

info "Iniciando o servidor de desenvolvimento..."
exec npm run dev -- ${args[@]+"${args[@]}"}
