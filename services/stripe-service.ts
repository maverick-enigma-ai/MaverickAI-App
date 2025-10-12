// Stripe Service - Frontend payment integration
// Handles Stripe Checkout sessions and subscription management

import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9398f716`;

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface SubscriptionStatus {
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';
  currentPlan: 'basic' | 'premium' | 'professional';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  planId: 'premium' | 'professional'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('🔵 Creating Stripe Checkout session...');
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Plan: ${planId}`);

    const response = await fetch(`${SERVER_URL}/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        userId,
        email,
        planId,
        successUrl: `${window.location.origin}?payment=success`,
        cancelUrl: `${window.location.origin}?payment=canceled`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Checkout session creation failed:', error);
      return { success: false, error: `Failed to create checkout session: ${error}` };
    }

    const data = await response.json();
    
    if (!data.url) {
      return { success: false, error: 'No checkout URL received' };
    }

    console.log('✅ Checkout session created successfully');
    return { success: true, url: data.url };
  } catch (error) {
    console.error('💥 Checkout session error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession(
  userId: string,
  email: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('🔵 Creating Stripe Portal session...');
    console.log(`   User ID: ${userId}`);

    const response = await fetch(`${SERVER_URL}/stripe/create-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        userId,
        email,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Portal session creation failed:', error);
      return { success: false, error: `Failed to create portal session: ${error}` };
    }

    const data = await response.json();
    
    if (!data.url) {
      return { success: false, error: 'No portal URL received' };
    }

    console.log('✅ Portal session created successfully');
    return { success: true, url: data.url };
  } catch (error) {
    console.error('💥 Portal session error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(
  userId: string
): Promise<{ success: boolean; data?: SubscriptionStatus; error?: string }> {
  try {
    console.log('🔵 Fetching subscription status...');
    console.log(`   User ID: ${userId}`);

    const response = await fetch(`${SERVER_URL}/stripe/subscription-status?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Subscription status fetch failed:', error);
      return { success: false, error: `Failed to fetch subscription status: ${error}` };
    }

    const data = await response.json();
    console.log('✅ Subscription status retrieved');
    return { success: true, data };
  } catch (error) {
    console.error('💥 Subscription status error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 Canceling subscription...');
    console.log(`   User ID: ${userId}`);

    const response = await fetch(`${SERVER_URL}/stripe/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Subscription cancellation failed:', error);
      return { success: false, error: `Failed to cancel subscription: ${error}` };
    }

    console.log('✅ Subscription canceled (will end at period end)');
    return { success: true };
  } catch (error) {
    console.error('💥 Subscription cancellation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 Reactivating subscription...');
    console.log(`   User ID: ${userId}`);

    const response = await fetch(`${SERVER_URL}/stripe/reactivate-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Subscription reactivation failed:', error);
      return { success: false, error: `Failed to reactivate subscription: ${error}` };
    }

    console.log('✅ Subscription reactivated');
    return { success: true };
  } catch (error) {
    console.error('💥 Subscription reactivation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Helper: Redirect to Stripe Checkout
 */
export function redirectToCheckout(checkoutUrl: string): void {
  console.log('🔵 Redirecting to Stripe Checkout...');
  window.location.href = checkoutUrl;
}

/**
 * Helper: Redirect to Stripe Customer Portal
 */
export function redirectToPortal(portalUrl: string): void {
  console.log('🔵 Redirecting to Stripe Customer Portal...');
  window.location.href = portalUrl;
}
