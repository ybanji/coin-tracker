/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API_KEY?: string;
  readonly VITE_COINGECKO_API_TIER?: "demo" | "pro";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
