import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { DebriefingScreen }  from './components/DebriefingScreen';
//import { DashboardScreen } from './components/DashboardScreen';
import DashboardScreen from './components/DashboardScreen';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AuthScreen } from './components/AuthScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './components/TermsOfServiceScreen';
import { NavigationBar } from './components/NavigationBar';
import { ACTIVE_LANDING_PAGE } from './utils/landing-config';
import { LandingPage } from './components/LandingPage';
import { LandingPageTabbed } from './components/LandingPageTabbed';
import { AlertsInboxScreen } from './components/AlertsInboxScreen';
import { SovereigntyDashboardScreen } from './components/SovereigntyDashboardScreen';
import { WhatIfLabScreen } from './components/WhatIfLabScreen';
import { ReflexTrainerScreen } from './components/ReflexTrainerScreen';
import { EnhancedRadarScreen } from './components/EnhancedRadarScreen';
import { OnboardingModal, OnboardingPreferences } from './components/OnboardingModal';
import { FirstTimeTooltip } from './components/FirstTimeTooltip';
import { ErrorModal } from './components/ErrorModal';
import { AnimatedSplashScreen } from './components/AnimatedSplashScreen';
//import { TestDashboard } from './components/TestDashboard';
import type { ProcessedAnalysis } from './services/runradar-service';
import { supabase } from './utils/supabase/client';
import { analytics, trackEvent, trackWithUser, startTimer, endTimer } from './services/analytics-service';
import { applyScreenshotPolicy } from './utils/screenshot-prevention';
 import('./types/sample-scenarios').ScenarioCategory[];

type AppState =
  | 'landing'
  | 'auth'
  | 'home'
  | 'radar'
  | 'processing'
  | 'dashboard'
  | 'profile'
  | 'history'
  | 'payment'
  | 'moves'
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'alerts'
  | 'sovereignty-dashboard'
  | 'whatif'
  | 'reflex'
  | 'enhanced-radar'
  | 'test';

interface HistoryScan {
  id: string;
  title: string;
  date: string;
  type: 'document' | 'image' | 'text';
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  confidenceLevel?: number;
  summary: string;
  whatsHappening?: string;
  whyItMatters?: string;
  immediateMove?: string;
  strategicTool?: string;
  radarRed1?: string;
  radarRed2?: string;
  radarRed3?: string;
  issueType?: string;
  issueCategory?: string;
  issueLayer?: string;
  files: { name: string; type: string }[];
  text: string;
  fullAnalysis?: ProcessedAnalysis;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);

  const [submissionData, setSubmissionData] = useState<{ text: string; files: File[] }>({
    text: '',
    files: [],
  });
  const [viewingHistoricalScan, setViewingHistoricalScan] = useState<HistoryScan | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ProcessedAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enabledScenarios, setEnabledScenarios] = useState<
  // NEW: DB-driven job tracking
  const [jobId, setJobId] = useState<string | null>(null);
  >(['corporate', 'personal', 'wealth', 'legal']);

  // Splash / onboarding state
  const [showSplash] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashKey, setSplashKey] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Feature flag (kept off)
  const [enableSovereigntyFeatures] = useState(false);

  // Auth state
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Load preferences
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.enabledScenarios) setEnabledScenarios(prefs.enabledScenarios);
        if (prefs.textSize) setTextSize(prefs.textSize);
      } catch {
        /* ignore */
      }
    }
    if (hasSeenOnboarding) return;
  }, []);

  // Apply text size preference
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
  }, [textSize]);

  // Simple route check — only for /icons hash/path
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      if (pathname === '/icons' || hash === '#icons') {
        setAppState('home'); // icon generator now accessed within app flow; adjust if you keep a separate page
      }
    };
    checkRoute();
    const handleHashChange = () => checkRoute();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Restore session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single();

          if (userData) {
            setUser({
              email: userData.email,
              displayName: userData.display_name,
              uid: userData.id,
              paymentPlan: userData.payment_plan,
            });

            setAppState((prev) => {
              if (prev === 'icons') return prev;
              return 'home';
            });
          }
        }
      } finally {
        setIsAppLoading(false);
      }
    };

    checkSession();
  }, []);

  // Auth handlers
  const handleSignIn = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr || !authData.user) {
        setAuthError(authErr?.message ?? 'Sign in failed');
        return;
      }

      const { data: userData, error: userError } = await supabase.from('users').select('*').eq('email', authData.user.email).single();

      if (userError || !userData) {
        const authUserId = authData.user.id;
        const { data: newUserData } = await supabase
          .from('users')
          .insert({
            id: authUserId,
            email: authData.user.email || email,
            display_name: authData.user.user_metadata?.name || 'Strategic Analyst',
            payment_plan: 'basic',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        setUser({
          email: newUserData?.email ?? authData.user.email ?? email,
          displayName: newUserData?.display_name ?? 'Strategic Analyst',
          uid: newUserData?.id ?? authUserId,
          paymentPlan: newUserData?.payment_plan ?? 'basic',
        });
      } else {
        await supabase.from('users').update({ updated_at: new Date().toISOString() }).eq('id', userData.id);
        setUser({
          email: userData.email,
          displayName: userData.display_name,
          uid: userData.id,
          paymentPlan: userData.payment_plan,
        });
      }

      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      } else {
        setAppState('home');
      }

      setActiveTab('home');

      const plan = (userData as any)?.payment_plan || 'basic';
      applyScreenshotPolicy(plan);

      trackWithUser('user_sign_in', (userData as any)?.id ?? authData.user.id, authData.user.email ?? email);
    } catch (e: any) {
      setAuthError(e?.message ?? 'An unexpected error occurred');
      trackEvent('auth_error', { error: e?.message ?? 'unknown', flow: 'sign_in' });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (authErr || !authData.user) {
        setAuthError(authErr?.message ?? 'Sign up failed');
        return;
      }

      const authUserId = authData.user.id;

      await new Promise((r) => setTimeout(r, 500));

      let { data: userData } = await supabase.from('users').select('*').eq('id', authUserId).single();

      if (!userData) {
        const { data: newUserData } = await supabase
          .from('users')
          .insert({
            id: authUserId,
            email: authData.user.email || email,
            display_name: name,
            payment_plan: 'basic',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        userData = newUserData ?? null;
      }

      setUser({
        email: userData?.email ?? authData.user.email ?? email,
        displayName: userData?.display_name ?? name,
        uid: userData?.id ?? authUserId,
        paymentPlan: userData?.payment_plan ?? 'basic',
      });

      setShowOnboarding(true);
      setActiveTab('home');
      applyScreenshotPolicy('basic');
      trackWithUser('user_sign_up', userData?.id ?? authData.user.id, authData.user.email ?? email, { displayName: name });
    } catch (e: any) {
      setAuthError(e?.message ?? 'An unexpected error occurred');
      trackEvent('auth_error', { error: e?.message ?? 'unknown', flow: 'sign_up' });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) setAuthError('Google sign-in not configured. Please use email/password for now.');
    } catch {
      setAuthError('Google sign-in not configured. Please use email/password for now.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin },
      });
      if (error) setAuthError('Apple sign-in not configured. Please use email/password for now.');
    } catch {
      setAuthError('Apple sign-in not configured. Please use email/password for now.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      if (error) setAuthError(error.message);
    } catch (e: any) {
      setAuthError(e?.message ?? 'Password reset failed');
    }
  };

  const handleDeleteAccount = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAppState('auth');
    setActiveTab('home');
    setSubmissionData({ text: '', files: [] });
    setViewingHistoricalScan(null);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setAppState('auth');
      setActiveTab('home');
      setSubmissionData({ text: '', files: [] });
      setViewingHistoricalScan(null);
    }
  };

  const handleSubscribe = async (planId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAppState('profile');
  };

  const handleOnboardingComplete = (preferences: OnboardingPreferences) => {
    setEnabledScenarios(preferences.enabledScenarios);
    setTextSize(preferences.textSize);
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setShowOnboarding(false);
    setAppState('home');

    if (user) {
      trackWithUser('onboarding_completed', user.uid, user.email, {
        showSampleScenarios: preferences.showSampleScenarios,
        scenariosCount: preferences.enabledScenarios.length,
        textSize: preferences.textSize,
        enableAnalytics: preferences.enableAnalytics,
      });
    }
  };

  const handleSubmit = async (text: string, files: File[]) => {
    if (isSubmitting) return;
    if (!user) {
      setAnalysisError('Please log in to submit an analysis.');
      return;
    }
    if (!text || text.trim().length < 10) {
      setAnalysisError('Please provide at least 10 characters describing your situation');
      return;
    }

    setIsSubmitting(true);
    setSubmissionData({ text, files });
    setViewingHistoricalScan(null);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setAppState('processing');

    startTimer('time_to_dashboard');

    trackWithUser('analysis_submitted', user.uid, user.email, {
      text_length: text.length,
      files_count: files.length,
      payment_plan: user.paymentPlan,
    });
    trackWithUser('processing_started', user.uid, user.email);

    try {
      let analysisResults: ProcessedAnalysis;

      // Get RLS JWT
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('No active session - please log in again');

      // Build request
      const body: any = { inputText: text, userId: user.uid, userEmail: user.email };
      if (files.length > 0) {
        const filesData = await Promise.all(
          files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
            return { name: file.name, type: file.type, size: file.size, data: base64 };
            })
        );
        body.files = filesData;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `API request failed: ${response.status}`);
      }

      // ---------- DB-DRIVEN RESPONSE (NEW) ----------
      const result = await response.json();

      // DB-DRIVEN: expect only { success, jobId } from /api/analyze
      if (!result.success || !result.jobId) throw new Error(result.error || 'Analysis failed');

      // NEW: capture jobId and keep Debriefing visible; Dashboard will show when DB flips to 'completed'
      setJobId(result.jobId);
      setAppState('processing');
      setActiveTab('home');

      // ---- OLD SYNCHRONOUS PATH (commented out, kept for reference) ---------------
      // const result = await response.json();
      // if (!result.success || !result.data) throw new Error(result.error || 'Analysis failed');
      // analysisResults = result.data as ProcessedAnalysis;
      // const totalTime = endTimer('time_to_dashboard');
      // setCurrentAnalysis(analysisResults);
      // setAppState('dashboard');
      // setActiveTab('home');
      //
      // analytics.trackTimeToDashboard(user.uid, user.email);
      // trackWithUser('analysis_completed', user.uid, user.email, {
      //   jobId: analysisResults.jobId,
      //   powerScore: analysisResults.powerScore,
      //   gravityScore: analysisResults.gravityScore,
      //   riskScore: analysisResults.riskScore,
      // });
      // trackWithUser('dashboard_viewed', user.uid, user.email, { is_historical: false });
      // ----------------------------------------------------------------------------- 
    } catch (e: any) {
      const msg = e?.message ?? 'Unknown error occurred';
      setAnalysisError(msg);
      setAppState('home');
      trackWithUser('submission_error', user.uid, user.email, { error: msg, exception: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setSubmissionData({ text: '', files: [] });
    setViewingHistoricalScan(null);
    setCurrentAnalysis(null);
    setAppState('radar');
    setActiveTab('radar');
  };

  const handleGoHome = () => {
    setSubmissionData({ text: '', files: [] });
    setViewingHistoricalScan(null);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setAppState('home');
    setActiveTab('home');
  };

  const handleRadarScan = () => {
    setViewingHistoricalScan(null);
    setAppState('radar');
    setActiveTab('radar');
  };

  const handleStartAnalysis = () => {
    setViewingHistoricalScan(null);
    setAppState('radar');
    setActiveTab('radar');

    const hasSeenTooltip = localStorage.getItem('hasSeenTooltip');
    if (!hasSeenTooltip) {
      setTimeout(() => setShowFirstTimeTooltip(true), 500);
    }

    if (user) trackWithUser('radar_scan_started', user.uid, user.email);
  };

  const handleTooltipClose = () => {
    localStorage.setItem('hasSeenTooltip', 'true');
    setShowFirstTimeTooltip(false);
    if (user) trackWithUser('tutorial_completed', user.uid, user.email);
  };

  const handleViewHistoricalScan = (scan: HistoryScan) => {
    setViewingHistoricalScan(scan);
    setSubmissionData({ text: scan.text, files: [] });

    if (scan.fullAnalysis) {
      setCurrentAnalysis(scan.fullAnalysis);
    } else {
      const analysis: ProcessedAnalysis = {
        id: scan.id,
        jobId: scan.id,
        userId: user?.uid || '',
        title: scan.title,
        inputText: scan.text,
        summary: scan.summary,
        powerScore: scan.powerScore,
        gravityScore: scan.gravityScore,
        riskScore: scan.riskScore,
        confidenceLevel: scan.confidenceLevel || 0,
        whatsHappening: scan.whatsHappening || scan.summary,
        whyItMatters: scan.whyItMatters || '',
        narrativeSummary: '',
        immediateMove: scan.immediateMove || '',
        strategicTool: scan.strategicTool || '',
        analyticalCheck: '',
        longTermFix: '',
        powerExplanation: '',
        gravityExplanation: '',
        riskExplanation: '',
        issueType: scan.issueType || '',
        issueCategory: scan.issueCategory || '',
        issueLayer: scan.issueLayer || '',
        status: 'completed',
        isReady: true,
        createdAt: scan.date,
        updatedAt: scan.date,
      };
      setCurrentAnalysis(analysis);
    }

    setAppState('dashboard');
    setActiveTab('home');

    if (user) {
      trackWithUser('historical_scan_viewed', user.uid, user.email, {
        scanId: scan.id,
        powerScore: scan.powerScore,
        gravityScore: scan.gravityScore,
        riskScore: scan.riskScore,
      });
      trackWithUser('dashboard_viewed', user.uid, user.email, { is_historical: true });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const navEvents: Record<string, any> = {
      home: 'nav_home',
      radar: 'nav_radar',
      profile: 'nav_profile',
      history: 'nav_history',
      moves: 'nav_settings',
    };

    if (user && navEvents[tab]) trackWithUser(navEvents[tab], user.uid, user.email);

    switch (tab) {
      case 'home':
        setAppState('home');
        if (user) trackWithUser('home_screen_viewed', user.uid, user.email);
        break;
      case 'radar':
        setViewingHistoricalScan(null);
        setAppState('radar');
        break;
      case 'profile':
        setAppState('profile');
        break;
      case 'history':
        setAppState('history');
        if (user) trackWithUser('history_screen_viewed', user.uid, user.email);
        break;
      case 'moves':
        setAppState('settings');
        break;
    }
  };

  const handleViewPrivacy = () => setAppState('privacy');
  const handleViewTerms = () => setAppState('terms');

  const handleBackFromLegal = () => {
    if (user) setAppState('profile');
    else setAppState('auth');
  };

  const handleToggleScenario = (category: import('./types/sample-scenarios').ScenarioCategory) => {
    setEnabledScenarios((prev) => {
      if (prev.includes(category)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Landing when not signed-in
  if (!user && appState === 'landing') {
    const handleLandingGetStarted = () => setAppState('auth');
    const handleLandingViewPricing = () => setAppState('auth');
    const handleLandingSignIn = () => setAppState('auth');

    switch (ACTIVE_LANDING_PAGE) {
      case 'tabbed':
        return (
          <div className="size-full">
            <LandingPageTabbed onGetStarted={handleLandingGetStarted} onViewPricing={handleLandingViewPricing} onSignIn={handleLandingSignIn} />
          </div>
        );
      case 'basic':
        return (
          <div className="size-full">
            <LandingPage onGetStarted={handleLandingGetStarted} onViewPricing={handleLandingViewPricing} onSignIn={handleLandingSignIn} />
          </div>
        );
      case 'premium':
        try {
          const MaverickLandingPremium = require('./components/MaverickLandingPremium').default;
          return (
            <div className="size-full">
              <MaverickLandingPremium onGetStarted={handleLandingGetStarted} onViewPricing={handleLandingViewPricing} onSignIn={handleLandingSignIn} />
            </div>
          );
        } catch {
          return (
            <div className="size-full">
              <LandingPageTabbed onGetStarted={handleLandingGetStarted} onViewPricing={handleLandingViewPricing} onSignIn={handleLandingSignIn} />
            </div>
          );
        }
      default:
        return (
          <div className="size-full">
            <LandingPageTabbed onGetStarted={handleLandingGetStarted} onViewPricing={handleLandingViewPricing} onSignIn={handleLandingSignIn} />
          </div>
        );
    }
  }

  // Auth screen (unless viewing legal pages/landing)
  if (!user && !['privacy', 'terms', 'landing'].includes(appState)) {
    return (
      <div className="size-full">
        <AuthScreen
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          onPasswordReset={handlePasswordReset}
          onViewPrivacy={handleViewPrivacy}
          onViewTerms={handleViewTerms}
          loading={isAuthLoading}
          error={authError}
          onClearError={() => setAuthError(null)}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatedSplashScreen key={splashKey} isLoading={isAppLoading} minimumDisplayTime={3500} />

      <div className="dark size-full bg-gradient-to-b from-navy via-deep-blue to-navy min-h-screen">
        <div className="pb-40">
          {appState === 'home' && (
            <HomeScreen onStartAnalysis={handleStartAnalysis} error={analysisError} onClearError={() => setAnalysisError(null)} />
          )}

          {appState === 'radar' && <ChatInterface onSubmit={handleSubmit} enabledScenarios={enabledScenarios} />}

          {appState === 'processing' && (
            <DebriefingScreen
              jobId={jobId!}
              inputText={submissionData.text}
              uploadedFiles={submissionData.files}
              onStartOver={handleStartOver}
              onGoHome={handleGoHome}
              onCompleted={(analysisId) => {
                setViewingHistoricalScan(null);
                setCurrentAnalysis(null); // source of truth is DB by job_id
                setAppState('dashboard');
                setActiveTab('home');
                if (user) {
                  analytics.trackTimeToDashboard(user.uid, user.email);
                  trackWithUser('analysis_completed', user.uid, user.email, { job_id: jobId });
                  trackWithUser('dashboard_viewed', user.uid, user.email, { is_historical: false });
                }
              }}
            />
          )}

          {appState === 'dashboard' && (
            <DashboardScreen
              jobId={jobId || (currentAnalysis?.jobId ?? null)}
              analysisData={currentAnalysis}
              inputText={submissionData.text}
              uploadedFiles={submissionData.files}
              isHistorical={!!viewingHistoricalScan}
              onGoHome={handleGoHome}
              onTabChange={handleTabChange}
              activeTab={activeTab}
              user={user}
            />
          )}

          {appState === 'profile' && (
            <ProfileScreen
              user={user}
              onSignOut={handleSignOut}
              onUpgrade={() => setAppState('payment')}
              onDeleteAccount={handleDeleteAccount}
              onViewPrivacy={handleViewPrivacy}
              onViewTerms={handleViewTerms}
              enabledScenarios={enabledScenarios}
              onToggleScenario={handleToggleScenario}
            />
          )}

          {appState === 'history' && user && <HistoryScreen onViewScan={handleViewHistoricalScan} userId={user.uid} />}

          {appState === 'payment' && user && (
            <PaymentScreen onSubscribe={handleSubscribe} onClose={() => setAppState('profile')} user={user} />
          )}

          {appState === 'settings' && (
            <SettingsScreen
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onRadarScan={handleRadarScan}
            />
          )}

          {appState === 'privacy' && <PrivacyPolicyScreen onBack={handleBackFromLegal} />}

          {appState === 'terms' && <TermsOfServiceScreen onBack={handleBackFromLegal} />}

          {/* Sovereignty features (flagged off by default) */}
          {appState === 'alerts' && enableSovereigntyFeatures && user && (
            <AlertsInboxScreen
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
              onViewAnalysis={() => setAppState('home')}
            />
          )}

          {appState === 'sovereignty-dashboard' && enableSovereigntyFeatures && user && (
            <SovereigntyDashboardScreen
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
            />
          )}

          {appState === 'whatif' && enableSovereigntyFeatures && user && (
            <WhatIfLabScreen
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
            />
          )}

          {appState === 'reflex' && enableSovereigntyFeatures && user && (
            <ReflexTrainerScreen
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
            />
          )}

          {appState === 'enhanced-radar' && enableSovereigntyFeatures && user && (
            <EnhancedRadarScreen
              onSubmit={handleSubmit}
              enabledScenarios={enabledScenarios}
              onBack={() => {
                setAppState('home');
                setActiveTab('home');
              }}
            />
          )}
        </div>

        {/* Bottom navigation (hidden on processing/dashboard/legal/sovereignty) */}
        {!['processing', 'dashboard', 'settings', 'privacy', 'terms', 'alerts', 'sovereignty-dashboard', 'whatif', 'reflex', 'enhanced-radar'].includes(
          appState
        ) &&
          user && (
            <div className="fixed bottom-0 left-0 right-0">
              <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} onRadarScan={handleRadarScan} />
            </div>
          )}

        {/* Onboarding */}
        <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />

        {/* First-Time Tooltip */}
        <FirstTimeTooltip isOpen={showFirstTimeTooltip && appState === 'radar'} onClose={handleTooltipClose} />
      </div>
    </>
  );
}