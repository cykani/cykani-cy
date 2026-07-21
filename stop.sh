#!/bin/bash
# stop.sh — Stop all cykani services
# Usage: ./stop.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════╗"
echo "║         Stopping cykani              ║"
echo "╚══════════════════════════════════════╝"

# Stop native processes
if [ -f /tmp/cykani-api.pid ]; then
    API_PID=$(cat /tmp/cykani-api.pid)
    if ps -p $API_PID > /dev/null 2>&1; then
        echo "→ Stopping API (PID: $API_PID)..."
        kill $API_PID || true
    fi
    rm -f /tmp/cykani-api.pid
fi

if [ -f /tmp/cykani-web.pid ]; then
    WEB_PID=$(cat /tmp/cykani-web.pid)
    if ps -p $WEB_PID > /dev/null 2>&1; then
        echo "→ Stopping Web (PID: $WEB_PID)..."
        kill $WEB_PID || true
    fi
    rm -f /tmp/cykani-web.pid
fi

echo ""
echo "✓ cykani stopped"
echo "  Note: cykani-browser containers are managed separately."
