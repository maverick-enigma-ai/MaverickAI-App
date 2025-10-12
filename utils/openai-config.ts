// ═══════════════════════════════════════════════════════════════
// 🔑 OPENAI API KEY CONFIGURATION
// ═══════════════════════════════════════════════════════════════
// Date: October 9, 2025
// Purpose: Centralized OpenAI API key management
// 
// IMPORTANT: When deploying to GitHub/Vercel, move this to .env!
// ═══════════════════════════════════════════════════════════════

import { getEnv, detectEnvironment } from './env-adapter';

/**
 * Get OpenAI API key with fallback for Figma Make
 * 
 * Priority:
 * 1. Environment variable (Vercel/Deno)
 * 2. Hardcoded key (Figma Make - temporary)
 * 
 * SECURITY NOTE:
 * - In production (Vercel), ALWAYS use environment variables
 * - Never commit API keys to GitHub
 * - This hardcoded key is ONLY for Figma Make prototyping
 */
export function getOpenAIKey(): string {
  const env = detectEnvironment();
  
  // Try to get from environment first
  const envKey = getEnv('OPENAI_API_KEY');
  if (envKey) {
    console.log('🔑 Using OpenAI key from environment variable');
    return envKey;
  }
  
  // Fallback for Figma Make
  if (env === 'vite') {
    console.warn('⚠️ Using hardcoded OpenAI key - move to .env for production!');
    
    // TODO: Add your OpenAI API key here for Figma Make testing
    // Get it from: https://platform.openai.com/api-keys
    const FIGMA_MAKE_OPENAI_KEY = ''; // NEVER COMMIT YOUR REAL KEY TO GITHUB!
    
    if (!FIGMA_MAKE_OPENAI_KEY) {
      throw new Error(
        'OpenAI API key not configured!\n\n' +
        'For Figma Make:\n' +
        '1. Get your key from: https://platform.openai.com/api-keys\n' +
        '2. Add it to /utils/openai-config.ts\n\n' +
        'For Vercel:\n' +
        '1. Add VITE_OPENAI_API_KEY to .env\n' +
        '2. Deploy to Vercel\n'
      );
    }
    
    return FIGMA_MAKE_OPENAI_KEY;
  }
  
  // No key found
  throw new Error(
    `OpenAI API key not found in environment: ${env}\n` +
    'Please set VITE_OPENAI_API_KEY or OPENAI_API_KEY'
  );
}

/**
 * Check if OpenAI key is configured
 */
export function hasOpenAIKey(): boolean {
  try {
    getOpenAIKey();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get OpenAI Assistant ID with fallback for Figma Make
 * 
 * Priority:
 * 1. Environment variable (Vercel/Deno)
 * 2. Hardcoded ID (Figma Make - temporary)
 * 
 * NOTE: Get your Assistant ID from https://platform.openai.com/assistants
 */
export function getOpenAIAssistantID(): string | undefined {
  const env = detectEnvironment();
  console.log('🔍 getOpenAIAssistantID() - Detected environment:', env);
  
  // Try to get from environment first
  const envId = getEnv('OPENAI_ASSISTANT_ID') || getEnv('VITE_OPENAI_ASSISTANT_ID');
  console.log('🔍 Environment variable check:', envId ? `Found: ${envId}` : 'Not found');
  
  if (envId) {
    console.log('🤖 Using OpenAI Assistant ID from environment variable');
    return envId;
  }
  
  // Fallback for Figma Make
  console.log('🔍 Checking fallback for env:', env);
  if (env === 'vite') {
    console.warn('⚠️ Using hardcoded OpenAI Assistant ID - move to .env for production!');
    
    // TODO: Add your OpenAI Assistant ID here for Figma Make testing
    // Get it from: https://platform.openai.com/assistants
    const FIGMA_MAKE_ASSISTANT_ID = 'asst_bVxC2UBTbXTvyqkQkFRY1hNc';  // Add your Assistant ID here
    
    console.log('🔍 Hardcoded ID value:', FIGMA_MAKE_ASSISTANT_ID);
    console.log('🔍 ID length:', FIGMA_MAKE_ASSISTANT_ID?.length);
    console.log('🔍 Is truthy?', !!FIGMA_MAKE_ASSISTANT_ID);
    
    if (!FIGMA_MAKE_ASSISTANT_ID) {
      console.error('❌ OpenAI Assistant ID not configured!');
      console.error('   Get your Assistant ID from: https://platform.openai.com/assistants');
      console.error('   Add it to /utils/openai-config.ts in FIGMA_MAKE_ASSISTANT_ID');
      return undefined;
    }
    
    console.log('✅ Returning hardcoded Assistant ID:', FIGMA_MAKE_ASSISTANT_ID);
    return FIGMA_MAKE_ASSISTANT_ID;
  }
  
  console.warn('⚠️ No Assistant ID found - env is not "vite"');
  console.log('🔍 Final env value:', env);
  return undefined;
}

/**
 * Get OpenAI Vector Store ID (optional - for your book/frameworks)
 * 
 * Priority:
 * 1. Environment variable (Vercel/Deno)
 * 2. Hardcoded ID (Figma Make - temporary)
 * 
 * NOTE: Get your Vector Store ID from https://platform.openai.com/storage
 */
export function getOpenAIVectorStoreID(): string | undefined {
  const env = detectEnvironment();
  
  // Try to get from environment first
  const envId = getEnv('OPENAI_VECTOR_STORE_ID') || getEnv('VITE_OPENAI_VECTOR_STORE_ID');
  if (envId) {
    console.log('📚 Using OpenAI Vector Store ID from environment variable');
    return envId;
  }
  
  // Fallback for Figma Make
  if (env === 'vite') {
    console.warn('⚠️ Using hardcoded OpenAI Vector Store ID (optional)');
    
    // TODO: Add your OpenAI Vector Store ID here (optional - for your book/frameworks)
    // Get it from: https://platform.openai.com/storage
    const FIGMA_MAKE_VECTOR_STORE_ID = 'vs_68ac9fd15834819187928de82e50c494';  // Add your Vector Store ID here (optional)
    
    // Vector store is optional - return undefined if not configured
    return FIGMA_MAKE_VECTOR_STORE_ID || undefined;
  }
  
  return undefined;
}
