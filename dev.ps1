<#
.SYNOPSIS
    Start cykani dev servers (Windows native).
.DESCRIPTION
    Starts API on port 3000 and Web on port 3001 in separate PowerShell windows.
    In dev mode, auth is bypassed so you can browse the full UI.
    Open http://localhost:3001 to land on the site.
.NOTES
    No Docker or WSL2 required for the app stack.
#>

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║       cykani dev (Windows native)    ║" -ForegroundColor Cyan
Write-Host "  ║  API:   http://localhost:3000        ║" -ForegroundColor Cyan
Write-Host "  ║  Web:   http://localhost:3001        ║" -ForegroundColor Cyan
Write-Host "  ║  Auth:  bypassed in dev mode        ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Ensure dependencies are installed
if (-not (Test-Path (Join-Path $root "node_modules"))) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Push-Location $root
    pnpm install
    Pop-Location
}

# Start API in a new window
Write-Host "Starting API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "{0}"; pnpm --filter @cykani/api dev' -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Web in a new window
Write-Host "Starting Web..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "{0}\apps\web"; pnpm dev' -WindowStyle Normal


