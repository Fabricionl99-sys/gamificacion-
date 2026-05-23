# Handoff BO ↔ Widget jugador — para Code (backend)

## Objetivo

El operador edita branding en el **BO** (`/branding`: colores, logo, fondo, welcome text).  
El **widget** (`gamificacion-`) lo consume en:

`https://wingoat-widget-demo.netlify.app/?tenant={tenant_id}`

## Contrato API (pendiente implementación real)

```
GET /v1/public/branding/:tenantId
→ 200 { "data": PublicBrandingConfig }
```

Campos mínimos del widget (`src/types/branding.ts`):

- `tenant_id`, `color_palette`, `typography`, `logo_url`, `favicon_url`, `background_image_url`, `welcome_text`, `custom_css` (opcional)

Debe devolver la **config guardada** del operador (misma fila que `PATCH /admin/branding`).

## Uploads (BO ya mock)

- `POST /admin/branding/upload-logo`
- `POST /admin/branding/upload-favicon`
- `POST /admin/branding/upload-background`

Tras upload, `PATCH /admin/branding` persiste URLs CDN. El GET público debe exponer esas URLs.

## Dev local

| App | Puerto | Comando |
|-----|--------|---------|
| BO | 5173 (vite default) | `cd Repo-del-BO-frontend && npm run dev` |
| Widget | **5175** | `cd gamificacion- && npm run dev` |

BO `.env.development`:

```
VITE_WIDGET_PREVIEW_URL=http://localhost:5175
```

Widget con MSW (`VITE_USE_MOCKS=true`): samples en `src/mocks/data/brandingSamples.ts`.  
Alinear `tenant_id` con el del operador en BO (ej. `op_casino_astral`).

## Flujo QA (hoy, front)

1. BO → Branding → cambiar colores / logo → **Guardar**
2. **Ver mi demo** → abre widget con `?tenant=...`
3. Recargar widget: debe verse paleta + logo (MSW o API real)

**Limitación actual:** preview en vivo antes de guardar requiere `POST /admin/branding/preview` expuesto al widget (fase 2).

## Repo a ignorar para producto jugador

`social2game-player-demo` — sandbox; **no** desplegar en Netlify del widget.
