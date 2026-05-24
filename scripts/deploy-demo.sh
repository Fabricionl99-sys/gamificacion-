#!/usr/bin/env bash
set -euo pipefail
# Deploy del widget gamificacion- a demo.social2game.com.
# Requiere: AWS CLI configurado + permisos S3+CloudFront en sa-east-1.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

S3_BUCKET="social2game-prod-player-demo"
CF_DISTRIBUTION_ID="E2K1TXJ6D60ZLM"
AWS_REGION="sa-east-1"

echo "→ Building widget (prod env)..."
VITE_API_BASE_URL=https://api.social2game.com \
VITE_DEMO_TENANT_ID=6b67e761-b833-402b-8d59-81c478ac782b \
VITE_USE_MOCKS=false \
VITE_PILOT_SOCIAL=true \
npm run build

echo "→ Syncing hashed assets (long-cache: 1 año immutable) to s3://${S3_BUCKET}..."
# Solo /assets/** tienen hash en el filename (vite default) → safe immutable.
aws --region "$AWS_REGION" s3 sync dist/assets/ "s3://${S3_BUCKET}/assets/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

echo "→ Syncing root (favicons, etc.) con cache moderado..."
aws --region "$AWS_REGION" s3 sync dist/ "s3://${S3_BUCKET}/" \
  --delete \
  --cache-control "public,max-age=3600" \
  --exclude "index.html" --exclude "*.html" --exclude "robots.txt" \
  --exclude "assets/*" \
  --exclude "gamification-widget.iife.js" --exclude "gamification-widget.css"

echo "→ Uploading fixed-name bundle (no-cache, filename no cambia entre deploys)..."
# CRITICAL: gamification-widget.iife.js NO tiene hash en el nombre. Si lo
# cacheamos como 'immutable' por 1 año, los browsers cachean para siempre
# y nunca ven cambios. Usar must-revalidate como index.html.
for f in gamification-widget.iife.js gamification-widget.css; do
  if [ -f "dist/$f" ]; then
    aws --region "$AWS_REGION" s3 cp "dist/$f" "s3://${S3_BUCKET}/$f" \
      --cache-control "public,max-age=0,must-revalidate"
  fi
done

echo "→ Uploading service-worker.js (no-cache)..."
if [ -f dist/service-worker.js ]; then
  aws --region "$AWS_REGION" s3 cp dist/service-worker.js "s3://${S3_BUCKET}/service-worker.js" \
    --cache-control "public,max-age=0,must-revalidate" \
    --content-type "application/javascript"
fi

echo "→ Uploading index.html (no-cache) + robots.txt..."
aws --region "$AWS_REGION" s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html"
echo -e "User-agent: *\nDisallow: /\n" | aws --region "$AWS_REGION" s3 cp - "s3://${S3_BUCKET}/robots.txt" \
  --cache-control "public,max-age=300" \
  --content-type "text/plain"

echo "→ Invalidating CloudFront ${CF_DISTRIBUTION_ID}..."
aws --region "$AWS_REGION" cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths '/*' \
  --query 'Invalidation.{id:Id,status:Status}' --output table

if command -v jq >/dev/null 2>&1; then
  bash "$ROOT/scripts/configure-cloudfront-spa.sh" "$CF_DISTRIBUTION_ID" || echo "⚠ CloudFront SPA config skipped (needs jq + IAM UpdateDistribution)"
fi

echo "✓ Deploy completo → https://demo.social2game.com"
echo "  (CloudFront propagación puede tardar 5-10 min en algunos edges)"
