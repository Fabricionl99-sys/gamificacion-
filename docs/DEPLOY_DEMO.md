# Deploy — demo player (`demo.social2game.com`)

Repo: **gamificacion-** (widget WINGOAT).

## Build (para Code / S3)

```bash
cd gamificacion-
npm ci
VITE_API_BASE_URL=https://api.social2game.com \
VITE_DEMO_TENANT_ID=6b67e761-b833-402b-8d59-81c478ac782b \
VITE_USE_MOCKS=false \
VITE_PILOT_SOCIAL=true \
npm run build
```

**Output:** carpeta `dist/` (incluye `index.html` + assets + `gamification-widget.iife.js`).

Sync sugerido:

```bash
aws s3 sync dist/ s3://social2game-prod-player-demo --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Auth demo (integrado)

1. `POST /v1/public/demo/session` al cargar (sin mocks).
2. Token en `sessionStorage` + `Authorization: Bearer` en todas las calls `/v1/player/*`.
3. `POST /v1/public/demo/session/reset` — botón «Reiniciar demo» en el header.

## Branding

- Default tenant: `VITE_DEMO_TENANT_ID` (DemoPlay).
- Override BO: `?tenant=<uuid>` en la URL.

## Modales sin API aún

- Cofre de racha, raspadita: siguen en mock/local.
- Rueda: cuando exista inventario real, usar `POST /v1/player/wheels/inventory/:id/spin`.

## Dev local contra API real

```bash
VITE_API_BASE_URL=/api VITE_USE_MOCKS=false npm run dev
```

El proxy de Vite reescribe `/api` → `https://api.social2game.com`.
