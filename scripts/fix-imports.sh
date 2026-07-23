#!/bin/bash
cd /home/sekani/cykani-cy

# Update imports in web app
find apps/web/src -type f \( -name '*.ts' -o -name '*.tsx' \) | while read f; do
  sed -i 's|from "@cykani/ui/|from "@/ui/|g' "$f"
  sed -i 's|from "@cykani/lib/|from "@/lib/|g' "$f"
  sed -i 's|from "@cykani/hooks/|from "@/hooks/|g' "$f"
  sed -i 's|from "@cykani/db/|from "@/db/|g' "$f"
  sed -i "s|from '@cykani/ui/|from '@/ui/|g" "$f"
  sed -i "s|from '@cykani/lib/|from '@/lib/|g" "$f"
  sed -i "s|from '@cykani/hooks/|from '@/hooks/|g" "$f"
  sed -i "s|from '@cykani/db/|from '@/db/|g" "$f"
done

# Update globals.css
sed -i 's|@import "@cykani/styles/|@import "@/styles/|g' apps/web/src/app/globals.css

# Update package.json - remove file: deps
sed -i '/"@cykani\/db": "file:/d' apps/web/package.json
sed -i '/"@cykani\/hooks": "file:/d' apps/web/package.json
sed -i '/"@cykani\/lib": "file:/d' apps/web/package.json
sed -i '/"@cykani\/styles": "file:/d' apps/web/package.json
sed -i '/"@cykani\/ui": "file:/d' apps/web/package.json

# Copy styles
mkdir -p apps/web/src/styles
cp -r packages/styles/src/* apps/web/src/styles/

echo "Done - all imports updated"
