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
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabase/client';
import { ProcessedAnalysis } from './types/analysis-types';
import { HistoryScan } from './types/history-types';
import { applyScreenshotPolicy } from './utils/screenshot-policy';
import * as analytics from './utils/analytics';
import { trackWithUser } from './utils/analytics-helpers';
import { SAMPLE_SCENARIOS, ScenarioCategory } from './types/sample-scenarios';

type AppState =
  | 'landing'
  | 'auth'
  | 'home'
  | 'radar'
  | 'processing'
  | 'dashboard'
  | 'profile'
  | 'history'
  | 'moves'
  | 'alerts'
  | 'sovereignty'
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'payment';

interface OnboardingPreferences {
  enabledScenarios: import('./types/sample-scenarios').ScenarioCategory[];
  showSampleScenarios: boolean;
  textSize: 'small' | 'normal' | 'large';
  enableAnalytics: boolean;
}

interface HistoryScan {
  id: string;
  createdAt: string;
  powerScore?: number;
  gravityScore?: number;
  riskScore?: number;
  powerExplanation?: string;
  gravityExplanation?: string;
  riskExplanation?: string;
  summary?: string;
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
  // NEW: DB-driven job tracking state
  const [jobId, setJobId] = useState<string | null>(null);
 
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
    import('./types/sample-scenarios').ScenarioCategory[]
  >(['corporate', 'personal', 'wealth', 'legal']);

  // Splash / onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    async function initUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setAppState('auth');
        setActiveTab('home');
        setSubmissionData({ text: '', files: [] });
        setViewingHistoricalScan(null);
        return;
      }

      const authUserId = session.user.id;
      const email = session.user.email;

      // Fetch or create user profile row
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, display_name, payment_plan, created_at, updated_at')
        .eq('id', authUserId)
        .single();

      if (!userData) {
        const { data: newUserData } = await supabase
          .from('users')
          .insert({
            id: authUserId,
            email,
            display_name: 'Strategic Analyst',
            payment_plan: 'basic',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('*')
          .single();

        setUser({
          email: newUserData?.email ?? session.user.email ?? email,
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

      // Optional: preload analytics id
      analytics.identify(session.user.id, { email: session.user.email || '' });
    }

    initUser();
  }, [hasHydrated]);

  const startTimer = (name: string) => {
    analytics.markTimer(name);
  };
  const endTimer = (name: string) => {
    return analytics.endTimer(name);
  };

  const handleOnboardingComplete = (preferences: OnboardingPreferences) => {
    // Persist onboarding prefs
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('onboardingPreferences', JSON.stringify(preferences));
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
    if (!user) {
      setAppState('auth');
      return;
    }

    // track and record submission
    setSubmissionData({ text, files });
    setIsSubmitting(true);
    setAnalysisError(null);

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

      // DB-DRIVEN FLOW: expect only { success, jobId } from API
      const result = await response.json();

      // OLD (synchronous) expectation:
      // if (!result.success || !result.data) throw new Error(result.error || 'Analysis failed');
      // analysisResults = result.data as ProcessedAnalysis;
      // const totalTime = endTimer('time_to_dashboard');
      // setCurrentAnalysis(analysisResults);
      // setAppState('dashboard'); // <-- CONFLICT: immediate navigation
      // setActiveTab('home');
      // analytics.trackTimeToDashboard(user.uid, user.email);
      // trackWithUser('analysis_completed', user.uid, user.email, {
      //   jobId: analysisResults.jobId,
      //   powerScore: analysisResults.powerScore,
      //   gravityScore: analysisResults.gravityScore,
      //   riskScore: analysisResults.riskScore,
      // });
      // trackWithUser('dashboard_viewed', user.uid, user.email, { is_historical: false });

      if (!result.success || !result.jobId) throw new Error(result.error || 'Analysis failed');

      // NEW: capture jobId and move to DebriefingScreen; Dashboard will show when DB flips to completed
      setJobId(result.jobId);
      setAppState('processing');
      setActiveTab('home');

      // Optional analytics: mark time-to-dashboard later when onCompleted fires

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

  const handleViewHistoricalScan = (scan: HistoryScan) => {
    setViewingHistoricalScan(scan);
    setSubmissionData({ text: scan.text, files: [] });

    if (scan.fullAnalysis) {
      setCurrentAnalysis(scan.fullAnalysis);
    } else {
      const minimal: ProcessedAnalysis = {
        jobId: scan.id,
        powerScore: scan.powerScore ?? 0,
        gravityScore: scan.gravityScore ?? 0,
        riskScore: scan.riskScore ?? 0,
        powerExplanation: scan.powerExplanation ?? '',
        gravityExplanation: scan.gravityExplanation ?? '',
        riskExplanation: scan.riskExplanation ?? '',
        summary: scan.summary ?? '',
        strategicTool: scan.strategicTool ?? '',
        radarRed1: scan.radarRed1 ?? '',
        radarRed2: scan.radarRed2 ?? '',
        radarRed3: scan.radarRed3 ?? '',
      } as any;
      setCurrentAnalysis(minimal);
    }

    setAppState('dashboard');
    setActiveTab('home');
    if (user) trackWithUser('history_scan_opened', user.uid, user.email, { scan_id: scan.id });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
        // no-op (placeholder)
        break;
      case 'alerts':
        setAppState('alerts');
        break;
      case 'sovereignty':
        setAppState('sovereignty');
        break;
      case 'settings':
        setAppState('settings');
        break;
      default:
        setAppState('home');
    }
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

  const handleAuthSuccess = (u: any) => {
    setUser(u);
    setAppState('home');
    setActiveTab('home');
    if (u) trackWithUser('user_authenticated', u.uid, u.email);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAppState('auth');
      setActiveTab('home');
      setSubmissionData({ text: '', files: [] });
      setViewingHistoricalScan(null);
      if (user) trackWithUser('user_signed_out', user.uid, user.email);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <NavigationBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onStartAnalysis={handleStartAnalysis}
        onSignOut={handleSignOut}
        user={user}
      />

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Landing / Auth */}
        {appState === 'landing' && (
          <>
            {ACTIVE_LANDING_PAGE === 'single' ? (
              <LandingPage onStart={handleStartAnalysis} />
            ) : (
              <LandingPageTabbed onStart={handleStartAnalysis} />
            )}
          </>
        )}

        {appState === 'auth' && (
          <AuthScreen
            onAuthenticated={handleAuthSuccess}
            onGoHome={handleGoHome}
            error={analysisError}
            onClearError={() => setAnalysisError(null)}
          />
        )}

        {/* Home + Radar */}
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
            // NEW: when submissions.status flips to 'completed', Debriefing calls onCompleted
            onCompleted={(analysisId) => {
              // OLD: we relied on immediate API payload and setCurrentAnalysis(...) here
              // setCurrentAnalysis(analysisResults); // <-- removed in DB-driven flow

              // NEW: navigate to dashboard; DashboardScreen should load by jobId/analysisId from DB
              setViewingHistoricalScan(null);
              setCurrentAnalysis(null); // source of truth = DB
              setAppState('dashboard');
              setActiveTab('home');

              // If you want to measure time-to-dashboard, stop the timer here
              analytics.trackTimeToDashboard(user.uid, user.email);
              trackWithUser('analysis_completed', user.uid, user.email, { jobId: jobId });
              trackWithUser('dashboard_viewed', user.uid, user.email, { is_historical: false });
            }}
          />
        )}

        {appState === 'dashboard' && (
          <DashboardScreen
            // NEW: DB-driven — Dashboard should fetch by jobId (passed below)
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
            onGoHome={handleGoHome}
            onStartAnalysis={handleStartAnalysis}
            onTabChange={handleTabChange}
          />
        )}

        {appState === 'history' && (
          <HistoryScreen
            user={user}
            onOpenScan={handleViewHistoricalScan}
            onGoHome={handleGoHome}
            onStartAnalysis={handleStartAnalysis}
            onTabChange={handleTabChange}
          />
        )}

        {appState === 'alerts' && (
          <AlertsInboxScreen
            user={user}
            onGoHome={handleGoHome}
            onStartAnalysis={handleStartAnalysis}
            onTabChange={handleTabChange}
          />
        )}

        {appState === 'sovereignty' && (
          <SovereigntyDashboardScreen
            user={user}
            onGoHome={handleGoHome}
            onStartAnalysis={handleStartAnalysis}
            onTabChange={handleTabChange}
          />
        )}

        {appState === 'settings' && (
          <SettingsScreen
            user={user}
            enabledScenarios={enabledScenarios}
            onChangeEnabledScenarios={setEnabledScenarios}
            onGoHome={handleGoHome}
            onStartAnalysis={handleStartAnalysis}
            onTabChange={handleTabChange}
          />
        )}

        {appState === 'privacy' && <PrivacyPolicyScreen onGoHome={handleGoHome} />}
        {appState === 'terms' && <TermsOfServiceScreen onGoHome={handleGoHome} />}

        {/* Onboarding modal */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 rounded-xl shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to The Maverick Enigma</h2>
              {/* ... onboarding form UI here ... */}
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                onClick={() =>
                  handleOnboardingComplete({
                    enabledScenarios,
                    showSampleScenarios: true,
                    textSize: 'normal',
                    enableAnalytics: true,
                  })
                }
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* First-time tooltip */}
        {showFirstTimeTooltip && (
          <div className="fixed bottom-6 right-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-4 max-w-sm">
            <div className="text-sm">
              <p className="font-semibold mb-2">Tip</p>
              <p>Describe the situation in your own words. You can also attach documents or emails to scan.</p>
            </div>
            <div className="flex justify-end mt-3">
              <button className="text-blue-400 hover:text-blue-300" onClick={handleTooltipClose}>
                Got it
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
