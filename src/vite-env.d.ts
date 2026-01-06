/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more VITE_... env vars here if you have
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
