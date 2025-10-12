/**
 * MaverickAI Enigma Radar™ - App Constants
 * Single source of truth for app-wide values
 */

// ===== VERSION CONTROL =====
// Foundation Release (Core Platform) - Oct 5, 2025
export const APP_VERSION = '2.1.0';

// Sovereignty Features Version (Intelligence Expansion) - Oct 5, 2025
export const SOVEREIGNTY_VERSION = '1.1.0-beta.5';

// Combined version display
export const APP_VERSION_FULL = `v${APP_VERSION} + Sovereignty ${SOVEREIGNTY_VERSION}`;

// Version metadata
export const VERSION_INFO = {
  app: APP_VERSION,
  sovereignty: SOVEREIGNTY_VERSION,
  releaseDate: '2025-10-05',
  releaseName: 'Foundation + Sovereignty Beta Complete',
  features: {
    core: true,              // Core platform (v2.1.0)
    sovereignty: 'beta',     // Sovereignty features (beta)
    alerts: true,            // ✅ Alerts Inbox (v1.1.0-beta.1)
    dashboard: true,         // ✅ Sovereignty Dashboard (v1.1.0-beta.2)
    whatif: true,            // ✅ What-If Lab (v1.1.0-beta.3)
    reflex: true,            // ✅ Reflex Trainer (v1.1.0-beta.4)
    enhancedRadar: true      // ✅ Enhanced Radar (v1.1.0-beta.5)
  }
};

// ===== APP BRANDING =====
export const APP_NAME = 'MaverickAI Enigma Radar™';

export const APP_TAGLINE = 'Psychological Intelligence Platform';

export const APP_FULL_NAME = `${APP_NAME} ${APP_TAGLINE}`;
