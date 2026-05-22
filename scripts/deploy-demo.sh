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

echo "→ Syncing assets (long-cache) to s3://${S3_BUCKET}..."
aws --region "$AWS_REGION" s3 sync dist/ "s3://${S3_BUCKET}/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html" --exclude "*.html" --exclude "robots.txt"

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

echo "✓ Deploy completo → https://demo.social2game.com"
echo "  (CloudFront propagación puede tardar 5-10 min en algunos edges)"
