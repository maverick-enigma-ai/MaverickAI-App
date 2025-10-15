import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { DebriefingScreen } from './components/DebriefingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AuthScreen } from './components/AuthScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './components/TermsOfServiceScreen';
import { NavigationBar } from './components/NavigationBar';
import { DebugPanel } from './components/DebugPanel';
import { IconGeneratorPage } from './components/IconGeneratorPage';
import { SandboxTestPage } from './components/SandboxTestPage';
import { LandingPage } from './components/LandingPage';
import { LandingPageTabbed } from './components/LandingPageTabbed';
//import MaverickLandingPremium from './components/MaverickLandingPremium';
import { AlertsInboxScreen } from './components/AlertsInboxScreen';
import { SovereigntyDashboardScreen } from './components/SovereigntyDashboardScreen';
import { WhatIfLabScreen } from './components/WhatIfLabScreen';
import { ReflexTrainerScreen } from './components/ReflexTrainerScreen';
import { EnhancedRadarScreen } from './components/EnhancedRadarScreen';
import { OnboardingModal, OnboardingPreferences } from './components/OnboardingModal';
import { FirstTimeTooltip } from './components/FirstTimeTooltip';
import { ErrorModal } from './components/ErrorModal';
import { AnimatedSplashScreen } from './components/AnimatedSplashScreen';
import { TestDashboard } from './components/TestDashboard';
import { useRunRadar } from './services/runradar-service';
import { submitTextAnalysis } from './services/openai-direct-service';
import { ProcessedAnalysis } from './types/runradar-api';
import { supabase } from './utils/supabase/client';
import { analytics, trackEvent, trackWithUser, startTimer, endTimer } from './services/analytics-service';
import { applyScreenshotPolicy } from './utils/screenshot-prevention';

// Development mode detection - Debug panel only shows in development
// Safe check for development environment (localhost or 127.0.0.1)
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.hostname.includes('localhost');

// 🔒 SECURITY: Sanitize sensitive data in production
const isProduction = !isDevelopment;
const sanitizeEmail = (email: string) => isProduction ? '[REDACTED]' : email;
const sanitizeUserId = (id: string) => isProduction ? `user-${id.slice(0, 8)}***` : id;

type AppState = 'landing' | 'auth' | 'home' | 'radar' | 'processing' | 'dashboard' | 'profile' | 'history' | 'payment' | 'moves' | 'settings' | 'privacy' | 'terms' | 'icons' | 'sandbox' | 'alerts' | 'sovereignty-dashboard' | 'whatif' | 'reflex' | 'enhanced-radar' | 'test';

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
  // Start with landing page instead of auth (change to 'auth' to skip landing)
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [submissionData, setSubmissionData] = useState<{
    text: string;
    files: File[];
  }>({ text: '', files: [] });
  const [viewingHistoricalScan, setViewingHistoricalScan] = useState<HistoryScan | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ProcessedAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enabledScenarios, setEnabledScenarios] = useState<import('./types/sample-scenarios').ScenarioCategory[]>(['corporate', 'personal', 'wealth', 'legal']);
  
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashKey, setSplashKey] = useState(0); // Key to force re-render splash
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Debug state
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  // 🆕 SOVEREIGNTY FEATURES - Feature flag (debug-only for now)
  const [enableSovereigntyFeatures, setEnableSovereigntyFeatures] = useState(false);
  
  // Auth error state
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // RunRadar integration
  const { submitAnalysis, testConnection, pingWebhook } = useRunRadar();

  // Check if user is first-time (using localStorage)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const hasSeenTooltip = localStorage.getItem('hasSeenTooltip');
    
    // Load saved preferences
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.enabledScenarios) setEnabledScenarios(prefs.enabledScenarios);
        if (prefs.textSize) setTextSize(prefs.textSize);
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
    
    // Don't show onboarding/tooltip if already seen
    if (hasSeenOnboarding && hasSeenTooltip) {
      return;
    }
  }, []);

  // Apply text size preference to document
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
  }, [textSize]);

  // Check for icon generator route (special route for downloading icons)
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      addDebugLog(`🔍 Route check - pathname: ${pathname}, hash: ${hash}`);
      
      if (pathname === '/icons' || hash === '#icons') {
        addDebugLog('🎨 Icons route detected');
        setAppState('icons');
      } else if (pathname === '/sandbox' || hash === '#sandbox') {
        addDebugLog('🧪 SANDBOX ROUTE DETECTED - Setting appState to sandbox');
        setAppState('sandbox');
      } else {
        addDebugLog(`ℹ️ No special route detected`);
      }
    };
    
    // Check on mount
    checkRoute();
    
    // Listen for hash changes
    const handleHashChange = () => {
      addDebugLog('🔄 Hash changed!');
      checkRoute();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          addDebugLog(`🔄 Restoring session for: ${session.user.email}`);
          
          // Fetch user profile
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUser({
              email: userData.email,
              displayName: userData.display_name,
              uid: userData.id,
              paymentPlan: userData.payment_plan
            });
            
            // DON'T override special routes (icons, sandbox)
            setAppState(prev => {
              if (prev === 'icons' || prev === 'sandbox') {
                addDebugLog(`✅ Session restored, preserving ${prev} route`);
                return prev;
              }
              addDebugLog(`✅ Session restored successfully`);
              return 'home';
            });
          }
        }
      } catch (error) {
        addDebugLog(`⚠️ Session check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        // Mark app as loaded after session check
        setIsAppLoading(false);
      }
    };

    checkSession();
  }, []);

  // Debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLogs(prev => [logEntry, ...prev].slice(0, 50)); // Keep last 50 logs
    console.log(logEntry);
  };

  // Test webhook connection with enhanced payload
  const handleTestWebhook = async () => {
    addDebugLog('🧪 Starting webhook test with ENHANCED PAYLOAD...');
    addDebugLog('📦 Sending complete payload format to Make.com');
    addDebugLog('🗄️ Make.com should write to Supabase submissions table');
    addDebugLog('🔍 Includes: job_id, session_id, query_id, answers_id, status, timestamps');
    try {
      const result = await testConnection();
      addDebugLog(`🔧 Test result: ${result.message}`);
      if (result.success) {
        addDebugLog('✅ Make.com received the enhanced payload!');
        addDebugLog('🔍 Now checking if Make.com wrote to database...');
        
        // Wait 3 seconds then check database
        setTimeout(async () => {
          try {
            const { data: testSubmissions } = await supabase
              .from('submissions')
              .select('id, query_id, status, created_at')
              .order('created_at', { ascending: false })
              .limit(1);
            
            if (testSubmissions && testSubmissions.length > 0) {
              const latest = testSubmissions[0];
              const ageSeconds = (Date.now() - new Date(latest.created_at).getTime()) / 1000;
              
              if (ageSeconds < 10) {
                addDebugLog('🎉 SUCCESS! Make.com wrote to submissions table!');
                addDebugLog(`   Latest submission: ${latest.query_id}`);
                addDebugLog(`   Status: ${latest.status}`);
                addDebugLog('✅ Make.com integration is working!');
              } else {
                addDebugLog('⚠️ No recent submission found (check Make.com execution history)');
              }
            } else {
              addDebugLog('❌ No submissions in database - Make.com did NOT write data');
              addDebugLog('🔧 Check Make.com scenario:');
              addDebugLog('   1. Is scenario ACTIVE (not paused)?');
              addDebugLog('   2. Did execution run? Check History tab');
              addDebugLog('   3. Are Supabase modules configured?');
            }
          } catch (error) {
            addDebugLog(`⚠️ Could not check database: ${error instanceof Error ? error.message : 'Unknown'}`);
          }
        }, 3000);
        
        addDebugLog('📋 Make.com should:');
        addDebugLog('   1. Insert to submissions table (status=pending)');
        addDebugLog('   2. Process with OpenAI');
        addDebugLog('   3. Insert to analyses table (is_ready=true)');
        addDebugLog('   4. Update submissions (status=completed)');
        addDebugLog('📖 See: /MAKE_COM_SUPABASE_INTEGRATION.md');
      }
    } catch (error) {
      addDebugLog(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Force submit - bypasses all checks for debugging
  const handleForceSubmit = async () => {
    addDebugLog('🚀 FORCE SUBMIT: Bypassing all checks...');
    addDebugLog('⚠️ Using hardcoded test data');
    
    try {
      const testText = "FORCE SUBMIT TEST: My colleague is undermining me in meetings. This has been happening for 2 months.";
      const testUserId = "f8800651-b2e7-4b1b-95da-3e9c92509ab2";
      const testEmail = "athar.qureshi1@outlook.com";
      
      addDebugLog(`📝 Text: ${testText.substring(0, 50)}...`);
      addDebugLog(`👤 User ID: ${testUserId}`);
      addDebugLog(`📧 Email: ${testEmail}`);
      
      // Call submitAnalysis directly
      addDebugLog('📤 Calling submitAnalysis...');
      const result = await submitAnalysis(testText, testUserId, testEmail, 'basic');
      
      if (result.success) {
        addDebugLog(`✅ SUCCESS! Job ID: ${result.jobId}`);
        addDebugLog('🎉 Check Make.com - it should have received the data!');
        addDebugLog('🔍 Check Supabase submissions table for the new row');
      } else {
        addDebugLog(`❌ FAILED: ${result.error}`);
      }
    } catch (error) {
      addDebugLog(`💥 Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Check Supabase database directly
  const handleCheckDatabase = async () => {
    addDebugLog('🔍 Checking Supabase database for recent analyses...');
    try {
      // Check analyses table
      const { data: analyses, error: analysesError, count: analysesCount } = await supabase
        .from('analyses')
        .select('id, query_id, is_ready, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      if (analysesError) {
        addDebugLog(`❌ Error querying analyses table: ${analysesError.message}`);
      } else {
        addDebugLog(`📊 Analyses table: ${analysesCount || 0} total rows`);
        if (analyses && analyses.length > 0) {
          addDebugLog(`📋 Latest ${analyses.length} analyses:`);
          analyses.forEach((a, i) => {
            addDebugLog(`   ${i + 1}. query_id: ${a.query_id}`);
            addDebugLog(`      is_ready: ${a.is_ready}, status: ${a.status}`);
            addDebugLog(`      created: ${new Date(a.created_at).toLocaleString()}`);
          });
        } else {
          addDebugLog('⚠️ No rows found in analyses table');
          addDebugLog('🔧 Make.com has NOT written any data to analyses table');
        }
      }

      // Check submissions table
      const { data: submissions, error: submissionsError, count: submissionsCount } = await supabase
        .from('submissions')
        .select('job_id, query_id, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      if (submissionsError) {
        addDebugLog(`❌ Error querying submissions table: ${submissionsError.message}`);
      } else {
        addDebugLog(`📊 Submissions table: ${submissionsCount || 0} total rows`);
        if (submissions && submissions.length > 0) {
          addDebugLog(`📋 Latest ${submissions.length} submissions:`);
          submissions.forEach((s, i) => {
            addDebugLog(`   ${i + 1}. query_id: ${s.query_id}`);
            addDebugLog(`      job_id: ${s.job_id}`);
            addDebugLog(`      status: ${s.status}`);
            addDebugLog(`      created: ${new Date(s.created_at).toLocaleString()}`);
          });
        } else {
          addDebugLog('⚠️ No rows found in submissions table');
          addDebugLog('🔧 Make.com has NOT written any data to submissions table');
        }
      }

      addDebugLog('✅ Database check complete');
      addDebugLog('💡 If no rows found, check Make.com execution history');
    } catch (error) {
      addDebugLog(`❌ Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Generate unique user ID
  const generateUserId = (): string => {
    // Generate proper UUID v4 for Supabase uuid column compatibility
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // ⚠️ DEPRECATED: This function is no longer used
  // The database trigger (handle_new_user) now auto-creates public.users records
  // when auth.users records are created, using the SAME ID
  // See /fix_auth_user_sync.sql for the new approach
  const getOrCreateUserInSupabase_DEPRECATED = async (email: string, displayName: string, paymentPlan: string = 'basic'): Promise<{ userId: string; isNew: boolean } | null> => {
    try {
      addDebugLog(`🔍 Looking up user in Supabase: ${email}`);
      
      // First, check if user already exists by email
      const { data: existingUsers, error: lookupError } = await supabase
        .from('users')
        .select('id, email, display_name, payment_plan')
        .eq('email', email)
        .limit(1);

      if (lookupError) {
        addDebugLog(`❌ Error looking up user: ${lookupError.message}`);
        console.error('User lookup error:', lookupError);
        return null;
      }

      // If user exists, return their ID
      if (existingUsers && existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        addDebugLog(`✅ Found existing user in Supabase!`);
        addDebugLog(`🆔 User ID: ${existingUser.id}`);
        addDebugLog(`📧 Email: ${existingUser.email}`);
        
        // Update last login time
        await supabase
          .from('users')
          .update({ 
            updated_at: new Date().toISOString(),
            display_name: displayName // Update name if changed
          })
          .eq('id', existingUser.id);
        
        return { userId: existingUser.id, isNew: false };
      }

      // User doesn't exist, create new one
      addDebugLog(`🆕 User not found, creating new user...`);
      
      // Check if this is the primary test user (Athar)
      let newUserId: string;
      if (email.toLowerCase() === 'athar.qureshi1@outlook.com') {
        newUserId = 'f8800651-b2e7-4b1b-95da-3e9c92509ab2';
        addDebugLog(`👤 Using primary test user UUID for Athar`);
      } else if (email.toLowerCase() === 'ping@maverickaienigmaradar.com') {
        newUserId = 'fcb72c6d-7e95-4a24-991f-6c7a32295e30';
        addDebugLog(`👤 Using test user UUID for Ping`);
      } else {
        newUserId = generateUserId();
      }
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: newUserId,
          email: email,
          display_name: displayName,
          payment_plan: paymentPlan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        addDebugLog(`❌ Failed to create user in Supabase: ${insertError.message}`);
        console.error('Supabase user creation error:', insertError);
        return null;
      }

      addDebugLog(`✅ New user created in Supabase successfully!`);
      addDebugLog(`🆔 User ID: ${newUserId}`);
      return { userId: newUserId, isNew: true };
    } catch (error) {
      addDebugLog(`💥 Exception in user lookup/creation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('User authentication exception:', error);
      return null;
    }
  };

  // Real Supabase Auth sign in
  const handleSignIn = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      addDebugLog(`🔐 Signing in with Supabase Auth: ${email}`);
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        addDebugLog(`❌ Sign in failed: ${authError.message}`);
        setAuthError(authError.message);
        return;
      }
      
      if (!authData.user) {
        addDebugLog(`❌ No user returned from sign in`);
        setAuthError('Sign in failed - no user data received');
        return;
      }
      
      addDebugLog(`✅ Authenticated with Supabase Auth!`);
      addDebugLog(`🆔 Auth User ID: ${authData.user.id}`);
      addDebugLog(`📧 Email: ${authData.user.email}`);
      
      // IMPORTANT: Look up user by EMAIL, not by Auth ID
      // Auth IDs are different from public.users IDs
      addDebugLog(`🔍 Looking up user in public.users table by email...`);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authData.user.email)
        .single();
      
      if (userError || !userData) {
        addDebugLog(`⚠️ User profile not found in database by email, creating...`);
        
        // CRITICAL FIX: Use the Auth user's ID (not a custom UUID)
        // This ensures auth.users.id matches public.users.id
        const authUserId = authData.user.id;
        addDebugLog(`🆔 Using Auth User ID: ${authUserId}`);
        
        // Create user profile in users table
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUserId,  // ✅ FIXED: Use auth user's ID
            email: authData.user.email || email,
            display_name: authData.user.user_metadata?.name || 'Strategic Analyst',
            payment_plan: 'basic',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) {
          addDebugLog(`❌ Failed to create user profile: ${createError.message}`);
          addDebugLog(`⚠️ This might be because the database trigger already created it`);
          
          // Try to fetch the user again (trigger might have created it)
          const { data: retryUserData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUserId)
            .single();
          
          if (retryUserData) {
            addDebugLog(`✅ User profile found on retry (trigger created it)`);
            setUser({
              email: retryUserData.email,
              displayName: retryUserData.display_name,
              uid: retryUserData.id,
              paymentPlan: retryUserData.payment_plan
            });
          } else {
            // Fallback: continue with auth data
            setUser({
              email: authData.user.email || email,
              displayName: 'Strategic Analyst',
              uid: authUserId,
              paymentPlan: 'basic'
            });
          }
        } else {
          addDebugLog(`✅ New user profile created with ID: ${authUserId}`);
          setUser({
            email: newUserData.email,
            displayName: newUserData.display_name,
            uid: newUserData.id,
            paymentPlan: newUserData.payment_plan
          });
        }
      } else {
        addDebugLog(`✅ User profile loaded from database`);
        addDebugLog(`🆔 User ID: ${userData.id}`);
        
        // Update last login
        await supabase
          .from('users')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', userData.id);
        
        setUser({
          email: userData.email,
          displayName: userData.display_name,
          uid: userData.id,
          paymentPlan: userData.payment_plan
        });
      }
      
      addDebugLog('👋 Welcome back!');
      setAuthError(null);
      
      // Check if this is a returning user or first-time user
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        // First-time user - show onboarding
        addDebugLog('🎉 First-time user detected - showing onboarding');
        setShowOnboarding(true);
      } else {
        // DON'T override special routes (sandbox, icons)
        setAppState(prev => {
          if (prev === 'sandbox' || prev === 'icons') {
            addDebugLog(`✅ Preserving ${prev} route after sign in`);
            return prev;
          }
          return 'home';
        });
      }
      
      setActiveTab('home');
      
      // Apply screenshot prevention policy (mobile only)
      const finalPlan = userData?.payment_plan || 'basic';
      applyScreenshotPolicy(finalPlan);
      
      // Track successful sign in
      trackWithUser('user_sign_in', userData?.id || authData.user.id, authData.user.email || email);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`💥 Sign in error: ${errorMsg}`);
      setAuthError(errorMsg);
      
      // Track auth error
      trackEvent('auth_error', { error: errorMsg, flow: 'sign_in' });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      addDebugLog(`🔐 Creating account with Supabase Auth: ${email}`);
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (authError) {
        addDebugLog(`❌ Sign up failed: ${authError.message}`);
        setAuthError(authError.message);
        return;
      }
      
      if (!authData.user) {
        addDebugLog(`❌ No user returned from sign up`);
        setAuthError('Sign up failed - no user data received');
        return;
      }
      
      addDebugLog(`✅ Account created with Supabase Auth!`);
      addDebugLog(`🆔 Auth User ID: ${authData.user.id}`);
      addDebugLog(`📧 Email: ${authData.user.email}`);
      
      // CRITICAL FIX: Use the Auth user's ID (not a custom UUID)
      // This ensures auth.users.id matches public.users.id
      const authUserId = authData.user.id;
      addDebugLog(`📝 Creating user profile in database with Auth ID: ${authUserId}...`);
      
      // Wait a moment for the database trigger to create the user profile
      // (The trigger should auto-create it, but we'll try to insert anyway as a fallback)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to fetch the user profile (trigger should have created it)
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();
      
      // If trigger didn't create it, insert manually
      if (userError || !userData) {
        addDebugLog(`⚠️ User profile not auto-created by trigger, creating manually...`);
        
        const { data: newUserData, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUserId,  // ✅ FIXED: Use auth user's ID
            email: authData.user.email || email,
            display_name: name,
            payment_plan: 'basic',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) {
          addDebugLog(`❌ Failed to create user profile: ${insertError.message}`);
          // Continue anyway - auth account was created
          setUser({
            email: authData.user.email || email,
            displayName: name,
            uid: authUserId,
            paymentPlan: 'basic'
          });
        } else {
          addDebugLog(`✅ User profile created manually!`);
          userData = newUserData;
        }
      } else {
        addDebugLog(`✅ User profile auto-created by database trigger!`);
      }
      
      if (userData) {
        setUser({
          email: userData.email,
          displayName: userData.display_name,
          uid: userData.id,
          paymentPlan: userData.payment_plan
        });
      }
      
      addDebugLog('🎉 Account created successfully! Welcome!');
      setAuthError(null);
      
      // New users always see onboarding
      addDebugLog('🎉 New user - showing onboarding');
      setShowOnboarding(true);
      setActiveTab('home');
      
      // Apply screenshot prevention policy (mobile only - new users start as basic)
      applyScreenshotPolicy('basic');
      
      // Track successful sign up
      trackWithUser('user_sign_up', userData?.id || authData.user.id, authData.user.email || email, {
        displayName: name
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`💥 Sign up error: ${errorMsg}`);
      setAuthError(errorMsg);
      
      // Track auth error
      trackEvent('auth_error', { error: errorMsg, flow: 'sign_up' });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      addDebugLog(`🔐 Attempting Google sign in...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        addDebugLog(`❌ Google sign in failed: ${error.message}`);
        addDebugLog(`⚠️ Google OAuth requires additional setup in Supabase Dashboard`);
        addDebugLog(`📖 See: https://supabase.com/docs/guides/auth/social-login/auth-google`);
        setAuthError(`Google sign-in not configured. Please use email/password for now.`);
        return;
      }
      
      addDebugLog(`✅ Google OAuth initiated`);
      // User will be redirected to Google, then back to the app
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`💥 Google sign in error: ${errorMsg}`);
      setAuthError(`Google sign-in not configured. Please use email/password for now.`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      addDebugLog(`🔐 Attempting Apple sign in...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        addDebugLog(`❌ Apple sign in failed: ${error.message}`);
        addDebugLog(`⚠️ Apple OAuth requires additional setup in Supabase Dashboard`);
        addDebugLog(`📖 See: https://supabase.com/docs/guides/auth/social-login/auth-apple`);
        setAuthError(`Apple sign-in not configured. Please use email/password for now.`);
        return;
      }
      
      addDebugLog(`✅ Apple OAuth initiated`);
      // User will be redirected to Apple, then back to the app
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`💥 Apple sign in error: ${errorMsg}`);
      setAuthError(`Apple sign-in not configured. Please use email/password for now.`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      addDebugLog(`🔑 Sending password reset email to: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      
      if (error) {
        addDebugLog(`❌ Password reset failed: ${error.message}`);
      } else {
        addDebugLog(`✅ Password reset email sent! Check your inbox.`);
      }
    } catch (error) {
      addDebugLog(`💥 Password reset error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteAccount = async () => {
    // Mock account deletion
    console.log('Deleting account for:', user?.email);
    addDebugLog(`🗑️ Account deleted: ${user?.email}`);
    // In production, this would delete user data from Firebase and cancel subscriptions
    handleSignOut();
  };

  const handleSignOut = async () => {
    const userEmail = user?.email;
    const userId = user?.uid;
    
    try {
      addDebugLog(`👋 Signing out...`);
      
      await supabase.auth.signOut();
      addDebugLog(`✅ Signed out successfully`);
      
      // Track sign out
      if (userId && userEmail) {
        trackWithUser('user_sign_out', userId, userEmail);
      }
    } catch (error) {
      addDebugLog(`⚠️ Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUser(null);
      setAppState('auth');
      setActiveTab('home');
      setSubmissionData({ text: '', files: [] });
      setViewingHistoricalScan(null);
    }
  };

  const handleSubscribe = async (planId: string) => {
    // Mock Stripe payment
    console.log('Subscribing to plan:', planId);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAppState('profile');
  };

  const handleOnboardingComplete = (preferences: OnboardingPreferences) => {
    addDebugLog('✅ Onboarding completed');
    addDebugLog(`   Sample scenarios: ${preferences.showSampleScenarios ? 'ON' : 'OFF'}`);
    addDebugLog(`   Enabled categories: ${preferences.enabledScenarios?.join(', ') || 'none'}`);
    addDebugLog(`   Text size: ${preferences.textSize}`);
    addDebugLog(`   Analytics: ${preferences.enableAnalytics ? 'ON' : 'OFF'}`);
    
    // Save preferences
    setEnabledScenarios(preferences.enabledScenarios);
    setTextSize(preferences.textSize);
    
    // Store in localStorage
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Close onboarding and show home screen
    setShowOnboarding(false);
    setAppState('home');
    
    // Check if user should see the first-time tooltip
    const hasSeenTooltip = localStorage.getItem('hasSeenTooltip');
    if (!hasSeenTooltip && user) {
      // Show tooltip when user navigates to radar screen
      // We'll trigger this in handleStartAnalysis
      addDebugLog('📌 User will see first-time tooltip on radar screen');
    }
    
    // Track onboarding completion
    if (user) {
      trackWithUser('onboarding_completed', user.uid, user.email, {
        showSampleScenarios: preferences.showSampleScenarios,
        scenariosCount: preferences.enabledScenarios.length,
        textSize: preferences.textSize,
        enableAnalytics: preferences.enableAnalytics
      });
    }
  };

  const handleSubmit = async (text: string, files: File[]) => {
    addDebugLog('🔍 handleSubmit called');
    addDebugLog(`   Text length: ${text?.length || 0}`);
    addDebugLog(`   Files: ${files?.length || 0}`);
    addDebugLog(`   User: ${user ? sanitizeEmail(user.email) : 'NULL'}`);
    addDebugLog(`   isSubmitting: ${isSubmitting}`);
    
    // Prevent duplicate submissions with STRONG protection
    if (isSubmitting) {
      addDebugLog('⏸️ 🚫 DUPLICATE PREVENTED: Submission already in progress!');
      addDebugLog('   This prevents the double-submission issue');
      return;
    }
    
    if (!user) {
      addDebugLog('❌ BLOCKED: No user logged in');
      addDebugLog('❌ This is why the submission is not reaching Make.com!');
      addDebugLog('🔧 Fix: Run RLS SQL script or use Force Submit button');
      return;
    }
    
    addDebugLog(`✅ User check passed: ${sanitizeEmail(user.email)} (${sanitizeUserId(user.uid)})`)
    
    // Input validation
    if (!text || text.trim().length < 10) {
      addDebugLog('❌ Input text too short (minimum 10 characters)');
      setAnalysisError('Please provide at least 10 characters describing your situation');
      return;
    }
    
    // IMMEDIATELY set isSubmitting to prevent race conditions
    setIsSubmitting(true);
    addDebugLog('🔒 SUBMISSION LOCKED - preventing duplicates');
    addDebugLog(`🚀 Starting analysis for user: ${sanitizeEmail(user.email)}`);
    addDebugLog(`📝 Input text length: ${text.length} characters`);
    addDebugLog(`📎 Files attached: ${files.length}`);
    
    setSubmissionData({ text, files });
    setViewingHistoricalScan(null);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setAppState('processing');
    
    // ⏱️ START TIMER - This measures the critical "Time to Dashboard" metric
    startTimer('time_to_dashboard');
    addDebugLog('⏱️ TIMER STARTED: Measuring time to dashboard (3-minute challenge)');
    
    // Track submission event
    trackWithUser('analysis_submitted', user.uid, user.email, {
      text_length: text.length,
      files_count: files.length,
      payment_plan: user.paymentPlan
    });
    trackWithUser('processing_started', user.uid, user.email);
    
    try {
      let analysisResults;
      
      // ✨ OPTION A vs OPTION B ROUTING
      if (files.length === 0) {
        // ⚡ OPTION A: Text-only (Secure API endpoint - FAST!)
        addDebugLog('⚡ OPTION A: NO FILES - Using secure /api/analyze endpoint');
        addDebugLog('🔐 API keys stay on server (NEVER exposed to browser)');
        addDebugLog('⚡ Direct OpenAI processing (no polling delays)');
        
        // Call secure API endpoint
        const apiStartTime = Date.now();
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputText: text,
            userId: user.uid,
            userEmail: user.email
          })
        });
        
        const apiElapsedTime = Date.now() - apiStartTime;
        addDebugLog(`⏱️ API response time: ${apiElapsedTime}ms (${(apiElapsedTime/1000).toFixed(1)}s)`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          addDebugLog(`❌ API error: ${errorData.error || response.statusText}`);
          throw new Error(errorData.error || `API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          addDebugLog(`❌ API returned failure: ${result.error || 'Unknown error'}`);
          throw new Error(result.error || 'Analysis failed');
        }
        
        addDebugLog(`✅ API analysis complete! Job ID: ${result.jobId}`);
        addDebugLog(`⏱️ Total processing time: ${result.elapsedTime}ms (${(result.elapsedTime/1000).toFixed(1)}s)`);
        
        analysisResults = result.data;
      } else {
        // 🔌 OPTION B: With files (Secure API endpoint)
        addDebugLog('🔌 OPTION B: FILES DETECTED - Using secure /api/analyze-files endpoint');
        addDebugLog('🔐 API keys stay on server (NEVER exposed to browser)');
        addDebugLog('📎 Files will be uploaded to OpenAI temporary vector store');
        addDebugLog('🧹 Auto-cleanup after 24 hours (no storage costs)');
        
        // Convert files to base64 for secure transfer
        addDebugLog(`📤 Converting ${files.length} files to base64...`);
        
        const filesData = await Promise.all(
          files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64
            };
          })
        );
        
        addDebugLog(`✅ Files converted to base64`);
        addDebugLog(`   text: ${text.substring(0, 50)}...`);
        addDebugLog(`   files: ${filesData.length} file(s)`);
        
        // Call secure API endpoint with files
        const apiStartTime = Date.now();
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputText: text,
            files: filesData,
            userId: user.uid,
            userEmail: user.email
          })
        });
        
        const apiElapsedTime = Date.now() - apiStartTime;
        addDebugLog(`⏱️ API response time: ${apiElapsedTime}ms (${(apiElapsedTime/1000).toFixed(1)}s)`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          addDebugLog(`❌ API error: ${errorData.error || response.statusText}`);
          throw new Error(errorData.error || `API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        addDebugLog(`✅ API analysis with files complete! Job ID: ${result.jobId}`);
        addDebugLog(`⏱️ Total processing time: ${result.elapsedTime}ms (${(result.elapsedTime/1000).toFixed(1)}s)`);
        
        if (!result.success || !result.data) {
          addDebugLog(`❌ API returned failure: ${result.error || 'Unknown error'}`);
          throw new Error(result.error || 'Analysis failed');
        }
        
        analysisResults = result.data;
        
        addDebugLog('✅ API file analysis data retrieved successfully!');
        addDebugLog(`   Power: ${analysisResults.powerScore}`);
        addDebugLog(`   Gravity: ${analysisResults.gravityScore}`);
        addDebugLog(`   Risk: ${result.data.riskScore}`);
      }
      
      // Enhanced result logging
      addDebugLog(`📊 Analysis results received:`, true);
      addDebugLog(`   jobId: ${analysisResults.jobId || 'MISSING'}`);
      addDebugLog(`   data exists: ${analysisResults ? 'YES' : 'NO'}`);
      
      if (analysisResults) {
        addDebugLog(`   powerScore: ${analysisResults.powerScore}`);
        addDebugLog(`   gravityScore: ${analysisResults.gravityScore}`);
        addDebugLog(`   riskScore: ${analysisResults.riskScore}`);
      }
      
      if (analysisResults) {
        // ⏱️ END TIMER - Show total time to dashboard
        const totalTime = endTimer('time_to_dashboard');
        addDebugLog(`⏱️ ============================================`);
        addDebugLog(`⏱️ TOTAL TIME TO DASHBOARD: ${totalTime}ms`);
        addDebugLog(`⏱️ TOTAL TIME TO DASHBOARD: ${(totalTime/1000).toFixed(1)} seconds`);
        addDebugLog(`⏱️ ============================================`);
        
        addDebugLog('✅ ✅ ✅ Analysis SUCCESS! Results received!');
        addDebugLog(`🆔 Job ID: ${analysisResults.jobId}`);
        addDebugLog(`📊 Scores - Power: ${analysisResults.powerScore}, Gravity: ${analysisResults.gravityScore}, Risk: ${analysisResults.riskScore}`);
        addDebugLog('🗄️ Data saved to Supabase analyses table');
        addDebugLog('🎯 TRANSITIONING TO DASHBOARD NOW...');
        
        // Use the analysis data directly (already in ProcessedAnalysis format)
        setCurrentAnalysis(analysisResults);
        setAppState('dashboard');
        setActiveTab('home');
        
        addDebugLog('✅ State updated: currentAnalysis set, appState = dashboard');
        
        // ⏱️ Track dashboard reached
        analytics.trackTimeToDashboard(user.uid, user.email);
        
        // Track successful completion
        trackWithUser('analysis_completed', user.uid, user.email, {
          jobId: analysisResults.jobId,
          powerScore: analysisResults.powerScore,
          gravityScore: analysisResults.gravityScore,
          riskScore: analysisResults.riskScore
        });
        trackWithUser('dashboard_viewed', user.uid, user.email, {
          is_historical: false
        });
      } else {
        addDebugLog('❌ ❌ ❌ FAILURE: Analysis failed');
        setAnalysisError('Analysis failed - please try again');
        setAppState('home');
        
        // Track submission error
        trackWithUser('submission_error', user.uid, user.email, {
          error: analysisResults.error,
          jobId: analysisResults.jobId
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addDebugLog(`💥 Exception during submission: ${errorMessage}`);
      console.error('RunRadar submission error:', error);
      setAnalysisError(errorMessage);
      setAppState('home');
      
      // Track critical error
      trackWithUser('submission_error', user.uid, user.email, {
        error: errorMessage,
        exception: true
      });
    } finally {
      setIsSubmitting(false);
      addDebugLog('🏁 Submission process complete');
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
    
    // Show first-time tooltip if user hasn't seen it yet
    const hasSeenTooltip = localStorage.getItem('hasSeenTooltip');
    if (!hasSeenTooltip) {
      addDebugLog('🎯 First-time on radar screen - showing tooltip');
      setTimeout(() => {
        setShowFirstTimeTooltip(true);
      }, 500); // Small delay so radar screen loads first
    }
    
    // Track radar scan started
    if (user) {
      trackWithUser('radar_scan_started', user.uid, user.email);
    }
  };

  const handleTooltipClose = () => {
    addDebugLog('✅ First-time tooltip completed');
    localStorage.setItem('hasSeenTooltip', 'true');
    setShowFirstTimeTooltip(false);
    
    // Track tooltip completion
    if (user) {
      trackWithUser('tutorial_completed', user.uid, user.email);
    }
  };

  const handleViewHistoricalScan = (scan: HistoryScan) => {
    console.log('📖 Viewing historical scan:', scan.id);
    addDebugLog(`📖 Loading historical scan: ${scan.id}`);
    addDebugLog(`   Title: ${scan.title}`);
    addDebugLog(`   Scores: P${scan.powerScore} G${scan.gravityScore} R${scan.riskScore}`);
    
    setViewingHistoricalScan(scan);
    setSubmissionData({ text: scan.text, files: [] });
    
    // Always use fullAnalysis if available (it has ALL fields from Supabase)
    if (scan.fullAnalysis) {
      addDebugLog(`✅ Using fullAnalysis from HistoryScan`);
      addDebugLog(`   Has TL;DR: ${!!scan.fullAnalysis.summary}`);
      addDebugLog(`   Has Narrative: ${!!scan.fullAnalysis.narrativeSummary}`);
      addDebugLog(`   Has Immediate Move: ${!!scan.fullAnalysis.immediateMove}`);
      addDebugLog(`   Has Strategic Tool: ${!!scan.fullAnalysis.strategicTool}`);
      addDebugLog(`   Has Analytical Check: ${!!scan.fullAnalysis.analyticalCheck}`);
      addDebugLog(`   Has Long Term Fix: ${!!scan.fullAnalysis.longTermFix}`);
      setCurrentAnalysis(scan.fullAnalysis);
    } else {
      addDebugLog(`⚠️ No fullAnalysis - using partial scan data (some fields may be missing)`);
      // Fallback: Create ProcessedAnalysis from scan data (legacy support)
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
        updatedAt: scan.date
      };
      setCurrentAnalysis(analysis);
    }
    
    setAppState('dashboard');
    setActiveTab('home');
    
    // Track historical scan viewed
    if (user) {
      trackWithUser('historical_scan_viewed', user.uid, user.email, {
        scanId: scan.id,
        powerScore: scan.powerScore,
        gravityScore: scan.gravityScore,
        riskScore: scan.riskScore
      });
      trackWithUser('dashboard_viewed', user.uid, user.email, {
        is_historical: true
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Track navigation
    const navEvents: Record<string, any> = {
      'home': 'nav_home',
      'radar': 'nav_radar',
      'profile': 'nav_profile',
      'history': 'nav_history',
      'moves': 'nav_settings'
    };
    
    if (user && navEvents[tab]) {
      trackWithUser(navEvents[tab], user.uid, user.email);
    }
    
    switch (tab) {
      case 'home':
        // Always go to home screen for issue entry
        setAppState('home');
        if (user) {
          trackWithUser('home_screen_viewed', user.uid, user.email);
        }
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
        if (user) {
          trackWithUser('history_screen_viewed', user.uid, user.email);
        }
        break;
      case 'moves':
        // Settings tab
        setAppState('settings');
        break;
    }
  };

  const handleViewPrivacy = () => {
    setAppState('privacy');
  };

  const handleViewTerms = () => {
    setAppState('terms');
  };

  const handleBackFromLegal = () => {
    if (user) {
      setAppState('profile');
    } else {
      setAppState('auth');
    }
  };

  const handleToggleScenario = (category: import('./types/sample-scenarios').ScenarioCategory) => {
    setEnabledScenarios(prev => {
      if (prev.includes(category)) {
        // Don't allow disabling all scenarios
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Replay splash screen animation
  const handleReplaySplash = () => {
    addDebugLog('🎬 Replaying splash screen animation...');
    setIsAppLoading(true);
    setSplashKey(prev => prev + 1); // Force re-mount with new key
    
    // Auto-hide after animation duration
    setTimeout(() => {
      setIsAppLoading(false);
      addDebugLog('✅ Splash screen animation complete!');
    }, 3500);
  };

  // Show icon generator page if requested (no auth required)
  if (appState === 'icons') {
    return <IconGeneratorPage />;
  }
  
  // Show test dashboard (requires auth)
  if (appState === 'test' && user) {
    return <TestDashboard />;
  }
  
  // Show sandbox test page (requires auth)
  if (appState === 'sandbox' && user) {
    return <SandboxTestPage onBack={() => setAppState('home')} user={user} />;
  }

  // Show landing page if not signed in and not on special routes
  if (!user && appState === 'landing') {
    // 🎨 PREVIEW MODE: Switch between landing pages
    // Change to <LandingPageTabbed> or <LandingPage> to compare
    return (
      <div className="size-full">
        <MaverickLandingPremium />
      </div>
    );
  }

  // Show auth screen if not signed in (unless viewing legal pages or landing)
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
      {/* Animated Splash Screen */}
      <AnimatedSplashScreen 
        key={splashKey}
        isLoading={isAppLoading}
        minimumDisplayTime={3500}
      />

      <div className="dark size-full bg-gradient-to-b from-navy via-deep-blue to-navy min-h-screen">
        {/* Main Content */}
        <div className="pb-40">
        {appState === 'home' && (
          <HomeScreen 
            onStartAnalysis={handleStartAnalysis}
            error={analysisError}
            onClearError={() => setAnalysisError(null)}
          />
        )}
        
        {appState === 'radar' && (
          <ChatInterface onSubmit={handleSubmit} enabledScenarios={enabledScenarios} />
        )}
        
        {appState === 'processing' && (
          <DebriefingScreen
            inputText={submissionData.text}
            uploadedFiles={submissionData.files}
            onStartOver={handleStartOver}
            onGoHome={handleGoHome}
          />
        )}
        
        {appState === 'dashboard' && (
          <DashboardScreen
            analysis={currentAnalysis}
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

        {appState === 'history' && user && (
          <HistoryScreen 
            onViewScan={handleViewHistoricalScan}
            userId={user.uid}
          />
        )}

        {appState === 'payment' && user && (
          <PaymentScreen
            onSubscribe={handleSubscribe}
            onClose={() => setAppState('profile')}
            user={user}
          />
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

        {appState === 'privacy' && (
          <PrivacyPolicyScreen onBack={handleBackFromLegal} />
        )}

        {appState === 'terms' && (
          <TermsOfServiceScreen onBack={handleBackFromLegal} />
        )}

        {/* 🆕 SOVEREIGNTY FEATURES (Feature Flag Protected) */}
        
        {/* Phase 1: Alerts Inbox */}
        {appState === 'alerts' && enableSovereigntyFeatures && user && (
          <AlertsInboxScreen 
            onBack={() => {
              setAppState('home');
              setActiveTab('home');
            }}
            onViewAnalysis={(analysisId) => {
              addDebugLog(`🔗 Deep-linking to analysis: ${analysisId}`);
              // TODO: Load analysis by ID and navigate to dashboard
              // For now, just go back to home
              setAppState('home');
            }}
          />
        )}

        {/* Phase 2: Sovereignty Dashboard */}
        {appState === 'sovereignty-dashboard' && enableSovereigntyFeatures && user && (
          <SovereigntyDashboardScreen 
            onBack={() => {
              setAppState('home');
              setActiveTab('home');
            }}
          />
        )}

        {/* Phase 3: What-If Lab */}
        {appState === 'whatif' && enableSovereigntyFeatures && user && (
          <WhatIfLabScreen 
            onBack={() => {
              setAppState('home');
              setActiveTab('home');
            }}
          />
        )}

        {/* Phase 4: Reflex Trainer */}
        {appState === 'reflex' && enableSovereigntyFeatures && user && (
          <ReflexTrainerScreen 
            onBack={() => {
              setAppState('home');
              setActiveTab('home');
            }}
          />
        )}

        {/* Phase 5: Enhanced Radar */}
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

      {/* Navigation Bar - Hide on processing, dashboard, legal pages, and all Sovereignty screens */}
      {!['processing', 'dashboard', 'settings', 'privacy', 'terms', 'alerts', 'sovereignty-dashboard', 'whatif', 'reflex', 'enhanced-radar'].includes(appState) && user && (
        <div className="fixed bottom-0 left-0 right-0">
          <NavigationBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onRadarScan={handleRadarScan}
          />
        </div>
      )}

      {/* Debug Panel - Only visible in development mode */}
      {isDevelopment && (
        <DebugPanel
          logs={debugLogs}
          isVisible={showDebug}
          onToggle={() => setShowDebug(!showDebug)}
          onClear={() => setDebugLogs([])}
          onTestWebhook={handleTestWebhook}
          onCheckDatabase={handleCheckDatabase}
          onForceSubmit={handleForceSubmit}
          onGoToSandbox={() => {
            addDebugLog('🧪 Manual navigation to sandbox triggered');
            setAppState('sandbox');
          }}
          onReplaySplash={handleReplaySplash}
          enableSovereigntyFeatures={enableSovereigntyFeatures}
          onToggleSovereigntyFeatures={() => {
            setEnableSovereigntyFeatures(!enableSovereigntyFeatures);
            addDebugLog(`🆕 Sovereignty features ${!enableSovereigntyFeatures ? 'ENABLED' : 'DISABLED'}`);
          }}
          onGoToAlerts={() => {
            addDebugLog('🔔 Navigating to Alerts Inbox (v1.1.0-beta.1)');
            setAppState('alerts');
          }}
          onGoToSovereigntyDashboard={() => {
            addDebugLog('📊 Navigating to Sovereignty Dashboard (v1.1.0-beta.2)');
            setAppState('sovereignty-dashboard');
          }}
          onGoToWhatIfLab={() => {
            addDebugLog('🧪 Navigating to What-If Lab (v1.1.0-beta.3)');
            setAppState('whatif');
          }}
          onGoToReflexTrainer={() => {
            addDebugLog('🎯 Navigating to Reflex Trainer (v1.1.0-beta.4)');
            setAppState('reflex');
          }}
          onGoToEnhancedRadar={() => {
            addDebugLog('⚡ Navigating to Enhanced Radar (v1.1.0-beta.5)');
            setAppState('enhanced-radar');
          }}
        />
      )}

        {/* Onboarding Modal - First-time setup */}
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />

        {/* First-Time Tooltip - Interactive tutorial on radar screen */}
        <FirstTimeTooltip
          isOpen={showFirstTimeTooltip && appState === 'radar'}
          onClose={handleTooltipClose}
        />
      </div>
    </>
  );
}