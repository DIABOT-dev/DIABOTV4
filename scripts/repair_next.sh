# scripts/repair_next.sh
#!/usr/bin/env sh
set -eu

echo "🧹 Clean build caches..."
rm -rf .next .turbo dist coverage
rm -rf node_modules/.cache || true

echo "🗑️  Remove node_modules & lock conflicts (optional if CI uses pnpm)"
if [ -f pnpm-lock.yaml ]; then
  rm -rf node_modules
  pnpm install --frozen-lockfile || pnpm install
elif [ -f yarn.lock ]; then
  rm -rf node_modules
  yarn install --check-files || yarn install
else
  rm -rf node_modules package-lock.json || true
  npm install
fi

echo "🧱 Rebuild Next.js..."
# ép Next tạo lại toàn bộ manifest trong .next/
if npm run | grep -q "^  build$"; then
  npm run build
elif pnpm -v >/dev/null 2>&1; then
  pnpm build
else
  yarn build
fi

echo "🚀 Start dev server (port auto)..."
if npm run | grep -q "^  dev$"; then
  npm run dev
elif pnpm -v >/dev/null 2>&1; then
  pnpm dev
else
  yarn dev
fi
