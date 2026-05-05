# iGaming Gamification Widget

Frontend embeddable del widget jugador para una plataforma SaaS multi-tenant de gamificacion iGaming. El producto expone una experiencia mobile-first con estetica dark cripto-futurista, tabs de progresion/social/competencia y modales de recompensa.

## Quick Start

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Demo interna:

```text
http://localhost:5173/demo
```

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Servidor local Vite. |
| `npm run build` | TypeScript + build ES code-split + build IIFE legacy. |
| `npm run lint` | ESLint del proyecto. |
| `npm test` | Vitest en modo CI local. |
| `npm run test:ci` | Vitest con coverage V8. |
| `npm run preview` | Preview del build. |

## Build outputs

`npm run build` genera:

- `dist/gamification-widget.es.js`: entry ES code-split para integraciones modernas.
- `dist/WidgetContainer-*.js`: shell lazy-loaded del widget.
- `dist/vendor-*.js`: vendors cacheables separados.
- `dist/gamification-widget.iife.js`: bundle monolitico legacy para `<script>`.
- `dist/gamification-widget.css`: estilos del widget.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Zustand
- React Router v6
- Framer Motion
- Lucide React
- React Hook Form + Zod
- Axios
- date-fns
- clsx + tailwind-merge
- Vitest + React Testing Library + jsdom

## Estructura

```text
src/
  api/                 Cliente y contratos mock/API
  components/
    layout/            Shell, header, navegacion responsive
    modals/            Recompensas y modales operativos
    profile/           Perfil propio, publico y privado
    settings/          Configuracion de gamificacion
    shared/            Cards/list items reutilizables
    tabs/              9 tabs principales
    ui/                Primitivos atomicos
  demo/                Pagina interna de QA visual
  hooks/               Hooks de dominio
  mocks/               Datos mock realistas
  store/               Zustand stores
  styles/              Tokens y global CSS
  types/               Tipos estrictos
  utils/               Formato y utilidades
```

## Integracion para operadores

Ver guia completa en [`docs/INTEGRATION.md`](docs/INTEGRATION.md).

## Feature flags

Los flags viven en `src/config/features.ts`.

- `feed_enabled`: controla si el tab Feed y sus accesos aparecen en el widget. Hoy queda en `false` porque Feed Social fue movido a Etapa 9; el codigo, mocks y tests del Feed se conservan para reactivarlo sin reconstruir la feature.

## Como contribuir

1. Crear una rama desde `main`.
2. Mantener cambios acotados al dominio del widget jugador.
3. No usar `localStorage`, `sessionStorage`, `useContext` global ni `any`.
4. Respetar tokens Tailwind/CSS y la escasez del verde de marca.
5. Ejecutar antes de abrir PR:

```bash
npm run build
npm run lint
npm test
```

6. Si se toca UI shared o store, actualizar tests y revisar coverage.
