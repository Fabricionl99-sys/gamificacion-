/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEMO_TENANT_ID?: string;
  readonly VITE_USE_MOCKS?: string;
  readonly VITE_PILOT_SOCIAL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
