"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronDown, Info } from "lucide-react";
import { motion, useReducedMotion } from 'framer-motion';
import { BRAND_COLORS } from "../utils/brand-colors";

// --- Radar Visualization with tooltips & reduced motion support ---
const RadarViz = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeBlip, setActiveBlip] = useState<null | { label: string; info: string }>(null);

  const sweepTransition = shouldReduceMotion
    ? { duration: 0 }
    : { repeat: Infinity, duration: 4, ease: "linear" };

  const pulseTransition = shouldReduceMotion
    ? { duration: 0 }
    : { repeat: Infinity, repeatType: "mirror" as const, duration: 1.8 };

  const blips = [
    { cx: 60, cy: 80, r: 4, label: "CFO", info: "High Gravity · Budget Gatekeeper" },
    { cx: 120, cy: 110, r: 4, label: "CEO", info: "Narrative Owner · Final Call" },
    { cx: 160, cy: 55, r: 4, label: "Legal", info: "Veto Risk · Compliance" },
    { cx: 90, cy: 150, r: 4, label: "Ops", info: "Coalition Builder · Execution" },
  ];

  return (
    <div className="relative w-[min(92vw,360px)] h-[min(92vw,360px)] mx-auto touch-manipulation select-none">
      <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-2xl">
        {/* Background gradient */}
        <defs>
          <radialGradient id="rad-premium" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BRAND_COLORS.cyan} stopOpacity="0.25" />
            <stop offset="100%" stopColor={BRAND_COLORS.cyan} stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id="sweep-premium" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BRAND_COLORS.cyan} stopOpacity="0.0" />
            <stop offset="50%" stopColor={BRAND_COLORS.cyan} stopOpacity="0.4" />
            <stop offset="100%" stopColor={BRAND_COLORS.cyan} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Concentric rings */}
        {[40, 70, 100].map((rr, i) => (
          <motion.circle
            key={rr}
            cx="110"
            cy="110"
            r={rr}
            fill="none"
            stroke="url(#rad-premium)"
            strokeWidth={i === 2 ? 1.5 : 1}
            initial={{ opacity: 0.25 }}
            animate={shouldReduceMotion ? { opacity: 0.25 } : { opacity: [0.15, 0.35, 0.15] }}
            transition={{ ...pulseTransition, delay: i * 0.3 }}
          />
        ))}

        {/* Grid lines */}
        <line x1="10" y1="110" x2="210" y2="110" stroke={BRAND_COLORS.cyan} strokeOpacity="0.15" strokeWidth="1" />
        <line x1="110" y1="10" x2="110" y2="210" stroke={BRAND_COLORS.cyan} strokeOpacity="0.15" strokeWidth="1" />

        {/* Radar sweep */}
        <g transform="translate(110,110)">
          <motion.g animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }} transition={sweepTransition}>
            <path d="M0,0 L100,0 A100,100 0 0 1 0,100 Z" fill="url(#sweep-premium)" />
          </motion.g>
        </g>

        {/* Blips */}
        {blips.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={BRAND_COLORS.cyan}
            initial={{ opacity: 0.2, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 0.8, scale: 1 } : { opacity: [0.2, 1, 0.2], scale: [0.95, 1.25, 0.95] }}
            transition={{ ...pulseTransition, delay: i * 0.4 }}
            style={{ cursor: "pointer" }}
            onPointerEnter={() => setActiveBlip({ label: b.label, info: b.info })}
            onPointerLeave={() => setActiveBlip(null)}
            onTouchStart={() => setActiveBlip({ label: b.label, info: b.info })}
          >
            <title>{b.label}</title>
          </motion.circle>
        ))}

        {/* Outer glow */}
        <circle cx="110" cy="110" r="105" fill="none" stroke={BRAND_COLORS.cyan} strokeOpacity="0.25" />
      </svg>

      {/* Tooltip panel */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs flex items-center gap-2" style={{ color: BRAND_COLORS.cyanText }}>
        <Info size={14} />
        {activeBlip ? (
          <span className="whitespace-nowrap">{activeBlip.label} — {activeBlip.info}</span>
        ) : (
          <span className="whitespace-nowrap">Tap a blip to reveal influence</span>
        )}
      </div>
    </div>
  );
};

interface MaverickLandingPremiumProps {
  onGetStarted?: () => void;
  onViewPricing?: () => void;
  onSignIn?: () => void;
}

export default function MaverickLandingPremium({ 
  onGetStarted, 
  onViewPricing, 
  onSignIn 
}: MaverickLandingPremiumProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // smooth scroll handler for primary CTA
  const scrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // mobile viewport poly for iOS address bar changes
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div 
      className="min-h-[calc(var(--vh,1vh)*100)] flex flex-col items-center"
      style={{
        background: BRAND_COLORS.gradients.background,
        color: BRAND_COLORS.text.white
      }}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex items-center gap-3">
          <div 
            className="h-8 w-8 rounded-xl border"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal
            }}
          />
          <div className="leading-tight">
            <div className="text-sm" style={{ fontWeight: 600, color: BRAND_COLORS.text.white }}>
              MaverickAI Enigma Radar™
            </div>
            <div className="text-[11px]" style={{ color: BRAND_COLORS.cyanText }}>
              Psychological Intelligence Platform
            </div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a 
            href="#advisory" 
            className="hover:text-cyan-400 transition-colors"
            style={{ color: BRAND_COLORS.text.whiteSubtle }}
          >
            Advisory
          </a>
          <a 
            href="#framework" 
            className="hover:text-cyan-400 transition-colors"
            style={{ color: BRAND_COLORS.text.whiteSubtle }}
          >
            The Framework
          </a>
          <a 
            href="#app" 
            className="hover:text-cyan-400 transition-colors"
            style={{ color: BRAND_COLORS.text.whiteSubtle }}
          >
            The App
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={onSignIn}
            className="hidden md:inline-flex px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: BRAND_COLORS.gradients.cyanBlue,
              color: BRAND_COLORS.text.white,
              fontWeight: 600,
              border: 'none'
            }}
          >
            Sign In
          </Button>
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Open menu" 
            className="md:hidden h-10 w-10 grid place-items-center rounded-xl border"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal
            }}
          >
            <span className="block w-5 h-0.5 mb-1" style={{ background: BRAND_COLORS.text.white }}></span>
            <span className="block w-5 h-0.5 mb-1" style={{ background: BRAND_COLORS.text.white }}></span>
            <span className="block w-5 h-0.5" style={{ background: BRAND_COLORS.text.white }}></span>
          </button>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div 
            className="md:hidden absolute top-16 left-3 right-3 z-50 rounded-2xl border p-3 shadow-xl"
            style={{
              background: BRAND_COLORS.glass.strong,
              borderColor: BRAND_COLORS.borders.cyan,
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)'
            }}
          >
            <a 
              href="#advisory" 
              className="block px-3 py-3 rounded-xl transition-colors"
              style={{ color: BRAND_COLORS.text.whiteSubtle }}
              onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.intense}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Advisory
            </a>
            <a 
              href="#framework" 
              className="block px-3 py-3 rounded-xl transition-colors"
              style={{ color: BRAND_COLORS.text.whiteSubtle }}
              onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.intense}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              The Framework
            </a>
            <a 
              href="#app" 
              className="block px-3 py-3 rounded-xl transition-colors"
              style={{ color: BRAND_COLORS.text.whiteSubtle }}
              onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.intense}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              The App
            </a>
            <div className="pt-2">
              <Button 
                onClick={onSignIn}
                className="w-full rounded-xl transition-all"
                style={{
                  background: BRAND_COLORS.gradients.cyanBlue,
                  color: BRAND_COLORS.text.white,
                  border: 'none'
                }}
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Hero (Above-the-Fold) */}
      <section className="md:hidden w-full px-4 pt-2 max-w-xl">
        <div className="text-left">
          <div 
            className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] tracking-wide"
            style={{
              borderColor: BRAND_COLORS.borders.cyan,
              color: BRAND_COLORS.cyan,
              background: BRAND_COLORS.glass.normal
            }}
          >
            Strategic Intelligence for High‑Stakes Decisions
          </div>
          <h1 
            className="mt-3 text-3xl leading-tight"
            style={{ 
              fontWeight: 700,
              color: BRAND_COLORS.text.white 
            }}
          >
            See the power plays behind every decision.
          </h1>
          <p 
            className="mt-2 text-[13.5px]"
            style={{ color: BRAND_COLORS.text.whiteSubtle }}
          >
            Decode influence, predict moves, and control outcomes using psychological intelligence.
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="scale-[0.9]">
            <RadarViz />
          </div>
        </div>

        <p 
          className="mt-2 text-[12px] text-center"
          style={{ color: BRAND_COLORS.text.whiteSubtle }}
        >
          <span style={{ color: BRAND_COLORS.cyan }}>Live map of influence</span> — updates in real time.
        </p>

        <p 
          className="mt-3 text-[12px] text-center"
          style={{ color: BRAND_COLORS.text.whiteSubtle }}
        >
          Built by a former Tier 1 strategy consultant with <span style={{ fontWeight: 600, color: BRAND_COLORS.text.white }}>25+ years</span> advising governments, investors, and multinationals.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({behavior:'smooth'})} 
            className="w-full py-3 rounded-xl transition-all"
            style={{
              background: BRAND_COLORS.gradients.cyanBlue,
              color: BRAND_COLORS.text.white,
              border: 'none'
            }}
          >
            Watch 30s Demo
          </Button>
          <a href="#compare" className="w-full">
            <Button 
              className="w-full py-3 rounded-xl transition-all"
              style={{
                background: 'transparent',
                border: `1px solid ${BRAND_COLORS.borders.cyan}`,
                color: BRAND_COLORS.cyan
              }}
            >
              See the Difference
            </Button>
          </a>
        </div>
      </section>

      {/* Desktop Hero Section */}
      <section className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mt-6 lg:mt-10 px-4 sm:px-6 lg:px-8 max-w-6xl w-full">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-4xl sm:text-5xl leading-tight"
            style={{ 
              fontWeight: 700,
              color: BRAND_COLORS.text.white 
            }}
          >
            See the Power Dynamics Others Miss.
          </motion.h1>
          <p 
            className="text-base sm:text-lg mt-4"
            style={{ color: BRAND_COLORS.text.whiteSubtle }}
          >
            Real-time psychological intelligence for executives and strategists. Decode influence, predict moves, and control the room.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-start justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-7">
            <Button 
              onClick={scrollToDemo} 
              className="px-6 py-3 rounded-xl transition-all"
              style={{
                background: BRAND_COLORS.gradients.cyanBlue,
                color: BRAND_COLORS.text.white,
                fontWeight: 600,
                border: 'none'
              }}
            >
              See It in Action
            </Button>
            <Button 
              className="px-6 py-3 rounded-xl transition-all"
              style={{
                background: 'transparent',
                border: `1px solid ${BRAND_COLORS.borders.cyan}`,
                color: BRAND_COLORS.cyan
              }}
            >
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm mt-6" style={{ color: BRAND_COLORS.text.whiteSubtle }}>
            <span>⚡ 500+ Executives Coached</span>
            <span>💼 $2B+ Deals Advised</span>
            <span>🎯 98% Success Rate</span>
          </div>
        </div>

        {/* Radar Visualization */}
        <Card 
          className="rounded-2xl p-2 border"
          style={{
            background: BRAND_COLORS.glass.strong,
            borderColor: BRAND_COLORS.borders.cyan,
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            boxShadow: `0 15px 40px rgba(0, 0, 0, 0.25), 0 8px 20px ${BRAND_COLORS.cyan}15`
          }}
        >
          <CardContent className="p-6 flex justify-center items-center">
            <RadarViz />
          </CardContent>
        </Card>
      </section>

      {/* Demo Section */}
      <section id="demo" className="w-full max-w-6xl mt-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 
              className="text-2xl sm:text-3xl mb-3"
              style={{ 
                fontWeight: 600,
                color: BRAND_COLORS.text.white 
              }}
            >
              Watch the 30‑Second Demo
            </h2>
            <p 
              className="mb-6"
              style={{ color: BRAND_COLORS.text.whiteSubtle }}
            >
              See the Enigma Radar read a live scenario, surface hidden agendas, and recommend the next best move.
            </p>
            <ul 
              className="text-sm space-y-2 list-disc list-inside"
              style={{ color: BRAND_COLORS.text.whiteSubtle }}
            >
              <li>Auto-identifies power centers and coalitions</li>
              <li>Flags veto risks and influence routes</li>
              <li>Outputs a calm, 3‑move plan</li>
            </ul>
          </div>
          <Card 
            className="rounded-2xl overflow-hidden border"
            style={{
              background: BRAND_COLORS.glass.strong,
              borderColor: BRAND_COLORS.borders.cyan,
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)'
            }}
          >
            <CardContent className="p-0">
              <div className="relative">
                <video 
                  className="w-full h-[240px] sm:h-[300px] lg:h-[360px] object-cover" 
                  src="/demo.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  preload="metadata" 
                />
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${BRAND_COLORS.navy}80, transparent)`
                  }}
                />
                <div 
                  className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: BRAND_COLORS.text.white
                  }}
                >
                  30s demo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scroll cue */}
      <div className="mt-6" style={{ color: BRAND_COLORS.cyan }}>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={28} />
        </motion.div>
      </div>

      {/* Sticky Bottom CTA (mobile) */}
      <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
        <div 
          className="flex gap-2 rounded-2xl border p-2 shadow-2xl"
          style={{
            background: BRAND_COLORS.glass.strong,
            borderColor: BRAND_COLORS.borders.cyan,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)'
          }}
        >
          <Button 
            onClick={() => document.getElementById('demo')?.scrollIntoView({behavior:'smooth'})} 
            className="flex-1 transition-all"
            style={{
              background: BRAND_COLORS.gradients.cyanBlue,
              color: BRAND_COLORS.text.white,
              border: 'none'
            }}
          >
            Watch 30s Demo
          </Button>
          <a href="#compare" className="flex-1">
            <Button 
              className="w-full transition-all"
              style={{
                background: 'transparent',
                border: `1px solid ${BRAND_COLORS.borders.cyan}`,
                color: BRAND_COLORS.cyan
              }}
            >
              See the Difference
            </Button>
          </a>
        </div>
      </div>

      <section id="why" className="max-w-4xl mt-16 text-center px-4 sm:px-6">
        <h2 
          className="text-2xl sm:text-3xl mb-4"
          style={{ 
            fontWeight: 600,
            color: BRAND_COLORS.text.white 
          }}
        >
          Why Power Dynamics Matter
        </h2>
        <p 
          className="text-base sm:text-lg leading-relaxed"
          style={{ color: BRAND_COLORS.text.whiteSubtle }}
        >
          You don't lose because you're wrong — you lose because the game started before you entered the room. The Enigma Radar reveals the hidden flows of power, influence, and intent so you can act three moves ahead.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card 
            className="border rounded-2xl"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <CardContent className="p-6 text-left">
              <h3 
                className="mb-2"
                style={{ 
                  color: BRAND_COLORS.cyan,
                  fontWeight: 600 
                }}
              >
                See What Others Miss
              </h3>
              <p 
                className="text-sm"
                style={{ color: BRAND_COLORS.text.whiteSubtle }}
              >
                Instantly map influence networks and emotional gravity in any situation.
              </p>
            </CardContent>
          </Card>
          <Card 
            className="border rounded-2xl"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <CardContent className="p-6 text-left">
              <h3 
                className="mb-2"
                style={{ 
                  color: BRAND_COLORS.purple,
                  fontWeight: 600 
                }}
              >
                Influence Without Force
              </h3>
              <p 
                className="text-sm"
                style={{ color: BRAND_COLORS.text.whiteSubtle }}
              >
                Shape decisions with precision and calm authority.
              </p>
            </CardContent>
          </Card>
          <Card 
            className="border rounded-2xl"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <CardContent className="p-6 text-left">
              <h3 
                className="mb-2"
                style={{ 
                  color: BRAND_COLORS.teal,
                  fontWeight: 600 
                }}
              >
                Stay Three Moves Ahead
              </h3>
              <p 
                className="text-sm"
                style={{ color: BRAND_COLORS.text.whiteSubtle }}
              >
                Anticipate reactions before they happen using AI-driven pattern recognition.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ChatGPT Comparison */}
      <section id="compare" className="max-w-5xl mt-20 text-center px-4 sm:px-6 pb-24">
        <h2 
          className="text-2xl sm:text-3xl mb-6"
          style={{ 
            fontWeight: 600,
            color: BRAND_COLORS.text.white 
          }}
        >
          ChatGPT Gives Answers. Enigma Radar Reveals Agendas.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card 
            className="border rounded-2xl"
            style={{
              background: BRAND_COLORS.glass.normal,
              borderColor: BRAND_COLORS.borders.normal,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <CardContent className="p-6">
              <h3 
                className="mb-2"
                style={{ 
                  color: BRAND_COLORS.text.whiteSubtle,
                  fontWeight: 600 
                }}
              >
                ChatGPT
              </h3>
              <ul 
                className="text-sm space-y-2 list-disc list-inside"
                style={{ color: BRAND_COLORS.text.whiteSubtle }}
              >
                <li>General-purpose assistant</li>
                <li>Great for drafting, summarizing, coding</li>
                <li>Static text output</li>
                <li>No model of live power/people dynamics</li>
              </ul>
            </CardContent>
          </Card>
          <Card 
            className="border rounded-2xl relative overflow-hidden"
            style={{
              background: BRAND_COLORS.glass.strong,
              borderColor: BRAND_COLORS.borders.cyan,
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              boxShadow: `0 15px 40px rgba(0, 0, 0, 0.25), 0 8px 20px ${BRAND_COLORS.cyan}15`
            }}
          >
            {/* Glow background */}
            <div 
              className="absolute inset-0 opacity-10 blur-xl"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${BRAND_COLORS.cyan}, transparent 60%)`
              }}
            />
            <CardContent className="p-6 relative z-10">
              <h3 
                className="mb-2"
                style={{ 
                  color: BRAND_COLORS.cyan,
                  fontWeight: 600 
                }}
              >
                Enigma Radar
              </h3>
              <ul 
                className="text-sm space-y-2 list-disc list-inside"
                style={{ color: BRAND_COLORS.text.whiteSubtle }}
              >
                <li>Specialized Psychological Intelligence Engine</li>
                <li>Maps stakeholders, gravity wells, and coalitions</li>
                <li>Flags veto risks and leverage routes</li>
                <li>Outputs a 3‑move influence plan with timing</li>
              </ul>
              <div 
                className="text-xs mt-3"
                style={{ color: BRAND_COLORS.cyanText }}
              >
                Works *with* ChatGPT — use GPT for content, Enigma for the power map.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
