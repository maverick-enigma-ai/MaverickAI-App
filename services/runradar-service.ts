import { RunRadarInput, RunRadarResponse, ProcessedAnalysis } from '../types/runradar-api';
import { createClient } from '@supabase/supabase-js';

// Your actual Make.com webhook endpoint
const RUNRADAR_WEBHOOK = 'https://hook.eu2.make.com/t5m1qkksguqoajk9p6874g2nvhj3e5op';
const MAKE_API_KEY = '2c772fdd-b7c9-44ab-9b93-85b50e63deec';

// Supabase configuration
const SUPABASE_URL = 'https://aoedthlhvpxvxahpvnwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZWR0aGxodnB4dnhhaHB2bnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzQzMDMsImV4cCI6MjA3NDc1MDMwM30.pmve6T0gX92SBmQQMfOCq5Zr4UCBYPGObGdh7zC1iZU';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class RunRadarService {
  // Generate proper UUID v4 (compatible with Supabase uuid type)
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateJobId(): string {
    return this.generateUUID();
  }

  // Lightweight ping with FULL field structure for Make.com mapping
  async pingWebhook(): Promise<{ success: boolean; message: string; responseTime: number }> {
    const startTime = Date.now();
    try {
      console.log('🏓 Pinging webhook with complete field structure...');
      console.log('⚠️  IMPORTANT: Make.com should check for _ping=true and NOT write to database!');
      
      // COMPLETE PING PAYLOAD - All fields with PING markers so Make.com can see structure
      // CRITICAL: Generate UNIQUE ID even for ping to avoid duplicate key errors
      const pingId = this.generateUUID();
      
      const pingPayload: RunRadarInput = {
        // Marker to identify this as a ping (Make.com can filter these out)
        _ping: true,
        
        // User input fields
        input_querytext: "PING: This is a connectivity test - do not process",
        // REAL UUID from users table for Ping Test User - matches Supabase foreign key constraint
        user_id: "fcb72c6d-7e95-4a24-991f-6c7a32295e30",
        email: "ping@maverickaienigmaradar.com",
        
        // Tracking IDs (query_id = job_id for compatibility)
        // Using UNIQUE UUID for each ping to avoid duplicate key errors if Make.com writes to DB
        job_id: pingId, // UNIQUE ping UUID (changes every ping)
        query_id: pingId, // Same as job_id
        
        // Status tracking fields
        status: 'ping',
        error_json: null,
        
        // Timestamp fields - ALWAYS generate fresh timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        processing_started_at: new Date().toISOString(),
        
        // User context
        payment_plan: 'test'
      };
      
      console.log(`🆔 Ping using unique ID: ${pingId} (won't cause duplicates)`);
      console.log('📋 Make.com should check: if (_ping === true) { return 200 without writing to DB }');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for ping

      const response = await fetch(RUNRADAR_WEBHOOK, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-make-apikey': MAKE_API_KEY,
          'User-Agent': 'MaverickAI-Ping/2.0'
        },
        body: JSON.stringify(pingPayload)
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      console.log(`🏓 Ping response: ${response.status} in ${responseTime}ms`);
      console.log('📋 Make.com can now see field structure:');
      console.log('   ✅ job_id (only ID needed!)');
      console.log('📋 Make.com can now see all field names for mapping:');
      console.log('   ✅ job_id, session_id, query_id, answers_id');
      console.log('   ✅ input_querytext, user_id, email');
      console.log('   ✅ status, created_at, updated_at, payment_plan');
      
      return {
        success: response.ok,
        message: response.ok 
          ? `✅ Webhook reachable (${responseTime}ms)` 
          : `❌ Webhook error: ${response.status}`,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🏓 Ping timeout after 5 seconds');
        return { 
          success: false, 
          message: '❌ Webhook timeout - Make.com not responding',
          responseTime 
        };
      }
      console.log('🏓 Ping error:', error);
      return { 
        success: false, 
        message: `❌ Webhook unreachable: ${error instanceof Error ? error.message : 'Network error'}`,
        responseTime
      };
    }
  }

  // Test connection to webhook with FULL enhanced payload format
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔧 Testing webhook with enhanced payload format...');
      
      // Generate single UUID (used for both job_id and query_id)
      const jobId = this.generateJobId();
      const now = new Date().toISOString();
      
      // SIMPLIFIED PAYLOAD - Only essential fields
      const testPayload: RunRadarInput = {
        // User input (test example)
        input_querytext: "TEST: My colleague is using passive-aggressive tactics in meetings, undermining my contributions while maintaining a friendly facade. This has been going on for 3 months.",
        // REAL UUID from users table for Ping Test User - matches Supabase foreign key constraint
        user_id: "fcb72c6d-7e95-4a24-991f-6c7a32295e30",
        email: "ping@maverickaienigmaradar.com",
        
        // Tracking IDs (query_id = job_id for Supabase compatibility)
        job_id: jobId,
        query_id: jobId, // Same value as job_id
        
        // Status tracking
        status: 'pending',
        error_json: null,
        
        // Timestamps
        created_at: now,
        updated_at: now,
        processing_started_at: now,
        
        // User context
        payment_plan: 'premium'
      };

      console.log('📦 Sending simplified test payload:', {
        job_id: jobId,
        query_id: jobId, // Same value
        status: testPayload.status,
        created_at: now
      });

      const response = await fetch(RUNRADAR_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-make-apikey': MAKE_API_KEY,
          'User-Agent': 'MaverickAI-EnhancedTest/1.0'
        },
        body: JSON.stringify(testPayload)
      });
      
      console.log('🔧 Test response:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('✅ Make.com received the simplified payload!');
        console.log('📋 Key fields to extract in Make.com:');
        console.log('   - job_id and query_id (same value for compatibility)');
        console.log('   - status, created_at, updated_at');
      }
      
      return {
        success: response.ok,
        message: response.ok 
          ? `✅ Simplified payload sent! (${response.status}) - Only job_id needed` 
          : `❌ Webhook error: ${response.status}`
      };
    } catch (error) {
      console.log('🔧 Test error:', error);
      return { 
        success: false, 
        message: `❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Sanitize text for JSON payload
  private sanitizeForJSON(text: string): string {
    return text
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\\/g, '\\\\') // Escape backslashes
      .replace(/"/g, '\\"') // Escape quotes
      .trim();
  }

  // Validate JSON payload before sending
  private validatePayload(payload: any): boolean {
    try {
      JSON.stringify(payload);
      return true;
    } catch (error) {
      console.error('JSON validation failed:', error);
      return false;
    }
  }

  // Convert file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:mime;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Submit analysis request to Make.com webhook with enhanced tracking
  async submitAnalysis(
    inputText: string,
    userId: string,
    userEmail: string,
    paymentPlan: string = 'basic',
    files: File[] = []  // 🆕 NEW: Accept files parameter
  ): Promise<{ 
    jobId: string; 
    status: string; 
    webhookResponse?: any 
  }> {
    
    // Generate single UUID (used for both job_id and query_id)
    const jobId = this.generateJobId();
    const now = new Date().toISOString();
    
    console.log('🔑 UNIQUE ID generated for NEW submission:');
    console.log(`   📦 job_id: ${jobId} (UNIQUE)`);
    console.log(`   📎 Files to process: ${files.length}`);
    console.log(`   🔍 query_id: ${jobId} (same value, for Supabase compatibility)`);
    
    // 🆕 Process files to base64 if any
    let attachments: Array<{
      file_name: string;
      file_type: string;
      file_size: number;
      file_data: string; // base64
    }> = [];
    
    if (files && files.length > 0) {
      console.log(`📤 Converting ${files.length} file(s) to base64...`);
      for (const file of files) {
        try {
          const base64Data = await this.fileToBase64(file);
          attachments.push({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_data: base64Data
          });
          console.log(`   ✅ ${file.name} (${(file.size / 1024).toFixed(1)} KB) converted`);
        } catch (error) {
          console.error(`   ❌ Failed to convert ${file.name}:`, error);
        }
      }
      console.log(`✅ Converted ${attachments.length} file(s) successfully`);
    }
    
    // Simplified payload with only essential fields + attachments
    const sanitizedPayload: RunRadarInput = {
      input_querytext: this.sanitizeForJSON(inputText),
      user_id: userId.replace(/[^a-zA-Z0-9_-]/g, ''), // Clean user ID
      email: userEmail.trim(),
      
      // Tracking IDs (query_id = job_id for Supabase compatibility)
      job_id: jobId,
      query_id: jobId, // Same value as job_id
      
      // Status tracking
      status: 'pending',
      error_json: null,
      
      // Timestamps
      created_at: now,
      updated_at: now,
      processing_started_at: now,
      
      // User context
      payment_plan: paymentPlan,
      
      // 🆕 File attachments (base64)
      attachments: attachments.length > 0 ? attachments : undefined
    };

    // Validate payload before sending
    if (!this.validatePayload(sanitizedPayload)) {
      throw new Error('Payload validation failed - contains invalid JSON characters');
    }

    console.log('🚀 Sending to RunRadar webhook:', {
      endpoint: RUNRADAR_WEBHOOK,
      payload: sanitizedPayload,
      originalTextLength: inputText.length,
      sanitizedTextLength: sanitizedPayload.input_querytext.length,
      timestamp: new Date().toISOString()
    });

    try {
      // Single timeout approach - simpler and more reliable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      // Convert to JSON string manually for debugging
      const jsonPayload = JSON.stringify(sanitizedPayload);
      console.log('📦 JSON payload size:', jsonPayload.length, 'characters');

      const response = await fetch(RUNRADAR_WEBHOOK, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-make-apikey': MAKE_API_KEY,
          'User-Agent': 'MaverickAI-Enigma-Radar/1.0',
          'Accept': 'application/json'
        },
        body: jsonPayload
      });

      clearTimeout(timeoutId);
      console.log('📡 Webhook response status:', response.status, response.statusText);
      console.log('🗄️ Make.com will now write to Supabase tables: submissions → analyses');
      
      // Simplified response handling
      let webhookResponse = null;
      if (response.ok) {
        try {
          const responseText = await response.text();
          console.log('📋 Raw webhook response:', responseText);
          
          if (responseText && responseText.trim()) {
            try {
              webhookResponse = JSON.parse(responseText);
              console.log('✅ Parsed webhook response:', webhookResponse);
            } catch (jsonError) {
              console.log('⚠️ Response is not JSON, treating as success');
              webhookResponse = { raw: responseText, success: true };
            }
          }
        } catch (parseError) {
          console.log('⚠️ Could not parse response, but webhook succeeded');
        }
      } else {
        console.log(`❌ Webhook failed with status: ${response.status}`);
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      return {
        jobId,
        status: 'submitted',
        webhookResponse
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Webhook request timed out - please try again');
      }
      console.error('❌ Webhook submission error:', error);
      throw error;
    }
  }

  // Poll Supabase for analysis results with optimized timing
  // KEY FIELD: Checks 'is_ready' field in Supabase analyses table to determine if processing is complete
  // When is_ready = true, the analysis is complete and all fields are populated by Make.com
  async pollForResults(jobId: string, maxAttempts: number = 15): Promise<ProcessedAnalysis> {
    // Note: jobId is used as query_id (they have the same value per Option 2.5)
    const queryId = jobId; // Same value, different column name
    console.log(`🔄 Starting to poll Supabase for results for query_id: ${queryId}`);
    console.log(`🔍 Will check analyses table WHERE query_id='${queryId}' AND is_ready=true`);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`\n🔍 Polling Supabase attempt ${attempt + 1}/${maxAttempts} for query_id: ${queryId}`);
      
      try {
        // Progressive wait times (total max ~60 seconds to allow for OpenAI processing)
        const waitTime = attempt === 0 ? 3000 : (attempt < 5 ? 4000 : 5000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // DIAGNOSTIC: First check if ANY row exists with this query_id (regardless of is_ready)
        const { data: anyData, error: anyError } = await supabase
          .from('analyses')
          .select('id, query_id, is_ready, status, created_at')
          .eq('query_id', queryId)
          .maybeSingle();
        
        if (anyData) {
          console.log(`📋 FOUND row with query_id='${queryId}':`, {
            id: anyData.id,
            is_ready: anyData.is_ready,
            status: anyData.status,
            created_at: anyData.created_at
          });
          
          if (!anyData.is_ready) {
            console.log(`⏳ Row exists but is_ready=${anyData.is_ready}, waiting for Make.com to update...`);
          }
        } else {
          console.log(`❌ NO row found in analyses table with query_id='${queryId}'`);
          console.log(`⏳ Make.com may still be processing or writing to database...`);
        }
        
        if (anyError && anyError.code !== 'PGRST116') {
          console.error('❌ Diagnostic query error:', anyError);
        }
        
        // Query Supabase analyses table for completed analysis
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('query_id', queryId)
          .eq('is_ready', true)
          .single();
        
        if (error) {
          // If no rows found, analysis is still processing
          if (error.code === 'PGRST116') {
            console.log(`⏳ Analysis still processing (attempt ${attempt + 1}/${maxAttempts})...`);
            continue;
          }
          // Other errors
          console.error('❌ Supabase query error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        if (data) {
          console.log('✅ Analysis completed and retrieved from Supabase!');
          console.log(`📊 Scores - Power: ${data.power_score}, Gravity: ${data.gravity_score}, Risk: ${data.risk_score}`);
          
          // Transform Supabase data to ProcessedAnalysis format with ALL fields
          const processedAnalysis: ProcessedAnalysis = {
            id: data.id,
            jobId: data.job_id || data.query_id,
            userId: data.user_id,
            title: data.tl_dr || data.input_querytext?.substring(0, 50) || 'Strategic Analysis Complete',
            inputText: data.input_querytext || '',
            summary: data.tl_dr || '',
            
            // Metrics - use correct Supabase column names
            powerScore: parseFloat(data.power_score) || 0,
            gravityScore: parseFloat(data.gravity_score) || 0,
            riskScore: parseFloat(data.risk_score) || 0,
            confidenceLevel: parseFloat(data.issue_confidence_pct) || 0,
            
            // Analysis content
            whatsHappening: data.whats_happening || '',
            whyItMatters: data.why_it_matters || '',
            narrativeSummary: data.narrative_summary || '',
            
            // Strategic moves
            immediateMove: data.immediate_move || '',
            strategicTool: data.strategic_tool || '',
            analyticalCheck: data.analytical_check || '',
            longTermFix: data.long_term_fix || '',
            
            // Explanations - use correct Supabase column names
            powerExplanation: data.power_expl || '',
            gravityExplanation: data.gravity_expl || '',
            riskExplanation: data.risk_expl || '',
            
            // Classifications
            issueType: data.issue_type || '',
            issueCategory: data.issue_category || '',
            issueLayer: data.issue_layer || '',
            
            // Diagnostic (for radar graphic)
            diagnosticState: data.diagnostic_state || '',
            diagnosticSoWhat: data.diagnostic_so_what || '',
            
            // Visualizations
            radarUrl: data.radar_url || undefined,
            chartHtml: data.chart_html || undefined,
            tugOfWarHtml: data.tugofwar_html || undefined,
            radarHtml: data.radar_html || undefined,
            riskHtml: data.risk_html || undefined,
            
            // Status
            status: data.status as 'processing' | 'completed' | 'failed' || 'completed',
            isReady: data.is_ready || false,
            
            // Timestamps
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            processedAt: data.processing_completed_at || undefined
          };
          
          return processedAnalysis;
        }
        
      } catch (error) {
        console.error(`❌ Error on polling attempt ${attempt + 1}:`, error);
        if (attempt === maxAttempts - 1) {
          throw new Error('Analysis timeout - your request may still be processing. Check History later.');
        }
      }
    }
    
    // Final diagnostic before giving up
    console.log(`\n🔍 FINAL CHECK: Looking for ANY row with query_id='${queryId}'...`);
    const { data: finalCheck } = await supabase
      .from('analyses')
      .select('id, query_id, is_ready, status')
      .eq('query_id', queryId)
      .maybeSingle();
    
    if (finalCheck) {
      console.log(`❌ Row exists but is_ready=${finalCheck.is_ready}, status=${finalCheck.status}`);
      throw new Error(`Analysis created but not marked as ready. Check Make.com configuration: is_ready should be true, status should be 'completed'.`);
    } else {
      console.log(`❌ No row found in analyses table - Make.com may not have written data.`);
      throw new Error('Analysis not found in database - check Make.com execution history for errors.');
    }
  }

  // Get user's analysis history from Supabase
  // KEY FIELD: Filters by 'is_ready' = true to show only completed analyses
  async getAnalysisHistory(
    userId: string, 
    options?: {
      limit?: number;
      filter?: 'all' | 'week' | 'month';
    }
  ): Promise<{ analyses: ProcessedAnalysis[]; total: number; hasMore: boolean }> {
    
    console.log('📚 Fetching analysis history from Supabase for user:', userId);
    
    try {
      // Build query
      let query = supabase
        .from('analyses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_ready', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      // Apply date filter if specified
      if (options?.filter === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', weekAgo);
      } else if (options?.filter === 'month') {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', monthAgo);
      }
      
      // Apply limit
      const limit = options?.limit || 50;
      query = query.limit(limit);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('❌ Error fetching history from Supabase:', error);
        throw new Error(`Failed to fetch history: ${error.message}`);
      }
      
      console.log(`✅ Retrieved ${data?.length || 0} analyses from Supabase`);
      
      // Transform Supabase data to ProcessedAnalysis format
      const analyses: ProcessedAnalysis[] = (data || []).map(item => ({
        id: item.id,
        jobId: item.job_id || item.id,
        userId: item.user_id,
        title: item.tl_dr || item.input_querytext?.substring(0, 50) || 'Analysis',
        inputText: item.input_querytext || '',
        summary: item.tl_dr || '',
        
        // Metrics - use correct Supabase column names
        powerScore: parseFloat(item.power_score) || 0,
        gravityScore: parseFloat(item.gravity_score) || 0,
        riskScore: parseFloat(item.risk_score) || 0,
        confidenceLevel: parseFloat(item.issue_confidence_pct) || 0,
        
        // Analysis content
        whatsHappening: item.whats_happening || '',
        whyItMatters: item.why_it_matters || '',
        narrativeSummary: item.narrative_summary || '',
        
        // Strategic moves
        immediateMove: item.immediate_move || '',
        strategicTool: item.strategic_tool || '',
        analyticalCheck: item.analytical_check || '',
        longTermFix: item.long_term_fix || '',
        
        // Explanations
        powerExplanation: item.power_expl || '',
        gravityExplanation: item.gravity_expl || '',
        riskExplanation: item.risk_expl || '',
        
        // Classifications
        issueType: item.issue_type || '',
        issueCategory: item.issue_category || '',
        issueLayer: item.issue_layer || '',
        
        // Diagnostic (for radar graphic)
        diagnosticState: item.diagnostic_state || '',
        diagnosticSoWhat: item.diagnostic_so_what || '',
        
        // Visualizations
        radarUrl: item.radar_url || undefined,
        chartHtml: item.chart_html || undefined,
        tugOfWarHtml: item.tugofwar_html || undefined,
        radarHtml: item.radar_html || undefined,
        riskHtml: item.risk_html || undefined,
        
        // Status
        status: item.status as 'processing' | 'completed' | 'failed' || 'completed',
        isReady: item.is_ready || false,
        
        // Timestamps
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        processedAt: item.processing_completed_at || undefined
      }));

      return {
        analyses,
        total: count || 0,
        hasMore: (count || 0) > limit
      };
    } catch (error) {
      console.error('💥 Exception fetching history:', error);
      // Return empty results on error instead of throwing
      return {
        analyses: [],
        total: 0,
        hasMore: false
      };
    }
  }
}

// Singleton service instance
export const runRadarService = new RunRadarService();

// React hook for RunRadar integration
export function useRunRadar() {
  const submitAnalysis = async (
    text: string, 
    userId: string, 
    userEmail: string, 
    paymentPlan: string = 'basic'
  ) => {
    let jobId: string | null = null;
    
    try {
      // Submit to Make.com webhook with simplified tracking (only job_id)
      const submissionResult = await runRadarService.submitAnalysis(
        text, 
        userId, 
        userEmail, 
        paymentPlan
      );
      
      // Capture the unique job_id immediately
      jobId = submissionResult.jobId;
      
      console.log('📋 Tracking ID generated for this submission:', { 
        jobId
      });
      console.log('✅ Each submission has a UNIQUE job_id:', jobId);
      console.log('🗄️ Make.com will process and write to Supabase database');
      
      // Poll Supabase for results using job_id
      const results = await runRadarService.pollForResults(jobId);
      
      return {
        success: true,
        data: results,
        jobId
      };
    } catch (error) {
      console.error('RunRadar submission failed:', error);
      
      // Return error with tracking info
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        jobId
      };
    }
  };

  const getHistory = async (userId: string, filter?: 'all' | 'week' | 'month') => {
    try {
      return await runRadarService.getAnalysisHistory(userId, { filter });
    } catch (error) {
      console.error('Failed to fetch history:', error);
      throw error;
    }
  };

  const testConnection = async () => {
    try {
      return await runRadarService.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, message: 'Connection test failed' };
    }
  };

  const pingWebhook = async () => {
    try {
      return await runRadarService.pingWebhook();
    } catch (error) {
      console.error('Webhook ping failed:', error);
      return { success: false, message: 'Ping failed', responseTime: 0 };
    }
  };

  return {
    submitAnalysis,
    getHistory,
    testConnection,
    pingWebhook,
    pollForResults: runRadarService.pollForResults.bind(runRadarService)
  };
}