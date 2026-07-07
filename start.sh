#!/usr/bin/env bash
set -e

# Node usado pelo projeto (baixado em /tmp/kilo/node22).
# Se voce ja tiver Node 22+ no PATH, o script o respeita.
NODE_BIN="/tmp/kilo/node22/bin"
if [ -x "$NODE_BIN/node" ]; then
  export PATH="$NODE_BIN:$PATH"
fi

# Vai para a pasta do projeto (mesmo diretorio deste script)
cd "$(dirname "$0")"

echo "Iniciando NewPlugins Web (frontend + API)..."
echo "  Web:  http://localhost:5173"
echo "  API:  http://localhost:3001"
echo "  Ctrl+C para parar"
echo

npm run dev:all
