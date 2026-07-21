#!/bin/bash
# start.sh — cykani app starter (cross-platform)
# Browser sessions still use Docker via cykani-browser containers.
# Usage:
#   ./start.sh    # start app stack (native host OS)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════╗"
echo "║         Starting cykani              ║"
echo "║      (native host OS)                ║"
echo "╚══════════════════════════════════════╝"

echo ""
echo "→ Starting API..."
cd "$SCRIPT_DIR/apps/api"
npx tsx --env-file=.env src/index.ts &
API_PID=$!
echo "  API PID: $API_PID"

echo ""
echo "→ Starting Web..."
cd "$SCRIPT_DIR/apps/web"
pnpm dev &
WEB_PID=$!
echo "  Web PID: $WEB_PID"

sleep 3

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       cykani is running              ║"
echo "║      (native mode)                   ║"
echo "╠══════════════════════════════════════╣"
echo "║  API:    http://localhost:3000       ║"
echo "║  Docs:   http://localhost:3000/docs  ║"
echo "║  Web:    http://localhost:3001       ║"
echo "║  DB:     localhost:5432              ║"
echo "║  Redis:  localhost:6379              ║"
echo "╠══════════════════════════════════════╣"
echo "║  Stop: Ctrl+C or ./stop.sh          ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Note: cykani-browser session containers still use Docker."
