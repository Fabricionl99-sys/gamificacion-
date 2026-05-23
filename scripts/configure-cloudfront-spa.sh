#!/usr/bin/env bash
set -euo pipefail
# Configura CloudFront para SPA routing: 404/403 → index.html (200).
# Idempotente: solo actualiza si falta la config.

CF_DISTRIBUTION_ID="${1:-E2K1TXJ6D60ZLM}"
AWS_REGION="${AWS_REGION:-sa-east-1}"

echo "→ Checking CloudFront SPA fallback for ${CF_DISTRIBUTION_ID}..."

tmp="$(mktemp)"
trap 'rm -f "$tmp" "${tmp}.cfg"' EXIT

meta="$(aws --region "$AWS_REGION" cloudfront get-distribution-config --id "$CF_DISTRIBUTION_ID")"
etag="$(echo "$meta" | jq -r '.ETag')"
echo "$meta" | jq '.DistributionConfig' > "$tmp"

has_404="$(jq '[.CustomErrorResponses.Items[]? | select(.ErrorCode == 404)] | length' "$tmp")"
has_403="$(jq '[.CustomErrorResponses.Items[]? | select(.ErrorCode == 403)] | length' "$tmp")"

if [[ "$has_404" -ge 1 && "$has_403" -ge 1 ]]; then
  echo "✓ CloudFront SPA fallback already configured"
  exit 0
fi

jq '
  .CustomErrorResponses = {
    Quantity: 2,
    Items: [
      { ErrorCode: 404, ResponsePagePath: "/index.html", ResponseCode: "200", ErrorCachingMinTTL: 0 },
      { ErrorCode: 403, ResponsePagePath: "/index.html", ResponseCode: "200", ErrorCachingMinTTL: 0 }
    ]
  }
' "$tmp" > "${tmp}.cfg"

echo "→ Updating CloudFront distribution (may take a few minutes)..."
aws --region "$AWS_REGION" cloudfront update-distribution \
  --id "$CF_DISTRIBUTION_ID" \
  --if-match "$etag" \
  --distribution-config "file://${tmp}.cfg" \
  --query 'Distribution.{Id:Id,Status:Status}' --output table

echo "✓ CloudFront SPA fallback configured"
