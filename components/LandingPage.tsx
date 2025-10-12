import { useState } from 'react';
import { Target, Brain, Shield, Zap, TrendingUp, Lock, CheckCircle, ArrowRight, Sparkles, Users, Crown } from 'lucide-react';
import { MasterAppIcon } from './icons/MasterAppIcon';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onViewPricing, onSignIn }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    // TODO: Connect to your email service (Mailchimp, ConvertKit, or Supabase)
    // For now, just log it
    console.log('Waitlist signup:', email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-deep-blue to-navy overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <MasterAppIcon />
              </div>
              <div>
                <h1 className="text-white text-lg">MaverickAI Enigma Radar™</h1>
                <p className="text-cyan text-xs">Psychological Intelligence Platform</p>
              </div>
            </div>
            
            {/* Nav Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm"
                data-name="btn_sign_in"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
                data-name="btn_get_started_nav"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/20 border border-border-purple mb-6">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-purple text-sm">Award-Winning Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-white text-5xl md:text-6xl mb-6 leading-tight">
            Decode Power Dynamics.<br />
            <span className="text-cyan">Master Any Situation.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            The world's first AI-powered psychological intelligence platform. Analyze power, gravity, and risk in real-time. Make strategic moves with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan to-teal text-white text-lg hover:scale-105 transition-all btn-press shadow-lg shadow-cyan/20"
              data-name="btn_get_started_hero"
            >
              <span className="flex items-center gap-2 justify-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            <button
              onClick={onViewPricing}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-glass border border-border text-white text-lg hover:bg-glass-strong transition-all btn-press"
              data-name="btn_view_pricing_hero"
            >
              View Pricing
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan" />
              <span>10,000+ Analysts</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal" />
              <span>99.9% Accuracy</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple" />
              <span>Bank-Level Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl mb-4">Premium Intelligence Features</h2>
            <p className="text-white/60 text-lg">Everything you need to master psychological power dynamics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1: Radar Analysis */}
            <div className="rounded-2xl bg-glass border border-border-cyan p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-border-cyan flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-cyan" />
              </div>
              <h3 className="text-white text-xl mb-3">AI Radar Analysis</h3>
              <p className="text-white/70 leading-relaxed">
                Advanced AI decodes power dynamics, gravity indicators, and risk factors in any situation with 99.9% accuracy.
              </p>
            </div>

            {/* Feature 2: Strategic Intelligence */}
            <div className="rounded-2xl bg-glass border border-border-purple p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple/20 border border-border-purple flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple" />
              </div>
              <h3 className="text-white text-xl mb-3">Strategic Moves</h3>
              <p className="text-white/70 leading-relaxed">
                Get immediate, long-term, and strategic recommendations tailored to your exact situation and power position.
              </p>
            </div>

            {/* Feature 3: Risk Protection */}
            <div className="rounded-2xl bg-glass border border-border p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal/20 border border-teal/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-white text-xl mb-3">Risk Protection</h3>
              <p className="text-white/70 leading-relaxed">
                Real-time risk assessment with predictive alerts. Know exactly what could go wrong before it happens.
              </p>
            </div>

            {/* Feature 4: Sovereignty Dashboard */}
            <div className="rounded-2xl bg-glass border border-border p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-white text-xl mb-3">Sovereignty Dashboard</h3>
              <p className="text-white/70 leading-relaxed">
                Track your power metrics over time. Weekly KPIs, monthly trends, and strategic insights at a glance.
              </p>
            </div>

            {/* Feature 5: What-If Lab */}
            <div className="rounded-2xl bg-glass border border-border-purple p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple/20 border border-border-purple flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple" />
              </div>
              <h3 className="text-white text-xl mb-3">What-If Lab</h3>
              <p className="text-white/70 leading-relaxed">
                Simulate scenarios and predict outcomes. Test different strategies before making your move.
              </p>
            </div>

            {/* Feature 6: Reflex Trainer */}
            <div className="rounded-2xl bg-glass border border-border-cyan p-8 backdrop-blur-md hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-border-cyan flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan" />
              </div>
              <h3 className="text-white text-xl mb-3">Reflex Trainer</h3>
              <p className="text-white/70 leading-relaxed">
                Daily drills to sharpen your strategic instincts. Build muscle memory for power dynamics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl mb-4">Choose Your Power Level</h2>
            <p className="text-white/60 text-lg">Professional-grade intelligence for every strategic need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="rounded-2xl bg-glass border border-border p-8 backdrop-blur-md">
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Basic</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">Free</span>
                </div>
                <p className="text-white/60">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>5 analyses per month</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Basic AI radar analysis</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Power, gravity, risk scores</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>7-day history</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full px-6 py-3 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-all btn-press"
                data-name="btn_select_basic"
              >
                Get Started Free
              </button>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-border-cyan p-8 backdrop-blur-md relative overflow-hidden">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan text-navy text-xs">
                Most Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">$79</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/80">For serious strategists</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Advanced AI intelligence</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>All Sovereignty features</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Unlimited history</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={onViewPricing}
                className="w-full px-6 py-3 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
                data-name="btn_select_premium"
              >
                Start Premium Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="rounded-2xl bg-glass border border-border-purple p-8 backdrop-blur-md">
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Professional</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">$199</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/60">For organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>Custom AI training</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <button
                onClick={onViewPricing}
                className="w-full px-6 py-3 rounded-xl bg-glass border border-border-purple text-white hover:bg-glass-strong transition-all btn-press"
                data-name="btn_select_professional"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan/10 to-purple/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/20 border border-border-purple mb-6">
            <Sparkles className="w-4 h-4 text-purple" />
            <span className="text-purple text-sm">Limited Early Access</span>
          </div>

          <h2 className="text-white text-4xl mb-4">Join the Waiting List</h2>
          <p className="text-white/80 text-lg mb-8">
            Be among the first to experience the future of psychological intelligence. 
            Early access members get exclusive features and lifetime discounts.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-glass border border-border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan"
                  data-name="input_waitlist_email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press disabled:opacity-50 whitespace-nowrap"
                  data-name="btn_join_waitlist"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-glass border border-border-cyan">
              <CheckCircle className="w-12 h-12 text-cyan mx-auto mb-4" />
              <h3 className="text-white text-xl mb-2">You're on the list! 🎉</h3>
              <p className="text-white/70">
                We'll notify you as soon as early access opens. Check your email for confirmation.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10">
                  <MasterAppIcon />
                </div>
                <div>
                  <h3 className="text-white">MaverickAI Enigma Radar™</h3>
                  <p className="text-cyan text-xs">Psychological Intelligence Platform</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Decode psychological power dynamics with AI-powered intelligence. 
                Make strategic moves with confidence.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white mb-3">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <button onClick={onGetStarted} className="hover:text-cyan transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={onViewPricing} className="hover:text-cyan transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 MaverickAI Enigma Radar™. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-cyan transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-white/40 hover:text-cyan transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="text-white/40 hover:text-cyan transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
