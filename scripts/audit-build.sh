#!/bin/bash
cd /home/sekani/cykani-cy/apps/web

echo "=== Checking for @cykani imports in source ==="
grep -rn '@cykani/' src/ --include='*.ts' --include='*.tsx' --include='*.css' 2>/dev/null | grep -v node_modules

echo ""
echo "=== Checking CSS imports ==="
grep -n '@import' src/app/globals.css 2>/dev/null

echo ""
echo "=== Checking package.json for missing deps ==="
# List all external imports from source
grep -roh 'from "[^"]*"' src/ --include='*.ts' --include='*.tsx' 2>/dev/null | \
  grep -oP '"[^"]*"' | tr -d '"' | \
  grep -v '^\./' | grep -v '^\.\./' | grep -v '^@/' | \
  sort -u > /tmp/imports.txt

# List all deps from package.json
node -e "const p=require('./package.json'); Object.keys(p.dependencies||{}).concat(Object.keys(p.devDependencies||{})).forEach(d=>console.log(d))" > /tmp/deps.txt

echo "External imports:"
cat /tmp/imports.txt

echo ""
echo "Package deps:"
cat /tmp/deps.txt

echo ""
echo "=== Missing from package.json ==="
while IFS= read -r imp; do
  # Get the package name (handle scoped packages)
  if [[ "$imp" == @* ]]; then
    pkg=$(echo "$imp" | cut -d'/' -f1-2)
  else
    pkg=$(echo "$imp" | cut -d'/' -f1)
  fi
  if ! grep -q "^${pkg}$" /tmp/deps.txt 2>/dev/null; then
    echo "MISSING: $pkg (imported as $imp)"
  fi
done < /tmp/imports.txt
