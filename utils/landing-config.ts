/**
 * Landing Page Configuration
 * 
 * Change the ACTIVE_LANDING_PAGE to switch between different landing page designs
 * Available options: 'tabbed', 'premium', 'basic'
 */

export type LandingPageType = 'tabbed' | 'premium' | 'basic';

// 👇 CHANGE THIS TO SWITCH LANDING PAGES
export const ACTIVE_LANDING_PAGE: LandingPageType = 'tabbed';

/**
 * Landing Page Registry
 * Maps landing page types to their component files
 */
export const LANDING_PAGE_REGISTRY = {
  'tabbed': 'LandingPageTabbed',
  'premium': 'MaverickLandingPremium', 
  'basic': 'LandingPage'
} as const;

/**
 * Get the active landing page component name
 */
export function getActiveLandingPage(): string {
  return LANDING_PAGE_REGISTRY[ACTIVE_LANDING_PAGE];
}
