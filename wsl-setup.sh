#!/bin/bash
set -euo pipefail

echo "=== Cykani WSL2 Development Setup ==="
echo "This script installs: Node.js 22, pnpm, PostgreSQL, Redis, Docker Engine"
echo ""

# Install Node.js 22 if not present
if ! command -v node &> /dev/null || [[ "$(node -v)" != v22* ]]; then
  echo "Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js $(node -v) already installed"
fi

# Install pnpm if not present
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  sudo npm install -g pnpm
else
  echo "pnpm $(pnpm -v) already installed"
fi

# Install PostgreSQL if not present
if ! command -v psql &> /dev/null; then
  echo "Installing PostgreSQL..."
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
else
  echo "PostgreSQL $(psql --version) already installed"
  sudo systemctl start postgresql || true
fi

# Install Redis if not present
if ! command -v redis-cli &> /dev/null; then
  echo "Installing Redis..."
  sudo apt-get install -y redis-server
  sudo systemctl enable redis-server
  sudo systemctl start redis-server
else
  echo "Redis $(redis-cli --version) already installed"
  sudo systemctl start redis-server || true
fi

# Install Docker Engine if not present
if ! command -v docker &> /dev/null; then
  echo "Installing Docker Engine..."
  curl -fsSL https://get.docker.com | sh
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
else
  echo "Docker $(docker --version) already installed"
  sudo systemctl start docker || true
fi

# Install nginx if not present (optional, for reverse proxy)
if ! command -v nginx &> /dev/null; then
  echo "Installing nginx (optional)..."
  sudo apt-get install -y nginx || true
fi

echo ""
echo "=== Setting up Cykani database ==="

# Create database and user if they don't exist
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'cykani'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE cykani;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = 'cykani'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER cykani WITH PASSWORD 'cykani-dev';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cykani TO cykani;" || true
sudo -u postgres psql -d cykani -c "GRANT ALL ON SCHEMA public TO cykani;" || true

echo ""
echo "=== Verifying services ==="
echo "PostgreSQL: $(sudo systemctl is-active postgresql || echo 'not running')"
echo "Redis: $(sudo systemctl is-active redis-server || echo 'not running')"
echo "Docker: $(sudo systemctl is-active docker || echo 'not running')"
echo ""

echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "1. cd /mnt/c/Users/sekani/Desktop/cykani/cykani-app"
echo "2. pnpm install"
echo "3. pnpm db:push"
echo "4. pnpm dev"
echo ""
echo "Note: If Docker group was added, you may need to log out and back in for docker permissions."
