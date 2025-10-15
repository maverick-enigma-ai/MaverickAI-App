// RunRadar API Integration Types - YOUR ACTUAL FIELDS

// Enhanced submission payload sent to Make.com
export interface RunRadarInput {
  // Ping marker (optional - only present for connectivity tests)
  _ping?: boolean;           // If true, Make.com should not process (just respond with 200 OK)
  
  // Main query text from user
  input_querytext: string;
  
  // User identification 
  user_id: string;           // Generated on login
  email: string;             // User's email
  
  // Tracking fields (query_id kept for Supabase compatibility)
  job_id: string;            // Unique job identifier (primary tracking ID)
  query_id: string;          // Query ID (same as job_id, kept for backward compatibility)
  
  // Status tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'ping';
  error_json: string | null; // JSON string with error details if failed
  
  // Timestamps
  created_at: string;        // ISO timestamp when job created
  updated_at: string;        // ISO timestamp when job last updated
  processing_started_at: string; // ISO timestamp when processing began
  
  // Optional context
  payment_plan?: string;     // User's subscription level
}

// Response from RunRadar API - YOUR ACTUAL GOOGLE SHEETS FIELDS
export interface RunRadarResponse {
  // Core identifiers
  ID: string;
  adalo_answer_id: string;           // Adalo Answer ID (Copy)
  input_querytext: string;           // Original input
  job_id: string;                    // Job tracking (links to submission)
  thread_id: string;
  run_id: string;
  
  // Analysis results
  tl_dr: string;                     // Summary
  whats_happening: string;           // Situation analysis  
  why_it_matters: string;            // Significance
  narrative_summary: string;         // Full narrative
  
  // Radar metrics
  radar_power: number;               // Power score
  radar_gravity: number;             // Gravity score  
  radar_risk: number;                // Risk score
  issue_confidence_pct: number;      // Confidence percentage
  
  // Strategic moves
  immediate_move: string;            // Immediate action
  strategic_tool: string;            // Strategic tool recommendation
  analytical_check: string;          // Analytical verification
  long_term_fix: string;             // Long-term solution
  
  // Explanations
  power_expl: string;                // Power explanation
  gravity_expl: string;              // Gravity explanation  
  risk_expl: string;                 // Risk explanation
  def_power: string;                 // Power definition
  def_gravity: string;               // Gravity definition
  def_risk: string;                  // Risk definition
  
  // Classifications
  issue_type: string;                // Type of issue
  issue_category: string;            // Category classification
  issue_layer: string;               // Layer analysis
  diagnostic_state: string;          // Diagnostic state
  diagnostic_so_what: string;        // Diagnostic significance
  
  // Visualizations 
  chart_type: string;                // Chart type
  chart_html: string;                // Chart HTML
  tugofwar_html: string;             // Tug of war visualization
  radar_html: string;                // Radar visualization
  risk_html: string;                 // Risk visualization
  radar_url: string;                 // Radar image URL
  
  // References and sources
  references: string;                // References
  references_internal: string;       // Internal references
  references_external: string;       // External references
  external_snippets: string;         // External snippets
  sources_confirmed: boolean;        // Sources verified
  
  // Processing metadata
  status: 'processing' | 'completed' | 'failed';
  latency_ms: number;                // Processing time
  tokens_used: number;               // AI tokens consumed
  processing_started_at: string;     // Start timestamp
  processing_completed_at: string;   // Completion timestamp
  processing_failed_at: string;      // Failure timestamp
  progress_step: string;             // Current progress
  
  // System fields
  snapshot: string;                  // Data snapshot
  vector_store_id: string;           // Vector store ID
  assistant_id: string;              // AI assistant ID
  model: string;                     // AI model used
  answer_version: string;            // Answer version
  payment_plan: string;              // User's plan
  is_draft: boolean;                 // Draft status
  is_ready: boolean;                 // Ready status
  current_draft_answer_user: string; // Draft user
  users: string;                     // Associated users
  job_id: string;                    // Job identifier
  meta_json: string;                 // Metadata JSON
  created: string;                   // Created timestamp
  updated: string;                   // Updated timestamp
}

// Stored analysis from Supabase database
export interface StoredAnalysis {
  id: string;
  job_id: string;
  user_id: string;
  input_text: string;
  
  // Summary fields
  tl_dr: string;
  whats_happening: string;
  why_it_matters: string;
  narrative_summary: string;
  
  // Radar scores
  radar_power: number;
  radar_gravity: number;
  radar_risk: number;
  issue_confidence_pct: number;
  
  // Strategic moves
  immediate_move: string;
  strategic_tool: string;
  analytical_check: string;
  long_term_fix: string;
  
  // Explanations
  power_expl: string;
  gravity_expl: string;
  risk_expl: string;
  
  // Classifications
  issue_type: string;
  issue_category: string;
  issue_layer: string;
  
  // Visualizations
  radar_url?: string;
  chart_html?: string;
  tugofwar_html?: string;
  radar_html?: string;
  risk_html?: string;
  
  // Status
  status: string;
  is_ready: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Processed analysis for frontend display  
export interface ProcessedAnalysis {
  // Identifiers
  id: string;
  jobId: string;
  userId: string;
  
  // Display data
  title: string;                     // Generated from tl_dr or user input
  inputText: string;                 // Original input_querytext
  summary: string;                   // tl_dr field
  
  // Metrics for UI
  powerScore: number;                // radar_power
  gravityScore: number;              // radar_gravity  
  riskScore: number;                 // radar_risk
  confidenceLevel: number;           // issue_confidence_pct
  
  // Analysis content
  whatsHappening: string;            // whats_happening
  whyItMatters: string;              // why_it_matters
  narrativeSummary: string;          // narrative_summary
  
  // Strategic moves
  immediateMove: string;             // immediate_move
  strategicTool: string;             // strategic_tool
  analyticalCheck: string;           // analytical_check
  longTermFix: string;               // long_term_fix
  
  // Explanations
  powerExplanation: string;          // power_expl
  gravityExplanation: string;        // gravity_expl
  riskExplanation: string;           // risk_expl
  
  // Classifications
  issueType: string;                 // issue_type
  issueCategory: string;             // issue_category
  issueLayer: string;                // issue_layer
  
  // Diagnostic (for radar graphic)
  diagnosticState?: string;          // diagnostic_state
  diagnosticSoWhat?: string;         // diagnostic_so_what
  
  // 🧠 NEW: Psychological Profile (Gold Nugget #1)
  psychologicalProfile?: {
    primaryMotivation: string;
    motivationEvidence: string;
    hiddenDriver: string;
    hiddenDriverSignal: string;
    emotionalState: string;
    emotionalEvidence: string;
    powerDynamic: string;
    powerDynamicEvidence: string;
  } | null;
  
  // 🩺 NEW: Diagnosis Fields (Primary, Secondary, Tertiary)
  diagnosisPrimary?: string;           // Primary diagnosis
  diagnosisSecondary?: string;         // Secondary diagnosis
  diagnosisTertiary?: string;          // Tertiary diagnosis
  
  // 🚩 Radar Red Flags
  radarRed1?: string;                  // First red flag
  radarRed2?: string;                  // Second red flag
  radarRed3?: string;                  // Third red flag
  tacticalMoves?: string;              // Tactical moves
  
  // Visualizations
  radarUrl?: string;                 // radar_url
  chartHtml?: string;                // chart_html
  tugOfWarHtml?: string;             // tugofwar_html
  radarHtml?: string;                // radar_html
  riskHtml?: string;                 // risk_html
  
  // Status
  status: 'processing' | 'completed' | 'failed';
  isReady: boolean;                  // is_ready
  
  // Timestamps
  createdAt: string;                 // created
  updatedAt: string;                 // updated
  processedAt?: string;              // processing_completed_at
}

// API endpoint interfaces
export interface ApiEndpoints {
  // POST /analyze - Send situation for analysis
  analyze: {
    input: RunRadarInput;
    output: { analysisId: string; status: 'processing' | 'completed' | 'failed' };
  };
  
  // GET /analysis/{id} - Get analysis results
  getAnalysis: {
    input: { analysisId: string };
    output: RunRadarResponse;
  };
  
  // GET /analyses - Get user's analysis history
  getAnalyses: {
    input: { 
      userId: string; 
      limit?: number; 
      offset?: number;
      filter?: 'all' | 'week' | 'month';
    };
    output: {
      analyses: StoredAnalysis[];
      total: number;
      hasMore: boolean;
    };
  };
  
  // DELETE /analysis/{id} - Delete analysis
  deleteAnalysis: {
    input: { analysisId: string };
    output: { success: boolean };
  };
}

// Frontend state management types
export interface AnalysisState {
  current: StoredAnalysis | null;
  history: StoredAnalysis[];
  isLoading: boolean;
  error: string | null;
  processingStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
}

// Component prop types for API integration
export interface DashboardProps {
  analysis: StoredAnalysis;
  onStartNewAnalysis: () => void;
  onViewHistory: () => void;
}

export interface HistoryProps {
  analyses: StoredAnalysis[];
  onSelectAnalysis: (analysis: StoredAnalysis) => void;
  onDeleteAnalysis: (analysisId: string) => void;
  isLoading: boolean;
}