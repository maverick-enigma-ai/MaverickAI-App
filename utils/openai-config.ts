// utils/openai-config.ts
// Minimal, safe shim: no secrets here.

import { getEnv } from './env-adapter'

// If you want to keep IDs in env (not secrets), this will read them in browser too:
export const DEFAULT_MODEL = 'gpt-4o-mini'

export function getOpenAIAssistantID(): string | undefined {
  // Optional: read from env if you set it in Vercel as VITE_OPENAI_ASSISTANT_ID
  return getEnv('VITE_OPENAI_ASSISTANT_ID') || undefined
}

export function getOpenAIVectorStoreID(): string | undefined {
  // Optional: read from env if you set it in Vercel as VITE_OPENAI_VECTOR_STORE_ID
  return getEnv('VITE_OPENAI_VECTOR_STORE_ID') || undefined
}

// 🚫 Do not use the API key in the browser anymore.
// If anything still calls this, we want a loud runtime error so you can fix that call site.
export function getOpenAIKey(): never {
  throw new Error(
    'getOpenAIKey() must NOT be used in client code. Route requests to /api/analyze instead.'
  )
}
