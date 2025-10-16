// ═══════════════════════════════════════════════════════════════
// 🌍 ENVIRONMENT ADAPTER - WORKS EVERYWHERE!
// ═══════════════════════════════════════════════════════════════
// Date: October 9, 2025
// Purpose: Abstract environment variable access across platforms
// Supports: Figma Make, Vercel, GitHub, Local Dev
// ═══════════════════════════════════════════════════════════════

/**
 * Detects the current runtime environment
 */
// --- Safe global declarations for hybrid builds ---
declare const Deno:
  | { env: { get: (key: string) => string | undefined } }
  | undefined;
declare const window: any;

export type RuntimeEnvironment = 'deno' | 'vite' | 'vercel' | 'unknown';

export function detectEnvironment(): RuntimeEnvironment {
  // Check for Deno (Supabase Edge Functions - server side)
  if (typeof Deno !== 'undefined') {
    return 'deno';
  }
  
  // Check for Vercel (Node.js environment)
  if (typeof process !== 'undefined' && process.env?.VERCEL === '1') {
    return 'vercel';
  }
  
  // Check for Vite (Figma Make / browser - import.meta.env exists)
  // This is the default for Figma Make
  if (typeof window !== 'undefined') {
    return 'vite';
  }
  
  return 'unknown';
}

/**
 * Gets an environment variable value regardless of platform
 * 
 * Usage:
 * const apiKey = getEnv('OPENAI_API_KEY');
 * const apiKey = getEnv('VITE_OPENAI_API_KEY'); // Also works
 */
export function getEnv(key: string): string | undefined {
  const env = detectEnvironment();
  
  // Try multiple variations of the key
  const variations = [
    key,
    key.startsWith('VITE_') ? key : `VITE_${key}`,
    key.startsWith('VITE_') ? key.replace('VITE_', '') : key,
  ];
  
  switch (env) {
    case 'deno':
      // Deno.env.get() - server side
      for (const variation of variations) {
        try {
          const value = Deno.env.get(variation);
          if (value) return value;
        } catch {
          // Ignore errors
        }
      }
      return undefined;
      
    case 'vite':
      // import.meta.env - Figma Make / Vite browser environment
      for (const variation of variations) {
        try {
          const value = (import.meta.env as Record<string, string>)?.[variation];
          if (value) return value;
        } catch {
          // Ignore errors
        }
      }
      return undefined;
      
    case 'vercel':
      // process.env - Node.js on Vercel
      for (const variation of variations) {
        try {
          if (typeof process !== 'undefined' && process.env?.[variation]) {
            return process.env[variation];
          }
        } catch {
          // Ignore errors
        }
      }
      return undefined;
      
    default:
      return undefined;
  }
}

/**
 * Gets a required environment variable or throws
 */
export function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    const env = detectEnvironment();
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Current environment: ${env}\n` +
      `Make sure to set this in your environment configuration.`
    );
  }
  return value;
}

/**
 * Gets all Supabase credentials (works everywhere)
 */
export function getSupabaseConfig() {
  const env = detectEnvironment();
  
  // In Vite/Figma Make, use hardcoded values if env vars not found
  // This ensures compatibility with existing setup
  if (env === 'vite') {
    const url = getEnv('SUPABASE_URL') || 'https://aoedthlhvpxvxahpvnwy.supabase.co';
    const anonKey = getEnv('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZWR0aGxodnB4dnhhaHB2bnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzQzMDMsImV4cCI6MjA3NDc1MDMwM30.pmve6T0gX92SBmQQMfOCq5Zr4UCBYPGObGdh7zC1iZU';
    
    return {
      url,
      anonKey,
      serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'), // Optional for frontend
    };
  }
  
  // For other environments, require env vars
  return {
    url: getRequiredEnv('SUPABASE_URL'),
    anonKey: getRequiredEnv('SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'), // Optional for frontend
  };
}

/**
 * Gets OpenAI API key (works everywhere)
 */
export function getOpenAIKey(): string {
  return getRequiredEnv('OPENAI_API_KEY');
}

/**
 * Gets Stripe keys (works everywhere)
 */
export function getStripeConfig() {
  return {
    publishableKey: getRequiredEnv('STRIPE_PUBLISHABLE_KEY'),
    secretKey: getEnv('STRIPE_SECRET_KEY'), // Server-side only
  };
}

/**
 * Debug: Print all available environment variables
 */
export function debugEnv(): void {
  const env = detectEnvironment();
  console.log('🌍 Environment Adapter Status:');
  console.log('  Runtime:', env);
  console.log('  Window:', typeof window !== 'undefined' ? '✅' : '❌');
  console.log('  Deno:', typeof Deno !== 'undefined' ? '✅' : '❌');
  console.log('  Process:', typeof process !== 'undefined' ? '✅' : '❌');
  
  console.log('\n📋 Environment Variables:');
  
  const keys = [
    'SUPABASE_URL',
    'VITE_SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'VITE_OPENAI_API_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ];
  
  keys.forEach(key => {
    const value = getEnv(key);
    console.log(`  ${key}:`, value ? `✅ Set (${value.substring(0, 20)}...)` : '❌ Missing');
  });
}
