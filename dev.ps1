<#
.SYNOPSIS
    Start cykani dev server (Windows native).
.DESCRIPTION
    Starts the Next.js web app on port 3001.
    In dev mode, auth is bypassed so you can browse the full UI.
    Open http://localhost:3001 to land on the dashboard.
.NOTES
    API/DB/Redis are NOT started — this is UI-only preview.
    For full stack, use WSL2: ./start.sh
#>

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$webDir = Join-Path $root "apps\web"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║       cykani dev (UI only)           ║" -ForegroundColor Cyan
Write-Host "  ║  http://localhost:3001               ║" -ForegroundColor Cyan
Write-Host "  ║  Auth: bypassed in dev mode          ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Ensure dependencies are installed
if (-not (Test-Path (Join-Path $root "node_modules"))) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Push-Location $root
    pnpm install
    Pop-Location
}

# Start Next.js dev server
Push-Location $webDir
try {
    npx next dev -p 3001
} finally {
    Pop-Location
}
