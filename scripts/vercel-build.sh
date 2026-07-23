#!/bin/bash
# Vercel build script - converts workspace:* to file: for npm
cd /vercel/path0

# Convert workspace:* to file: references
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
const m = {
  '@cykani/db': '../../packages/db',
  '@cykani/hooks': '../../packages/hooks',
  '@cykani/lib': '../../packages/lib',
  '@cykani/styles': '../../packages/styles',
  '@cykani/ui': '../../packages/ui'
};
for (const [k, v] of Object.entries(m)) {
  if (p.dependencies?.[k]) p.dependencies[k] = 'file:' + v;
  if (p.devDependencies?.[k]) p.devDependencies[k] = 'file:' + v;
}
fs.writeFileSync('apps/web/package.json', JSON.stringify(p, null, 2) + '\n');
"

# Install and build
cd apps/web
npm install --legacy-peer-deps
npx next build
