/**
 * Screenshot Prevention Utilities
 * 
 * NOTE: Screenshot prevention has limitations:
 * - WEB: Cannot prevent screenshots (browser security prevents this)
 * - MOBILE APPS (Capacitor): Can prevent screenshots using native plugins
 * 
 * This is a best-effort solution for mobile apps only.
 */

// Check if running in Capacitor (native mobile app)
const isCapacitor = () => {
  return typeof window !== 'undefined' && 
         (window as any).Capacitor !== undefined;
};

// Check if running on iOS
const isIOS = () => {
  return typeof window !== 'undefined' &&
         /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Check if running on Android
const isAndroid = () => {
  return typeof window !== 'undefined' &&
         /Android/.test(navigator.userAgent);
};

/**
 * Enable screenshot prevention (mobile only)
 * 
 * For Capacitor apps, this will:
 * - iOS: Set `isSecureTextEntry = true` on the view
 * - Android: Set `FLAG_SECURE` on the window
 * 
 * Returns: true if prevention was enabled, false if not supported
 */
export async function enableScreenshotPrevention(): Promise<boolean> {
  console.log('🔒 Attempting to enable screenshot prevention...');
  
  // Check if running in Capacitor
  if (!isCapacitor()) {
    console.log('⚠️ Screenshot prevention not available on web');
    console.log('💡 Users can take screenshots on web browsers');
    return false;
  }
  
  try {
    // Try to use @capacitor-community/privacy-screen plugin
    // This plugin must be installed separately: npm install @capacitor-community/privacy-screen
    const { PrivacyScreen } = (window as any).Capacitor.Plugins;
    
    if (PrivacyScreen) {
      await PrivacyScreen.enable();
      console.log('✅ Screenshot prevention enabled (Capacitor native)');
      return true;
    }
  } catch (error) {
    console.log('⚠️ PrivacyScreen plugin not available');
    console.log('💡 To enable: npm install @capacitor-community/privacy-screen');
  }
  
  // Fallback: Try to use Capacitor's built-in methods
  try {
    if (isAndroid()) {
      // For Android, we can use a custom plugin or native code
      console.log('📱 Android detected - screenshot prevention requires native plugin');
      console.log('💡 Add FLAG_SECURE in MainActivity.java');
      return false;
    }
    
    if (isIOS()) {
      // For iOS, screenshot prevention is limited
      console.log('📱 iOS detected - screenshot prevention requires native code');
      console.log('💡 iOS doesn\'t allow true screenshot prevention');
      return false;
    }
  } catch (error) {
    console.error('❌ Error enabling screenshot prevention:', error);
  }
  
  return false;
}

/**
 * Disable screenshot prevention (mobile only)
 */
export async function disableScreenshotPrevention(): Promise<void> {
  console.log('🔓 Disabling screenshot prevention...');
  
  if (!isCapacitor()) {
    return;
  }
  
  try {
    const { PrivacyScreen } = (window as any).Capacitor.Plugins;
    
    if (PrivacyScreen) {
      await PrivacyScreen.disable();
      console.log('✅ Screenshot prevention disabled');
    }
  } catch (error) {
    console.error('❌ Error disabling screenshot prevention:', error);
  }
}

/**
 * Check if user is on trial (basic plan)
 */
export function isTrialUser(paymentPlan: string): boolean {
  return paymentPlan === 'basic';
}

/**
 * Apply screenshot prevention based on user's payment plan
 * 
 * - Basic users (trial): Screenshot prevention enabled
 * - Premium/Professional: Screenshot prevention disabled
 */
export async function applyScreenshotPolicy(paymentPlan: string): Promise<void> {
  if (isTrialUser(paymentPlan)) {
    console.log('🔒 Trial user - enabling screenshot prevention');
    await enableScreenshotPrevention();
  } else {
    console.log('✅ Premium user - screenshots allowed');
    await disableScreenshotPrevention();
  }
}

/**
 * Add watermark overlay for trial users (web fallback)
 * This doesn't prevent screenshots but discourages sharing
 */
export function addTrialWatermark(containerId: string): HTMLElement | null {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // Check if watermark already exists
  if (container.querySelector('.trial-watermark')) {
    return null;
  }
  
  const watermark = document.createElement('div');
  watermark.className = 'trial-watermark';
  watermark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 80px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.05);
    pointer-events: none;
    z-index: 9999;
    user-select: none;
    white-space: nowrap;
  `;
  watermark.textContent = 'TRIAL VERSION';
  
  container.appendChild(watermark);
  return watermark;
}

/**
 * Remove watermark
 */
export function removeTrialWatermark(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const watermark = container.querySelector('.trial-watermark');
  if (watermark) {
    watermark.remove();
  }
}
