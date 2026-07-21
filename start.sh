#!/bin/bash
# start.sh — cykani app starter (WSL2-native only)
# Browser sessions still use Docker via cykani-browser containers.
# Usage:
#   ./start.sh    # start app stack only (native WSL2)
#   ./stop.sh     # stop all services

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH=~/.npm-global/bin:$PATH

echo "╔══════════════════════════════════════╗"
echo "║         Starting cykani              ║"
echo "║      (WSL2-native app stack)         ║"
echo "╚══════════════════════════════════════╝"

echo ""
echo "→ Starting API..."
cd "$SCRIPT_DIR/apps/api"
nohup npx tsx --env-file=.env src/index.ts > /tmp/cykani-api.log 2>&1 &
API_PID=$!
echo "$API_PID" > /tmp/cykani-api.pid
echo "  API PID: $API_PID"

echo ""
echo "→ Starting Web..."
cd "$SCRIPT_DIR/apps/web"
PORT=3001 nohup npm run dev > /tmp/cykani-web.log 2>&1 &
WEB_PID=$!
echo "$WEB_PID" > /tmp/cykani-web.pid
echo "  Web PID: $WEB_PID"

sleep 3

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       cykani is running              ║"
echo "║      (WSL2-native mode)              ║"
echo "╠══════════════════════════════════════╣"
echo "║  API:    http://localhost:3000       ║"
echo "║  Docs:   http://localhost:3000/docs  ║"
echo "║  Web:    http://localhost:3001       ║"
echo "║  DB:     localhost:5432              ║"
echo "║  Redis:  localhost:6379              ║"
echo "╠══════════════════════════════════════╣"
echo "║  Logs: /tmp/cykani-*.log             ║"
echo "║  Stop: ./stop.sh                     ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Note: cykani-browser session containers still use Docker."
