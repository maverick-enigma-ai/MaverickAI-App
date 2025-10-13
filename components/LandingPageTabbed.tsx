import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  BookOpen, 
  Smartphone, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Shield,
  Zap,
  Brain,
  LineChart,
  GraduationCap,
  MessageSquare,
  Building,
  Lightbulb,
  Camera
} from 'lucide-react';
import { MasterAppIcon } from './icons/MasterAppIcon';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEOHead, SEO_CONFIGS } from './SEOHead';
import { supabase } from '../utils/supabase/client';

type TabSection = 'services' | 'book' | 'app';

// ========================================
// LANDING PAGE CONTENT CONFIGURATION
// ========================================
// Edit these values to customize your landing page content
// This replaces the need for content-config.json

const LANDING_PAGE_CONFIG = {
  app: {
    badge: "Coming Soon - Beta Access Available",
    headline: "Decode Power Dynamics. Master Any Situation.",
    subheadline: "The revolutionary app that analyzes psychological power dynamics in real-time.",
    
    // Hero Radar (Large Logo) Control
    heroRadar: {
      enabled: false,       // Set to true to show large icon in hero
      size: "medium",       // Options: "small" (120px), "medium" (200px), "large" (300px)
      position: "left"      // Options: "left", "right"
    },
    
    // Call-to-Action Buttons
    cta: {
      primary: "Start Free Trial",
      secondary: "View Pricing"
    },
    
    // Stats displayed in hero
    stats: [
      { number: "10,000+", label: "Analysts" },
      { number: "99.9%", label: "Accuracy" },
      { number: "24/7", label: "Available" }
    ]
  }
};

interface LandingPageTabbedProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  onSignIn: () => void;
}

export function LandingPageTabbed({
  onGetStarted,
  onViewPricing,
  onSignIn
}: LandingPageTabbedProps) {
  const [activeTab, setActiveTab] = useState<TabSection>('services');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>(['services', 'book', 'app']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Insert email with interests into Supabase
      const payload = {
        email: email.toLowerCase().trim(),
        interests: interests,
        source: activeTab,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('waitlist')
        .insert(payload as any);

      if (error && error.code !== '23505') {
        // 23505 = duplicate email (we still show success)
        console.error('Waitlist error:', error);
        alert('Something went wrong. Please try again.');
        return;
      }

      console.log('✅ Waitlist signup:', email, 'Interests:', interests);
      setIsSubmitted(true);
      setEmail('');

      // Track with analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'waitlist_signup', {
          section: activeTab,
          interests: interests.join(',')
        });
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: TabSection) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
  <div className="min-h-screen bg-app relative">
    {/* [UI restore] ambient radar blobs */}
    <div className="pointer-events-none absolute inset-0">
      <div className="bg-radar w-80 h-80 rounded-full absolute left-[8%] top-[14%] animate-spin-slow" />
      <div className="bg-radar w-96 h-96 rounded-full absolute right-[10%] bottom-[8%] animate-spin-slow" />
    </div>

      {/* Dynamic SEO based on active tab */}
      <SEOHead {...SEO_CONFIGS[activeTab]} />

      {/* Fixed Navigation */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl ring-1 ring-cyan-400/10 shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all duration-700 relative">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <button
        onClick={() => setActiveTab('services')}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        data-name="btn_logo"
      >
        <MasterAppIcon size={56} />
        <div className="text-left">
          <h1
  className="text-white transition-all duration-700 hover:text-cyan-300 hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
>
  MaverickAI Enigma Radar™
</h1>
<p className="text-cyan text-xs opacity-90 transition-opacity duration-700 hover:opacity-100">
  Psychological Intelligence Platform
</p>
        </div>
      </button>
    </div>
  </div>

  {/* ✨ Cyan shimmer line at bottom */}
  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
</nav>


            {/* Desktop: Tab Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-2 rounded-xl transition-all btn-press ${
                  activeTab === 'services'
                    ? 'bg-cyan text-navy'
                    : 'bg-glass text-white/80 hover:text-white hover:bg-glass-strong'
                }`}
                data-name="btn_tab_services"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Services</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('book')}
                className={`px-6 py-2 rounded-xl transition-all btn-press ${
                  activeTab === 'book'
                    ? 'bg-purple text-white'
                    : 'bg-glass text-white/80 hover:text-white hover:bg-glass-strong'
                }`}
                data-name="btn_tab_book"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>The Book</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('app')}
                className={`px-6 py-2 rounded-xl transition-all btn-press ${
                  activeTab === 'app'
                    ? 'bg-gradient-to-r from-cyan to-teal text-navy'
                    : 'bg-glass text-white/80 hover:text-white hover:bg-glass-strong'
                }`}
                data-name="btn_tab_app"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>The App</span>
                </div>
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={onSignIn}
              className="px-6 py-2 rounded-xl bg-glass border border-border-cyan text-white hover:bg-glass-strong transition-all btn-press"
              data-name="btn_sign_in"
            >
              Sign In
            </button>
          </div>
  )
          {/* Mobile: Tab Navigation */}
          <div className="md:hidden flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 px-4 py-2 rounded-xl transition-all btn-press text-sm ${
                activeTab === 'services'
                  ? 'bg-cyan text-navy'
                  : 'bg-glass text-white/80'
              }`}
              data-name="btn_tab_services_mobile"
            >
              Services
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`flex-1 px-4 py-2 rounded-xl transition-all btn-press text-sm ${
                activeTab === 'book'
                  ? 'bg-purple text-white'
                  : 'bg-glass text-white/80'
              }`}
              data-name="btn_tab_book_mobile"
            >
              Book
            </button>

            <button
              onClick={() => setActiveTab('app')}
              className={`flex-1 px-4 py-2 rounded-xl transition-all btn-press text-sm ${
                activeTab === 'app'
                  ? 'bg-gradient-to-r from-cyan to-teal text-navy'
                  : 'bg-glass text-white/80'
              }`}
              data-name="btn_tab_app_mobile"
            >
              App
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area with smooth transitions */}
      <div className="pt-32 md:pt-24">
        <AnimatePresence mode="wait">
          {activeTab === 'services' && (
            <ServicesSection
              key="services"
              onGetStarted={onGetStarted}
              onJoinWaitlist={() => {
                const waitlistSection = document.getElementById('waitlist');
                waitlistSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'book' && (
            <BookSection
              key="book"
              onPreOrder={() => {
                const waitlistSection = document.getElementById('waitlist');
                waitlistSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'app' && (
            <AppSection
              key="app"
              onGetStarted={onGetStarted}
              onViewPricing={onViewPricing}
              config={LANDING_PAGE_CONFIG.app}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Unified Waitlist Section */}
      <section id="waitlist" className="py-20 px-6 bg-gradient-to-b from-transparent to-navy/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-white text-4xl mb-4">Join the Waiting List</h2>
          <p className="text-white/70 text-lg mb-8">
            Get early access to our services, book pre-orders, and the revolutionary Enigma Radar app.
          </p>

          {isSubmitted ? (
            <div className="rounded-2xl bg-glass-strong border border-border-cyan p-8 backdrop-blur-md">
              <CheckCircle className="w-16 h-16 text-cyan mx-auto mb-4" />
              <h3 className="text-white text-2xl mb-2">You're on the list!</h3>
              <p className="text-white/70">
                We'll notify you as soon as we launch. Check your email for confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-6">
              {/* Interest Selection */}
              <div className="flex flex-wrap gap-3 justify-center">
                <p className="text-white/60 text-sm w-full mb-2">I'm interested in:</p>
                
                <button
                  type="button"
                  onClick={() => toggleInterest('services')}
                  className={`px-4 py-2 rounded-xl transition-all btn-press ${
                    interests.includes('services')
                      ? 'bg-cyan text-navy'
                      : 'bg-glass border border-border text-white/60'
                  }`}
                  data-name="btn_interest_services"
                >
                  <div className="flex items-center gap-2">
                    {interests.includes('services') && <CheckCircle className="w-4 h-4" />}
                    <span>Advisory Services</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleInterest('book')}
                  className={`px-4 py-2 rounded-xl transition-all btn-press ${
                    interests.includes('book')
                      ? 'bg-purple text-white'
                      : 'bg-glass border border-border text-white/60'
                  }`}
                  data-name="btn_interest_book"
                >
                  <div className="flex items-center gap-2">
                    {interests.includes('book') && <CheckCircle className="w-4 h-4" />}
                    <span>The Book</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleInterest('app')}
                  className={`px-4 py-2 rounded-xl transition-all btn-press ${
                    interests.includes('app')
                      ? 'bg-gradient-to-r from-cyan to-teal text-navy'
                      : 'bg-glass border border-border text-white/60'
                  }`}
                  data-name="btn_interest_app"
                >
                  <div className="flex items-center gap-2">
                    {interests.includes('app') && <CheckCircle className="w-4 h-4" />}
                    <span>The App</span>
                  </div>
                </button>
              </div>

              {/* Email Input */}
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-6 py-4 rounded-xl bg-glass border border-border text-white placeholder:text-white/40 focus:border-cyan focus:outline-none transition-colors"
                  data-name="input_waitlist_email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || interests.length === 0}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg hover:shadow-cyan/50 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                  data-name="btn_waitlist_submit"
                >
                  {isSubmitting ? 'Joining...' : 'Join Now'}
                </button>
              </div>

              <p className="text-white/40 text-sm">
                By joining, you'll receive updates about all selected areas. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
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
              <p className="text-white/60 text-sm max-w-sm">
                Decode power dynamics, master strategy, and make confident decisions with the world's first AI-powered psychological intelligence platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-cyan transition-colors">
                    Advisory Services
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('book')} className="hover:text-cyan transition-colors">
                    The Book
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('app')} className="hover:text-cyan transition-colors">
                    The App
                  </button>
                </li>
                <li>
                  <button onClick={onViewPricing} className="hover:text-cyan transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <a href="mailto:hello@maverickenigma.com" className="hover:text-cyan transition-colors">
                    hello@maverickenigma.com
                  </a>
                </li>
                <li>
                  <button onClick={onSignIn} className="hover:text-cyan transition-colors">
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-white/40 text-sm">
            <p>© 2025 MaverickAI Enigma Radar™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========================================
// SERVICES SECTION
// ========================================

function ServicesSection({ 
  onJoinWaitlist 
}: { 
  onGetStarted?: () => void;
  onJoinWaitlist: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-purple/10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-cyan/20 border border-border-cyan text-cyan text-sm mb-6">
              Strategic Advisory & Training
            </div>
            
            <h1 className="text-white text-5xl md:text-6xl mb-6 leading-tight">
              Transform Decision-Making<br />
              <span className="text-cyan">Through Psychological Intelligence</span>
            </h1>
            
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium advisory services for executives, negotiators, and strategic decision-makers. 
              Learn to decode power dynamics and master high-stakes situations.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onJoinWaitlist}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg hover:shadow-cyan/50 transition-all btn-press"
                data-name="btn_services_get_started"
              >
                <div className="flex items-center gap-2">
                  <span>Schedule Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              <button
                onClick={() => {
                  const servicesSection = document.getElementById('service-offerings');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-all btn-press"
                data-name="btn_view_services"
              >
                View Services
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap gap-8 justify-center mt-12 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <Users className="w-4 h-4 text-cyan" />
                <span>500+ Executives Coached</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <TrendingUp className="w-4 h-4 text-cyan" />
                <span>$2B+ Deals Advised</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Award className="w-4 h-4 text-cyan" />
                <span>98% Success Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Offerings */}
      <section id="service-offerings" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl mb-4">Premium Services</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Tailored programs for executives, teams, and organizations seeking strategic advantage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Executive Coaching */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-glass border border-border-cyan p-8 backdrop-blur-md hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan/20 border border-border-cyan flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-cyan" />
              </div>
              
              <h3 className="text-white text-2xl mb-3">Executive Coaching</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                One-on-one coaching for C-suite executives. Master psychological power dynamics in board rooms, negotiations, and strategic decisions.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <span>12-week intensive program</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <span>Weekly 1-on-1 sessions</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <span>Real-time situation analysis</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <span>Confidential strategy sessions</span>
                </li>
              </ul>

              <button
                onClick={onJoinWaitlist}
                className="w-full px-6 py-3 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
                data-name="btn_coaching_inquire"
              >
                Inquire Now
              </button>
            </motion.div>

            {/* Strategic Consulting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-glass border border-border-purple p-8 backdrop-blur-md hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple/20 border border-border-purple flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-purple" />
              </div>
              
              <h3 className="text-white text-2xl mb-3">Strategic Consulting</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Expert advisory for high-stakes negotiations, M&A deals, and critical business decisions. Deploy psychological intelligence at scale.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>Deal-by-deal engagement</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>Stakeholder analysis & profiling</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>Negotiation strategy design</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>Live deal room support</span>
                </li>
              </ul>

              <button
                onClick={onJoinWaitlist}
                className="w-full px-6 py-3 rounded-xl bg-purple text-white hover:bg-purple/90 transition-all btn-press"
                data-name="btn_consulting_inquire"
              >
                Inquire Now
              </button>
            </motion.div>

            {/* Corporate Training */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-glass border border-border p-8 backdrop-blur-md hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal/20 border border-border flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-teal" />
              </div>
              
              <h3 className="text-white text-2xl mb-3">Corporate Training</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Team workshops and organizational programs. Build psychological intelligence capabilities across your leadership team.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span>Custom workshop design</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span>Team exercises & simulations</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span>Case study analysis</span>
                </li>
                <li className="flex items-start gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <span>Ongoing team support</span>
                </li>
              </ul>

              <button
                onClick={onJoinWaitlist}
                className="w-full px-6 py-3 rounded-xl bg-teal text-white hover:bg-teal/90 transition-all btn-press"
                data-name="btn_training_inquire"
              >
                Inquire Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-navy/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl mb-4">What Clients Say</h2>
            <p className="text-white/70 text-lg">
              Trusted by executives at Fortune 500 companies and high-growth startups.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This transformed how I approach board meetings. I now see the power dynamics before they unfold.",
                author: "Sarah Chen",
                title: "CEO, Tech Unicorn",
                rating: 5
              },
              {
                quote: "The negotiation framework added $50M to our deal value. Worth every penny.",
                author: "Michael Rodriguez",
                title: "M&A Director, PE Firm",
                rating: 5
              },
              {
                quote: "Finally, a coaching program that goes beyond surface-level leadership advice.",
                author: "Jennifer Park",
                title: "VP Strategy, F500",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-glass border border-border p-6 backdrop-blur-md"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                
                <p className="text-white/80 mb-4 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <p className="text-cyan">{testimonial.author}</p>
                  <p className="text-white/60 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Founder - Premium Card Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-white text-4xl mb-4">Meet Your Strategic Advisor</h2>
            <p className="text-white/70 text-lg">
              Leading psychological intelligence consulting backed by decades of experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            {/* Premium Founder Card with Circular Glow */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-purple via-deep-blue to-navy p-12 shadow-2xl shadow-cyan/30 border border-border-cyan backdrop-blur-md">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Photo with Beautiful Circular Glow */}
                  <div className="relative shrink-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-cyan shadow-lg shadow-cyan/50">
                      {/* TODO: Replace with actual founder photo URL */}
                      <div className="w-full h-full bg-gradient-to-br from-[#342FA5] to-[#14123F] flex items-center justify-center">
                        <svg className="w-20 h-20 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    {/* Beautiful circular glow effect behind photo */}
                    <div className="absolute inset-0 bg-cyan/30 rounded-full blur-2xl -z-10" />
                  </div>

                  {/* Bio Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-white text-3xl mb-2">Muhammad Qureshi</h3>
                    <p className="text-cyan text-lg mb-4">Founder & CEO, MaverickAI</p>
                    
                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      I help private equity funds, sovereign entities, and legacy brands unlock £10M–£50M in 
                      transformation value. With 25+ years across Booz & Co, The Office of Tony Blair, BP, and 
                      UAE SWF-backed firms, I've led end-to-end transformation and AI-enabled operating model 
                      redesigns across UK, GCC, and global markets.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-white/80">
                        <Award className="w-5 h-5 text-gold shrink-0" />
                        <span className="text-sm">Ex-Booz & Co | The Office of Tony Blair</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <GraduationCap className="w-5 h-5 text-cyan shrink-0" />
                        <span className="text-sm">Warwick MBA | MENSA-Certified (Top 3%)</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <TrendingUp className="w-5 h-5 text-teal shrink-0" />
                        <span className="text-sm">25+ Years | £50M+ Value Delivered</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <Camera className="w-5 h-5 text-purple shrink-0" />
                        <span className="text-sm">Featured in Amateur Photography Magazine (5 months after starting)</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <BookOpen className="w-5 h-5 text-pink shrink-0" />
                        <span className="text-sm">Author & App Developer (Inshallah)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {/* LinkedIn Badge */}
                      <a
                        href="https://linkedin.com/in/muhammad--qureshi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-glass-strong border border-border-cyan text-cyan hover:bg-cyan hover:text-navy transition-all btn-press"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Connect on LinkedIn
                      </a>

                      {/* Email Badge */}
                      <a
                        href="mailto:athar@maverickenigma.com"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-glass border border-border text-white/80 hover:bg-glass-strong hover:text-white transition-all btn-press"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Schedule Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-cyan/20 rounded-3xl blur-3xl -z-10" />
            </div>
          </motion.div>

          {/* Why Work With Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            <div className="rounded-2xl bg-glass border border-border-cyan p-6 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-border-cyan flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan" />
              </div>
              <h4 className="text-white text-lg mb-2">Absolute Confidentiality</h4>
              <p className="text-white/70 text-sm">
                Your strategies and insights remain completely private. NDAs standard for all engagements.
              </p>
            </div>

            <div className="rounded-2xl bg-glass border border-border-purple p-6 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-purple/20 border border-border-purple flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple" />
              </div>
              <h4 className="text-white text-lg mb-2">Results-Focused</h4>
              <p className="text-white/70 text-sm">
                Every engagement is measured by outcomes. We only succeed when you achieve your strategic goals.
              </p>
            </div>

            <div className="rounded-2xl bg-glass border border-border p-6 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-gold/20 border border-border flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-white text-lg mb-2">Elite Network</h4>
              <p className="text-white/70 text-sm">
                Access our network of C-suite executives, board members, and strategic advisors globally.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

// ========================================
// BOOK SECTION
// ========================================

function BookSection({ onPreOrder }: { onPreOrder: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple/10 via-transparent to-pink/10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-purple via-deep-blue to-navy p-8 shadow-2xl shadow-purple/50">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 mb-6">
                      <MasterAppIcon />
                    </div>
                    <h3 className="text-white text-3xl mb-2">The Enigma<br />Radar</h3>
                    <p className="text-cyan text-sm mb-8">Decode Power. Master Strategy.</p>
                  </div>
                  
                  <div>
                    <p className="text-white/60 text-sm mb-1">By Athar Qureshi</p>
                    <p className="text-white/40 text-xs">Founder, MaverickAI</p>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple/30 to-pink/30 rounded-2xl blur-3xl -z-10" />
            </motion.div>

            {/* Right: Book Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-purple/20 border border-border-purple text-purple text-sm mb-6">
                Pre-Order Now - Publishing Q2 2025
              </div>
              
              <h1 className="text-white text-5xl md:text-6xl mb-6 leading-tight">
                The Framework Behind<br />
                <span className="text-purple">The Revolution</span>
              </h1>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed">
                Learn the psychological intelligence frameworks that power the Enigma Radar platform. 
                Master the art of reading power, gravity, and risk in any situation.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-purple shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white mb-1">Decode Power Dynamics</h4>
                    <p className="text-white/60 text-sm">Understand who holds influence and how it flows in any situation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-purple shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white mb-1">Master Strategic Moves</h4>
                    <p className="text-white/60 text-sm">Learn the exact playbook used by top negotiators and executives</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LineChart className="w-6 h-6 text-purple shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white mb-1">Predict Outcomes</h4>
                    <p className="text-white/60 text-sm">Anticipate reactions and plan multiple moves ahead</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onPreOrder}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple to-pink text-white hover:shadow-lg hover:shadow-purple/50 transition-all btn-press"
                  data-name="btn_book_preorder"
                >
                  <div className="flex items-center gap-2">
                    <span>Pre-Order Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    const chaptersSection = document.getElementById('book-chapters');
                    chaptersSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-xl bg-glass border border-border-purple text-white hover:bg-glass-strong transition-all btn-press"
                  data-name="btn_read_preview"
                >
                  Read Preview
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book Chapters Preview */}
      <section id="book-chapters" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl mb-4">What's Inside</h2>
            <p className="text-white/70 text-lg">
              12 chapters covering the complete psychological intelligence framework.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { chapter: 1, title: "The Three Radars: Power, Gravity, Risk", description: "Introduction to the core framework" },
              { chapter: 2, title: "Reading Power Dynamics in Real-Time", description: "Practical techniques for situation analysis" },
              { chapter: 3, title: "The Gravity Indicator System", description: "Understanding momentum and influence" },
              { chapter: 4, title: "Risk Assessment Beyond Numbers", description: "Psychological risk calculation" },
              { chapter: 5, title: "Strategic Moves & Counter-Moves", description: "The tactical playbook" },
              { chapter: 6, title: "Board Room Psychology", description: "C-suite power dynamics decoded" },
              { chapter: 7, title: "Negotiation Intelligence", description: "Win high-stakes deals" },
              { chapter: 8, title: "Building Your Psychological Radar", description: "Daily practices and exercises" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-glass border border-border p-6 backdrop-blur-md hover:border-purple transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple/20 border border-border-purple flex items-center justify-center shrink-0">
                    <span className="text-purple">{item.chapter}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white mb-1">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="text-center pt-4">
              <p className="text-white/60 text-sm">+ 4 more chapters and exclusive case studies</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ========================================
// APP SECTION
// ========================================

function AppSection({ 
  onGetStarted, 
  onViewPricing,
  config
}: { 
  onGetStarted: () => void;
  onViewPricing: () => void;
  config: any;
}) {
  // Hero Radar configuration
  const heroRadar = config.heroRadar || { enabled: false, size: 'medium', position: 'left' };
  
  // Size mapping
  const sizeMap = {
    small: 120,
    medium: 200,
    large: 300
  };
  
  const radarSize = sizeMap[heroRadar.size as keyof typeof sizeMap] || 200;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-teal/10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`grid ${heroRadar.enabled ? 'md:grid-cols-2' : 'grid-cols-1'} gap-12 items-center`}>
            {/* Hero Radar Icon - Conditionally rendered */}
            {heroRadar.enabled && heroRadar.position === 'left' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <div style={{ width: radarSize, height: radarSize }}>
                  <MasterAppIcon size={radarSize} />
                </div>
              </motion.div>
            )}
            
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={heroRadar.enabled ? '' : 'text-center mx-auto max-w-4xl'}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-cyan/20 border border-border-cyan text-cyan text-sm mb-6">
                {config.badge || 'AI-Powered Intelligence Platform'}
              </div>
              
              <h1 className="text-white text-5xl md:text-6xl mb-6 leading-tight">
                {config.headline || 'Decode Power Dynamics.'}<br />
                <span className="text-cyan">Master Any Situation.</span>
              </h1>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed">
                {config.subheadline || 'The revolutionary app that analyzes psychological power dynamics in real-time. Get instant strategic insights for any business situation.'}
              </p>

              <div className={`flex flex-wrap gap-4 ${heroRadar.enabled ? 'justify-start' : 'justify-center'} mb-12`}>
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg hover:shadow-cyan/50 transition-all btn-press"
                  data-name="btn_app_start_trial"
                >
                  <div className="flex items-center gap-2">
                    <span>{config.cta?.primary || 'Start Free Trial'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button
                  onClick={onViewPricing}
                  className="px-8 py-4 rounded-xl bg-glass border border-border-cyan text-white hover:bg-glass-strong transition-all btn-press"
                  data-name="btn_app_pricing"
                >
                  {config.cta?.secondary || 'View Pricing'}
                </button>
              </div>

              {/* Social Proof */}
              <div className={`flex flex-wrap gap-8 ${heroRadar.enabled ? 'justify-start' : 'justify-center'} text-sm`}>
                {config.stats?.map((stat: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-white/70">
                    <Zap className="w-4 h-4 text-cyan" />
                    <span>{stat.number} {stat.label}</span>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="w-4 h-4 text-cyan" />
                      <span>10,000+ Analysts</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Zap className="w-4 h-4 text-cyan" />
                      <span>99.9% Accuracy</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Shield className="w-4 h-4 text-cyan" />
                      <span>24/7 Available</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Hero Radar Icon - Right position */}
            {heroRadar.enabled && heroRadar.position === 'right' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <div style={{ width: radarSize, height: radarSize }}>
                  <MasterAppIcon size={radarSize} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-navy/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-white text-4xl mb-4">See It In Action</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Watch how MaverickAI Enigma Radar transforms complex situations into clear strategic insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Video Player */}
            <div className="rounded-2xl bg-glass border border-border-cyan p-4 backdrop-blur-md">
              <div className="aspect-video rounded-xl overflow-hidden bg-navy/50 flex items-center justify-center">
                {/* Replace with actual video embed URL */}
                <div className="text-center p-8">
                  <Play className="w-16 h-16 text-cyan mx-auto mb-4" />
                  <p className="text-white/60 text-sm">
                    Upload your demo video to YouTube or Vimeo
                  </p>
                  <p className="text-white/40 text-xs mt-2">
                    Then update the videoUrl in content-config.json
                  </p>
                </div>
                {/* Uncomment when you have a video URL:
                <iframe
                  className="w-full h-full"
                  src="YOUR_YOUTUBE_OR_VIMEO_EMBED_URL"
                  title="Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                */}
              </div>
            </div>

            {/* Video Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-border-cyan flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-cyan" />
                </div>
                <div>
                  <h4 className="text-white mb-2">Real-time power analysis</h4>
                  <p className="text-white/60 text-sm">
                    Watch as the AI decodes complex power dynamics in seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple/20 border border-border-purple flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-purple" />
                </div>
                <div>
                  <h4 className="text-white mb-2">Instant strategic recommendations</h4>
                  <p className="text-white/60 text-sm">
                    Get actionable moves tailored to your specific situation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal/20 border border-border flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h4 className="text-white mb-2">Simple, intuitive interface</h4>
                  <p className="text-white/60 text-sm">
                    Powerful analysis without complexity - designed for busy executives
                  </p>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg transition-all btn-press"
                data-name="btn_video_cta"
              >
                <div className="flex items-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshots Gallery - Dynamic from Supabase */}
      <ScreenshotsGallery />

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl mb-4">Premium Intelligence Features</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Advanced AI analysis for strategic decision-making in real-time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "AI Radar Analysis",
                description: "Advanced AI decodes power dynamics, gravity indicators, and risk factors in any situation with 99.9% accuracy.",
                color: "cyan"
              },
              {
                icon: Brain,
                title: "Psychological Intel",
                description: "Deep analysis of motivations, influence patterns, and strategic positioning across all stakeholders.",
                color: "purple"
              },
              {
                icon: TrendingUp,
                title: "Predictive Insights",
                description: "Forecast likely outcomes and plan multiple moves ahead with AI-powered scenario analysis.",
                color: "teal"
              },
              {
                icon: Shield,
                title: "Risk Detection",
                description: "Real-time risk monitoring with early warning alerts for potential threats and opportunities.",
                color: "gold"
              },
              {
                icon: MessageSquare,
                title: "Strategic Guidance",
                description: "Instant recommendations for tactical moves, counter-strategies, and negotiation approaches.",
                color: "pink"
              },
              {
                icon: LineChart,
                title: "History & Patterns",
                description: "Track your analyses over time and identify recurring patterns in your strategic environment.",
                color: "cyan"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-glass border border-border-cyan p-8 backdrop-blur-md hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan/20 border border-border-cyan flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan" />
                </div>
                
                <h3 className="text-white text-xl mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-navy/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-4xl mb-4">Choose Your Power Level</h2>
            <p className="text-white/70 text-lg">
              Flexible plans for individuals and teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-glass border border-border p-8 backdrop-blur-md"
            >
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Basic</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">Free</span>
                </div>
                <p className="text-white/60">Perfect for trying out the platform</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>5 analyses per month</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Basic radar scores</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>30-day history</span>
                </li>
              </ul>
              
              <button
                onClick={onGetStarted}
                className="w-full px-6 py-3 rounded-xl bg-glass border border-border-cyan text-white hover:bg-glass-strong transition-all btn-press"
                data-name="btn_plan_free"
              >
                Get Started
              </button>
            </motion.div>

            {/* Premium Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-glass-strong border-2 border-cyan p-8 backdrop-blur-md relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan text-navy text-xs">
                Most Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">$79</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/60">For serious strategists</p>
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
                  <span>Full history & patterns</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Strategic recommendations</span>
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-cyan shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={onGetStarted}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg transition-all btn-press"
                data-name="btn_plan_premium"
              >
                Start Free Trial
              </button>
            </motion.div>

            {/* Professional Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-glass border border-border-purple p-8 backdrop-blur-md"
            >
              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">Professional</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-white text-4xl">$199</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/60">For teams and organizations</p>
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
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-5 h-5 text-purple shrink-0" />
                  <span>White-glove onboarding</span>
                </li>
              </ul>
              
              <button
                onClick={onViewPricing}
                className="w-full px-6 py-3 rounded-xl bg-purple text-white hover:bg-purple/90 transition-all btn-press"
                data-name="btn_plan_professional"
              >
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ========================================
// SCREENSHOTS GALLERY COMPONENT
// ========================================

interface Screenshot {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  gradient: string;
}

function ScreenshotsGallery() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScreenshots() {
      try {
        const { data, error } = await supabase
          .from('landing_screenshots')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(6);

        if (error) {
          console.error('Error fetching screenshots:', error);
          // Fallback to placeholder screenshots
          setScreenshots(getPlaceholderScreenshots());
        } else if (data && data.length > 0) {
          setScreenshots(data);
        } else {
          // No screenshots in database, use placeholders
          setScreenshots(getPlaceholderScreenshots());
        }
      } catch (err) {
        console.error('Failed to load screenshots:', err);
        setScreenshots(getPlaceholderScreenshots());
      } finally {
        setLoading(false);
      }
    }

    fetchScreenshots();
  }, []);

  const getPlaceholderScreenshots = (): Screenshot[] => [
    {
      id: '1',
      title: 'Intuitive Home Screen',
      description: 'Clean, premium interface that welcomes users with strategic scenario examples and seamless navigation to start their psychological analysis journey.',
      image_url: 'https://via.placeholder.com/600x400/14123F/00d4ff?text=Home+Screen',
      display_order: 1,
      gradient: 'from-cyan/20 to-navy'
    },
    {
      id: '2',
      title: 'Intelligent Input Interface',
      description: 'Sophisticated text input with smart file upload capabilities—analyze screenshots, emails, and documents with Vision AI for deeper insights.',
      image_url: 'https://via.placeholder.com/600x400/14123F/8b5cf6?text=Input+Screen',
      display_order: 2,
      gradient: 'from-purple/20 to-navy'
    },
    {
      id: '3',
      title: 'Visual Upload Experience',
      description: 'Award-winning file upload modal with real-time previews, supporting images and documents—making complex analysis as simple as drag and drop.',
      image_url: 'https://via.placeholder.com/600x400/14123F/14b8a6?text=File+Upload',
      display_order: 3,
      gradient: 'from-teal/20 to-navy'
    },
    {
      id: '4',
      title: 'Severity Assessment Dashboard',
      description: 'Beautiful battery-bar visualization showing Power, Gravity, and Risk scores with color-coded severity levels and instant strategic insights.',
      image_url: 'https://via.placeholder.com/600x400/14123F/f59e0b?text=Assessment',
      display_order: 4,
      gradient: 'from-gold/20 to-navy'
    },
    {
      id: '5',
      title: 'Strategic Analysis Engine',
      description: 'AI-powered strategic recommendations with power shift calculations, actionable next moves, and psychological intelligence that transforms how you navigate relationships.',
      image_url: 'https://via.placeholder.com/600x400/14123F/ec4899?text=Strategic+Plan',
      display_order: 5,
      gradient: 'from-pink/20 to-navy'
    },
    {
      id: '6',
      title: 'Premium PDF Export',
      description: 'Professional, branded PDF reports generated instantly—perfect for £50/month subscribers who need to document insights and share strategic analysis.',
      image_url: 'https://via.placeholder.com/600x400/14123F/a855f7?text=PDF+Export',
      display_order: 6,
      gradient: 'from-purple/20 to-navy'
    }
  ];

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan"></div>
            <p className="text-white/60 mt-4">Loading screenshots...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-4xl mb-4">Award-Winning Interface</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every screen designed with strategic decision-makers in mind—beautiful, powerful, and intuitive.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={screenshot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl bg-glass/50 border border-border/50 backdrop-blur-md overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan/20 hover:border-cyan/30 transition-all duration-500"
            >
              <div className="aspect-[9/16] bg-gradient-to-br from-navy/80 to-navy/40 relative overflow-hidden p-4 flex items-center justify-center">
                <ImageWithFallback
                  src={screenshot.image_url}
                  alt={screenshot.title}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl shadow-black/50"
                />
              </div>
              <div className="p-6 bg-gradient-to-br from-navy/60 to-navy/80">
                <h4 className="text-white mb-3 text-xl group-hover:text-cyan transition-colors duration-300">{screenshot.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action after screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan/20 to-purple/20 border border-cyan/30">
            <Star className="w-5 h-5 text-gold" />
            <span className="text-white/90 text-sm">Submitted to Figma Awards 2025</span>
            <Star className="w-5 h-5 text-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}