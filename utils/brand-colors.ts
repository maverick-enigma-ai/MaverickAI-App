/**
 * 🎨 MAVERICKĀI ENIGMA RADAR™ - BRAND COLOR SYSTEM
 * 
 * Direct HEX values for exact visual consistency
 * Use these instead of Tailwind classes for brand colors
 * 
 * VERSION: 2.1 - FIGMA BASELINE MATCH (Updated: Oct 2025)
 * ⚠️ HARD RELOAD (Cmd+Shift+R / Ctrl+Shift+F5) TO SEE CHANGES
 */

export const BRAND_COLORS = {
  // Primary Brand Colors
  navy: '#14123F',
  deepBlue: '#342FA5',
  cyan: '#06b6d4',           // EXACT FIGMA CYAN (Tailwind cyan-500) ✨
  cyanBright: '#00d4ff',     // Brighter cyan for accents
  cyanText: '#22D3EE',       // Cyan-400 for text readability
  blue: '#3b82f6',           // EXACT FIGMA BLUE (Tailwind blue-500) ✨
  teal: '#14b8a6',
  purple: '#8b5cf6',
  gold: '#fbbf24',
  pink: '#ec4899',
  green: '##00ff99',

  // Gradients - EXACT FIGMA MATCH ✨
  gradients: {
    background: 'linear-gradient(to bottom, #14123F 0%, #342FA5 50%, #14123F 100%)',
    backgroundHorizontal: 'linear-gradient(135deg, #14123F 0%, #342FA5 100%)',
    
    // PRIMARY BUTTON GRADIENT (Start Analysis, Sign In) - EXACT FIGMA
    cyanBlue: 'linear-gradient(to right, #06b6d4, #3b82f6)',
    
    // ALTERNATE GRADIENT (Purple to Cyan) - EXACT FIGMA
    purpleCyan: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    
    // Legacy gradients (keep for compatibility)
    cyan: 'linear-gradient(135deg, #00d4ff 0%, #22D3EE 100%)',
    cyanTeal: 'linear-gradient(135deg, #00d4ff 0%, #14b8a6 100%)',
    purple: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    radar: 'linear-gradient(to bottom right, #00d4ff, #8b5cf6, #14b8a6)',
  },

  // Glass Effects
  glass: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    normal: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
    intense: 'rgba(255, 255, 255, 0.25)',
  },

  // Borders
  borders: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    normal: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
    cyan: 'rgba(0, 212, 255, 0.3)',
    purple: 'rgba(139, 92, 246, 0.3)',
    teal: 'rgba(20, 184, 166, 0.3)',
  },

  // Text Colors with Alpha - MOBILE OPTIMIZED FOR READABILITY
  text: {
    white: '#ffffff',
    whiteBright: 'rgba(255, 255, 255, 0.95)',     // Almost white - high readability
    whiteSubtle: 'rgba(255, 255, 255, 0.85)',     // Increased from 0.7 for mobile
    whiteFaded: 'rgba(255, 255, 255, 0.7)',       // Increased from 0.5 for mobile
    whiteVeryFaded: 'rgba(255, 255, 255, 0.5)',   // Increased from 0.3 for mobile
    light: '#E2E8F0',
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#00d4ff',
  },
} as const;

/**
 * Common style objects for consistency
 */
export const BRAND_STYLES = {
  // Frosted Glass Card
  glassCard: {
    background: BRAND_COLORS.glass.normal,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${BRAND_COLORS.borders.normal}`,
    borderRadius: '24px',
  },

  // Premium Glass Card
  glassCardPremium: {
    background: BRAND_COLORS.glass.strong,
    backdropFilter: 'blur(30px) saturate(200%)',
    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
    border: `1px solid ${BRAND_COLORS.borders.cyan}`,
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)',
  },

  // Background Gradient
  backgroundGradient: {
    background: BRAND_COLORS.gradients.background,
    minHeight: '100vh',
  },

  // Cyan Glow
  cyanGlow: {
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
  },

  // Purple Glow
  purpleGlow: {
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
  },
} as const;

/**
 * ────────────────────────────────────────────────────────────────────────────────
 * LEGACY ALIASES (read-only)
 * Keeps old token names working without touching existing code.
 * Map any legacy references to the closest current brand tokens.
 * ────────────────────────────────────────────────────────────────────────────────
 */
export const LEGACY_COLORS = {
  // Legacy text tokens
  text: {
    // was: BRAND_COLORS.text.light
    light: BRAND_COLORS.text.whiteSubtle,
    // common legacy “muted” usage
    muted: BRAND_COLORS.text.whiteFaded,
    // convenience: direct white
    white: BRAND_COLORS.text.white,
  },

  // Legacy background tokens
  background: {
    navy: BRAND_COLORS.navy,
    deepBlue: BRAND_COLORS.deepBlue,
    // typical “glass” background fallback
    glass: BRAND_COLORS.glass.normal,
  },

  // Legacy border tokens
  border: {
    default: BRAND_COLORS.borders.normal,
    cyan: BRAND_COLORS.borders.cyan,
    purple: BRAND_COLORS.borders.purple,
    teal: BRAND_COLORS.borders.teal,
  },

  // Common flat colors referenced in legacy code
  yellow: BRAND_COLORS.gold,   // legacy “yellow” → current “gold”
  cyan: BRAND_COLORS.cyan,
  purple: BRAND_COLORS.purple,
  teal: BRAND_COLORS.teal,
  blue: BRAND_COLORS.blue,
} as const;
