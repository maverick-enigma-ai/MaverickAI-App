import { useState } from 'react';
import { Crown, Check, CreditCard, Zap, Shield, TrendingUp } from 'lucide-react';
import { createCheckoutSession, redirectToCheckout } from '../services/stripe-service';

interface PaymentScreenProps {
  onSubscribe: (planId: string) => Promise<void>;
  onClose: () => void;
  user: {
    uid: string;
    email: string;
  };
}

export function PaymentScreen({ onSubscribe, onClose, user }: PaymentScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'professional'>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 79,
      period: 'month',
      description: 'Advanced strategic intelligence',
      features: [
        'Unlimited scans',
        'Advanced psychological profiling',
        'Real-time analysis',
        'Priority support',
        'Custom reporting',
        'Historical data export'
      ],
      popular: true
    },
    {
      id: 'professional' as const,
      name: 'Professional',
      price: 199,
      period: 'month',
      description: 'Complete intelligence platform',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('🔵 Starting Stripe Checkout flow...');
      console.log('   User:', user.email);
      console.log('   Plan:', selectedPlan);
      
      // Create Stripe Checkout session
      const result = await createCheckoutSession(
        user.uid,
        user.email,
        selectedPlan
      );

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      console.log('✅ Checkout session created, redirecting to Stripe...');
      
      // Redirect to Stripe Checkout
      redirectToCheckout(result.url);
      
    } catch (err) {
      console.error('❌ Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start checkout';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] pb-24">
      {/* Header */}
      <div className="p-6 pt-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-white text-xl mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
          Upgrade to Premium
        </h1>
        <p className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Unlock the full power of psychological intelligence
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="px-6 space-y-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border transition-all min-h-[48px] text-left ${
              selectedPlan === plan.id
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/20 hover:bg-white/15'
            } ${plan.popular ? 'relative overflow-hidden' : ''}`}
            data-name={`plan_${plan.id}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                <span className="text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  POPULAR
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  {plan.name}
                </h3>
                <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {plan.description}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  ${plan.price}
                </div>
                <div className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  /{plan.period}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-cyan-100 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {selectedPlan === plan.id && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Selected
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Features Banner */}
      <div className="px-6 mt-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <h4 className="text-white mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Why Upgrade?
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Advanced AI models for deeper psychological insights
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Real-time analysis and instant strategic recommendations
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Enterprise-grade security and data protection
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-8 space-y-3">
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-cyan-600 disabled:to-blue-600 text-white py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 min-h-[56px] disabled:opacity-50"
          data-name="btn_subscribe"
        >
          <div className="flex items-center justify-center gap-3">
            <CreditCard className="w-5 h-5" />
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              {isProcessing ? 'Redirecting to Stripe...' : `Subscribe to ${plans.find(p => p.id === selectedPlan)?.name}`}
            </span>
          </div>
        </button>

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-4 rounded-full transition-all min-h-[56px] disabled:opacity-50"
          data-name="btn_close_payment"
        >
          <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Maybe Later
          </span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="px-6 mt-6 text-center">
        <p className="text-cyan-400/60 text-xs mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Secure payment powered by Stripe
        </p>
        <p className="text-cyan-400/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
