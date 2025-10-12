import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize Stripe (will be configured with secret key from env)
let stripe: Stripe | null = null;

// Lazy initialize Stripe only when STRIPE_SECRET_KEY is available
function getStripe(): Stripe {
  if (!stripe) {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripe = new Stripe(stripeKey, {
      apiVersion: '2024-10-28.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return stripe;
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9398f716/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================================
// STRIPE PAYMENT ENDPOINTS
// ============================================================================

/**
 * Create Stripe Checkout Session for subscription
 */
app.post("/make-server-9398f716/stripe/create-checkout", async (c) => {
  try {
    const { userId, email, planId, successUrl, cancelUrl } = await c.req.json();

    console.log('🔵 Creating Stripe Checkout session');
    console.log('   User ID:', userId);
    console.log('   Plan ID:', planId);

    // Validate required fields
    if (!userId || !email || !planId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Define price IDs for each plan (you'll need to create these in Stripe Dashboard)
    const priceIds: Record<string, string> = {
      premium: Deno.env.get('STRIPE_PRICE_PREMIUM') ?? '',
      professional: Deno.env.get('STRIPE_PRICE_PROFESSIONAL') ?? '',
    };

    const priceId = priceIds[planId];
    if (!priceId) {
      return c.json({ error: 'Invalid plan ID' }, 400);
    }

    // Check if customer exists in Stripe
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = userData?.stripe_customer_id;

    const stripeClient = getStripe();

    // Create customer if doesn't exist
    if (!customerId) {
      console.log('   Creating new Stripe customer');
      const customer = await stripeClient.customers.create({
        email,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);

      console.log('   Stripe customer created:', customerId);
    }

    // Create Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
      },
    });

    console.log('✅ Checkout session created:', session.id);

    return c.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ Stripe Checkout error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Create Stripe Customer Portal Session
 */
app.post("/make-server-9398f716/stripe/create-portal", async (c) => {
  try {
    const { userId, returnUrl } = await c.req.json();

    console.log('🔵 Creating Stripe Portal session');
    console.log('   User ID:', userId);

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get customer ID from database
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!userData?.stripe_customer_id) {
      return c.json({ error: 'No Stripe customer found' }, 404);
    }

    const stripeClient = getStripe();

    // Create portal session
    const session = await stripeClient.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl,
    });

    console.log('✅ Portal session created');

    return c.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ Stripe Portal error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Get subscription status
 */
app.get("/make-server-9398f716/stripe/subscription-status", async (c) => {
  try {
    const userId = c.req.query('userId');

    console.log('🔵 Fetching subscription status');
    console.log('   User ID:', userId);

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get user data
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id, stripe_subscription_id, payment_plan')
      .eq('id', userId)
      .single();

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // If no subscription, return basic status
    if (!userData.stripe_subscription_id) {
      return c.json({
        status: 'none',
        currentPlan: userData.payment_plan || 'basic',
      });
    }

    const stripeClient = getStripe();

    // Fetch subscription from Stripe
    const subscription = await stripeClient.subscriptions.retrieve(
      userData.stripe_subscription_id
    );

    console.log('✅ Subscription status retrieved');

    return c.json({
      status: subscription.status,
      currentPlan: userData.payment_plan,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error: any) {
    console.error('❌ Subscription status error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Cancel subscription
 */
app.post("/make-server-9398f716/stripe/cancel-subscription", async (c) => {
  try {
    const { userId } = await c.req.json();

    console.log('🔵 Canceling subscription');
    console.log('   User ID:', userId);

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get subscription ID
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (!userData?.stripe_subscription_id) {
      return c.json({ error: 'No active subscription found' }, 404);
    }

    const stripeClient = getStripe();

    // Cancel at period end (don't cancel immediately)
    await stripeClient.subscriptions.update(
      userData.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    console.log('✅ Subscription will cancel at period end');

    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Subscription cancellation error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Reactivate subscription
 */
app.post("/make-server-9398f716/stripe/reactivate-subscription", async (c) => {
  try {
    const { userId } = await c.req.json();

    console.log('🔵 Reactivating subscription');
    console.log('   User ID:', userId);

    if (!userId) {
      return c.json({ error: 'Missing userId' }, 400);
    }

    // Get subscription ID
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (!userData?.stripe_subscription_id) {
      return c.json({ error: 'No subscription found' }, 404);
    }

    const stripeClient = getStripe();

    // Remove cancel_at_period_end flag
    await stripeClient.subscriptions.update(
      userData.stripe_subscription_id,
      {
        cancel_at_period_end: false,
      }
    );

    console.log('✅ Subscription reactivated');

    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Subscription reactivation error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Stripe Webhook Handler
 * Handles events from Stripe (payment success, subscription changes, etc.)
 */
app.post("/make-server-9398f716/stripe/webhook", async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    const body = await c.req.text();

    if (!signature) {
      return c.json({ error: 'No signature' }, 400);
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
      return c.json({ error: 'Webhook secret not configured' }, 500);
    }

    const stripeClient = getStripe();

    // Verify webhook signature
    const event = stripeClient.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('🔔 Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout completed:', session.id);

        // Get userId from metadata
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          // Update user's payment plan
          await supabase
            .from('users')
            .update({
              payment_plan: planId,
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          console.log('   User payment plan updated:', userId, '->', planId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🔄 Subscription updated:', subscription.id);

        // Find user by customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single();

        if (userData) {
          // Update subscription ID
          await supabase
            .from('users')
            .update({
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription canceled:', subscription.id);

        // Find user and downgrade to basic
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (userData) {
          await supabase
            .from('users')
            .update({
              payment_plan: 'basic',
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);

          console.log('   User downgraded to basic plan');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('⚠️ Payment failed for invoice:', invoice.id);

        // Find user by customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id, email')
          .eq('stripe_customer_id', invoice.customer as string)
          .single();

        if (userData) {
          console.log('   Payment failed for user:', userData.email);
          // You could send an email notification here
        }
        break;
      }
    }

    return c.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
    return c.json({ error: error.message }, 400);
  }
});

Deno.serve(app.fetch);