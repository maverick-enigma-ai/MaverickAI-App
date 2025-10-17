import { ProcessedAnalysis } from '../types/runradar-api';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, debugEnv } from '../utils/env-adapter';
import { getOpenAIKey, getOpenAIAssistantID, getOpenAIVectorStoreID } from '../utils/openai-config';
import { getEnv } from '../utils/env-adapter'

// --- Unified backend caller (secure, used in production) --------------------
const USE_SECURE_API = getEnv('VITE_USE_SECURE_API') === 'true' // set this in Vercel

async function analyzeViaBackend(
  prompt: string,
  attachments?: Array<{ name: string; text: string }>
) {
  const r = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, attachments }),
  })
  if (!r.ok) {
    const msg = await r.text().catch(() => '')
    throw new Error(`API error ${r.status}: ${msg || r.statusText}`)
  }
  const data = await r.json()
  return (data?.text ?? '') as string
}

// Get Supabase configuration (works in Figma Make AND Vercel)
const supabaseConfig = getSupabaseConfig();
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Debug environment on load
debugEnv();

/**
 * Helper function to join array of strings with bullet points
 * Example: ["item1", "item2", "item3"] → "• item1\n• item2\n• item3"
 */
function joinWithBullets(arr: string[] | undefined): string {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n');
}

class OpenAIDirectService {
  // Generate proper UUID v4 (compatible with Supabase uuid type)
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get user's payment plan from users table
   * This is the source of truth for subscription status
   */
  private async getUserPaymentPlan(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from('users')
      .select('payment_plan')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.warn('⚠️ Could not fetch payment_plan, defaulting to free:', error?.message);
      return 'free';
    }
    
    return data.payment_plan || 'free';
  }

  /**
   * Submit text-only analysis directly to OpenAI Assistant
   * Returns immediately after creating the record - polls for completion
   * 
   * NOTE: payment_plan is stored in users table, not analyses table
   * NOTE: payment_transactions table is populated by Stripe webhooks
   */
  async submitTextAnalysis(
    inputText: string,
    userId: string,
    userEmail: string
  ): Promise<{ 
    success: boolean; 
    data?: ProcessedAnalysis;
    jobId: string; 
    error?: string;
  }> {
    const jobId = this.generateUUID();
    const now = new Date().toISOString();
    
    console.log('🚀 DIRECT OpenAI submission started');
    console.log(`📋 Job ID: ${jobId}`);
    console.log(`👤 User: ${userEmail}`);
    console.log(`📝 Text length: ${inputText.length} chars`);
    
    try {
      // STEP 1: Create record in Supabase immediately (pending status)
      console.log('📝 Step 1: Creating pending record in Supabase...');
      
      const { data: insertData, error: insertError } = await supabase
        .from('analyses')
        .insert({
          id: jobId,
          job_id: jobId,
          query_id: jobId,
          answers_id: jobId,  // Relic field - same as query_id
          user_id: userId,
          email: userEmail,
          // payment_plan is stored in users table, not analyses table
          input_text: inputText,
          status: 'processing', // Must be 'processing', 'completed', or 'failed' per constraint
          is_ready: false,
          created_at: now,
          updated_at: now
          // processing_started_at column doesn't exist in analyses table
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Failed to create Supabase record:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }
      
      console.log('✅ Pending record created in Supabase');
      
      // STEP 1B: Create matching record in submissions table
      console.log('📝 Step 1B: Creating pending submission record...');
      
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          analysis_id: jobId,  // Foreign key to analyses table
          user_id: userId,     // REQUIRED
          email: userEmail,    // REQUIRED
          job_id: jobId,       // Tracking ID (nullable after fix)
          input_querytext: inputText,  // The query text (nullable after fix)
          status: 'pending',
          created_at: now,
          updated_at: now
        });
      
      if (submissionError) {
        console.error('❌ Failed to create submission record:', submissionError);
        throw new Error(`Submission record error: ${submissionError.message}`);
      }
      
      console.log('✅ Pending submission record created');
      
      // STEP 2: Get OpenAI API key from environment (works in Figma Make AND Vercel)
      console.log('🔑 Step 2: Retrieving OpenAI API key...');
      
      let OPENAI_API_KEY: string;
      try {
        OPENAI_API_KEY = getOpenAIKey();
        console.log('✅ API key found');
      } catch (error) {
        console.error('❌ OpenAI API key not found in environment:', error);
        
        // Update record to error status
        await supabase
          .from('analyses')
          .update({
            status: 'error',
            error_json: { 
              message: 'OpenAI API key not configured',
              details: error instanceof Error ? error.message : String(error)
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);
        
        throw error;
      }
      
      // STEP 3: Call OpenAI Assistant API
      console.log('🤖 Step 3: Calling OpenAI Assistant API...');
      
      // Update status to processing
      await supabase
        .from('analyses')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      const result = await this.callOpenAIAssistant(inputText, OPENAI_API_KEY);
      const analysis = result.analysis;
      const metadata = result.metadata;
      
      console.log('✅ OpenAI analysis complete');
      console.log(`📊 Scores: P${analysis.power} G${analysis.gravity} R${analysis.risk}`);
      
      // STEP 4: Calculate radar fields
      const radarStability = Math.round(100 - analysis.power);
      const radarStrategy = Math.round((analysis.power + analysis.risk) / 2);
      
      console.log(`🎯 Calculated: radar_stability=${radarStability}, radar_strategy=${radarStrategy}`);
      
      // STEP 5: Update Supabase with complete results
      console.log('💾 Step 4: Saving results to Supabase...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('analyses')
        .update({
          // Status
          status: 'completed',
          is_ready: true,
          
          // Main Scores (from OpenAI)
          power_score: analysis.power,
          gravity_score: analysis.gravity,
          risk_score: analysis.risk,
          confidence_level: analysis.issue_confidence_pct,
          
          // Radar Scores (duplicates for radar chart)
          radar_control: analysis.risk,  // radar_control = risk
          radar_gravity: analysis.gravity,  // radar_gravity = gravity
          radar_confidence: analysis.issue_confidence_pct,  // radar_confidence = issue_confidence_pct
          
          // Calculated Radar Fields
          radar_stability: radarStability,  // CALCULATED: round(100 - power)
          radar_strategy: radarStrategy,  // CALCULATED: round((power + risk) / 2)
          
          // Both summary fields (same value)
          summary: analysis.tl_dr,  // Supabase column 'summary'
          tl_dr: analysis.tl_dr,    // Supabase column 'tl_dr'
          
          // Snapshot and narrative
          snapshot: analysis.snapshot,
          whats_happening: analysis.whats_happening,
          why_it_matters: analysis.why_it_matters,
          narrative_summary: analysis.narrative_summary,
          
          // Strategic moves (arrays joined with bullets)
          immediate_move: joinWithBullets(analysis.moves?.immediate_action),
          strategic_tool: joinWithBullets(analysis.moves?.strategic_tool),
          analytical_check: joinWithBullets(analysis.moves?.analytical_check),
          long_term_fix: joinWithBullets(analysis.moves?.long_term_fix),
          
          // Explanations (nested object)
          power_explanation: analysis.explanations?.power,
          gravity_explanation: analysis.explanations?.gravity,
          risk_explanation: analysis.explanations?.risk,
          
          // Definitions (nested object)
          def_power: analysis.definitions?.power,
          def_gravity: analysis.definitions?.gravity,
          def_risk: analysis.definitions?.risk,
          
          // Classifications
          issue_type: analysis.issue_type,
          issue_category: analysis.issue_category,
          issue_layer: analysis.issue_layer,
          
          // 🧠 NEW: Psychological Profile (Gold Nugget #1)
          psychological_profile: analysis.psychological_profile ? {
            primary_motivation: analysis.psychological_profile.primary_motivation || '',
            motivation_evidence: analysis.psychological_profile.motivation_evidence || '',
            hidden_driver: analysis.psychological_profile.hidden_driver || '',
            hidden_driver_signal: analysis.psychological_profile.hidden_driver_signal || '',
            emotional_state: analysis.psychological_profile.emotional_state || '',
            emotional_evidence: analysis.psychological_profile.emotional_evidence || '',
            power_dynamic: analysis.psychological_profile.power_dynamic || '',
            power_dynamic_evidence: analysis.psychological_profile.power_dynamic_evidence || ''
          } : null,
          
          // Diagnostic (nested object)
          diagnostic_state: analysis.diagnostic?.state,
          diagnostic_so_what: analysis.diagnostic?.so_what,
          
          // Chart type is determined dynamically in dashboard, not stored in DB
          // (Removed chart_type field - doesn't exist in database schema)
          
          // References (arrays joined with bullets)
          references_internal: joinWithBullets(analysis.references?.internal),
          references_external: joinWithBullets(analysis.references?.external),
          
          // Metadata (separate columns as requested)
          assistant_id: metadata.assistant_id,
          vector_store_id: metadata.vector_store_id,
          run_id: metadata.run_id,
          thread_id: metadata.thread_id,
          
          // Timestamps
          updated_at: new Date().toISOString(),
          processing_completed_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Failed to update Supabase with results:', updateError);
        throw new Error(`Failed to save results: ${updateError.message}`);
      }
      
      console.log('✅ ✅ ✅ COMPLETE! Results saved to Supabase');
      
      // STEP 5B: Update submissions table to completed
      console.log('📝 Step 5B: Marking submission as completed...');
      
      const { error: submissionUpdateError } = await supabase
        .from('submissions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('job_id', jobId);
      
      if (submissionUpdateError) {
        console.error('⚠️ Warning: Failed to update submission status:', submissionUpdateError);
        // Don't throw - analysis is complete, this is just for UI polling
      } else {
        console.log('✅ Submission marked as completed');
      }
      
      // STEP 6: Return the complete analysis
      const processedAnalysis: ProcessedAnalysis = {
        id: jobId,
        jobId: jobId,
        userId: userId,
        title: analysis.tl_dr,
        inputText: inputText,
        summary: analysis.tl_dr,
        
        powerScore: analysis.power,
        gravityScore: analysis.gravity,
        riskScore: analysis.risk,
        confidenceLevel: analysis.issue_confidence_pct,
        
        whatsHappening: analysis.whats_happening,
        whyItMatters: analysis.why_it_matters,
        narrativeSummary: analysis.narrative_summary,
        
        immediateMove: joinWithBullets(analysis.moves?.immediate_action),
        strategicTool: joinWithBullets(analysis.moves?.strategic_tool),
        analyticalCheck: joinWithBullets(analysis.moves?.analytical_check),
        longTermFix: joinWithBullets(analysis.moves?.long_term_fix),
        
        powerExplanation: analysis.explanations?.power,
        gravityExplanation: analysis.explanations?.gravity,
        riskExplanation: analysis.explanations?.risk,
        
        issueType: analysis.issue_type,
        issueCategory: analysis.issue_category,
        issueLayer: analysis.issue_layer,
        
        // 🧠 NEW: Psychological Profile (Gold Nugget #1)
        psychologicalProfile: analysis.psychological_profile ? {
          primaryMotivation: analysis.psychological_profile.primary_motivation || '',
          motivationEvidence: analysis.psychological_profile.motivation_evidence || '',
          hiddenDriver: analysis.psychological_profile.hidden_driver || '',
          hiddenDriverSignal: analysis.psychological_profile.hidden_driver_signal || '',
          emotionalState: analysis.psychological_profile.emotional_state || '',
          emotionalEvidence: analysis.psychological_profile.emotional_evidence || '',
          powerDynamic: analysis.psychological_profile.power_dynamic || '',
          powerDynamicEvidence: analysis.psychological_profile.power_dynamic_evidence || ''
        } : undefined,
        
        // NO diagnosis_primary/secondary/tertiary - they don't exist in database
        
        status: 'completed',
        isReady: true,
        createdAt: now,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: processedAnalysis,
        jobId: jobId
      };
      
    } catch (error) {
      console.error('💥 OpenAI Direct submission failed:', error);
      
      // Update record with error status
      try {
        await supabase
          .from('analyses')
          .update({
            status: 'error',
            error_json: { 
              message: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);
        
        // Also update submissions table
        await supabase
          .from('submissions')
          .update({
            status: 'error',
            updated_at: new Date().toISOString()
          })
          .eq('job_id', jobId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
      
      return {
        success: false,
        jobId: jobId,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Call OpenAI Assistant API with your assistant ID
   * Returns the analysis and metadata
   */
  private async callOpenAIAssistant(
    inputText: string,
    apiKey: string
  ): Promise<{ analysis: any; metadata: any }> {
    console.log('🤖 Calling OpenAI Assistant API...');
    
    // Your OpenAI Assistant ID (use centralized config)
    const ASSISTANT_ID = getOpenAIAssistantID();
    
    if (!ASSISTANT_ID) {
      throw new Error(
        'OpenAI Assistant ID not configured!\n\n' +
        'For Figma Make:\n' +
        '1. Get your Assistant ID from: https://platform.openai.com/assistants\n' +
        '2. Add it to /utils/openai-config.ts in FIGMA_MAKE_ASSISTANT_ID\n\n' +
        'For Vercel:\n' +
        '1. Add VITE_OPENAI_ASSISTANT_ID to .env\n' +
        '2. Deploy to Vercel\n'
      );
    }
    
    try {
      // STEP 1: Create a thread
      console.log('📝 Creating thread...');
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      });
      
      if (!threadResponse.ok) {
        const errorData = await threadResponse.json();
        throw new Error(`Failed to create thread: ${JSON.stringify(errorData)}`);
      }
      
      const thread = await threadResponse.json();
      console.log(`✅ Thread created: ${thread.id}`);
      
      // STEP 2: Add message to thread
      console.log('💬 Adding message to thread...');
      const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: inputText
        })
      });
      
      if (!messageResponse.ok) {
        const errorData = await messageResponse.json();
        throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
      }
      
      console.log('✅ Message added');
      
      // STEP 3: Run the assistant (with vector store for your frameworks and book)
      console.log('🏃 Running assistant with JSON schema validation...');
      
      const VECTOR_STORE_ID = getOpenAIVectorStoreID();
      
      const runPayload: any = {
        assistant_id: ASSISTANT_ID,
        // Use JSON Schema for structured, validated responses
        // This schema EXACTLY matches the MaverickAI database structure
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "maverick_analysis",
            strict: true,
            schema: {
              type: "object",
              properties: {
                // CORE SCORES (0-100) - MATCH DATABASE FIELD NAMES!
                power: {
                  type: "number",
                  description: "Power dynamics score (0-100)"
                },
                gravity: {
                  type: "number",
                  description: "Gravity/seriousness score (0-100)"
                },
                risk: {
                  type: "number",
                  description: "Risk/danger score (0-100)"
                },
                issue_confidence_pct: {
                  type: "number",
                  description: "Confidence in analysis (0-100)"
                },
                // SUMMARY FIELDS
                tl_dr: {
                  type: "string",
                  description: "One-sentence summary"
                },
                snapshot: {
                  type: "string",
                  description: "Quick snapshot (2-3 sentences)"
                },
                whats_happening: {
                  type: "string",
                  description: "What's happening in this situation"
                },
                why_it_matters: {
                  type: "string",
                  description: "Why this matters"
                },
                narrative_summary: {
                  type: "string",
                  description: "Detailed narrative analysis"
                },
                // STRATEGIC MOVES (NESTED OBJECT)
                moves: {
                  type: "object",
                  properties: {
                    immediate_action: {
                      type: "array",
                      description: "Immediate actions to take",
                      items: { type: "string" }
                    },
                    strategic_tool: {
                      type: "array",
                      description: "Strategic tools to use",
                      items: { type: "string" }
                    },
                    analytical_check: {
                      type: "array",
                      description: "Analytical checks to perform",
                      items: { type: "string" }
                    },
                    long_term_fix: {
                      type: "array",
                      description: "Long-term fixes",
                      items: { type: "string" }
                    }
                  },
                  required: ["immediate_action", "strategic_tool", "analytical_check", "long_term_fix"],
                  additionalProperties: false
                },
                // EXPLANATIONS (NESTED OBJECT)
                explanations: {
                  type: "object",
                  properties: {
                    power: {
                      type: "string",
                      description: "Explanation of power score"
                    },
                    gravity: {
                      type: "string",
                      description: "Explanation of gravity score"
                    },
                    risk: {
                      type: "string",
                      description: "Explanation of risk score"
                    }
                  },
                  required: ["power", "gravity", "risk"],
                  additionalProperties: false
                },
                // DEFINITIONS (NESTED OBJECT)
                definitions: {
                  type: "object",
                  properties: {
                    power: {
                      type: "string",
                      description: "Definition of power in this context"
                    },
                    gravity: {
                      type: "string",
                      description: "Definition of gravity in this context"
                    },
                    risk: {
                      type: "string",
                      description: "Definition of risk in this context"
                    }
                  },
                  required: ["power", "gravity", "risk"],
                  additionalProperties: false
                },
                // CLASSIFICATIONS
                issue_type: {
                  type: "string",
                  description: "Type of issue (e.g., workplace, personal, strategic)"
                },
                issue_category: {
                  type: "string",
                  description: "Category (e.g., conflict, negotiation, leadership)"
                },
                issue_layer: {
                  type: "string",
                  description: "Layer (e.g., surface, structural, systemic)"
                },
                // DIAGNOSTIC (NESTED OBJECT)
                diagnostic: {
                  type: "object",
                  properties: {
                    state: {
                      type: "string",
                      description: "Current state description"
                    },
                    so_what: {
                      type: "string",
                      description: "So what? Why does this matter?"
                    }
                  },
                  required: ["state", "so_what"],
                  additionalProperties: false
                },
                // REFERENCES (NESTED OBJECT)
                references: {
                  type: "object",
                  properties: {
                    internal: {
                      type: "array",
                      description: "Internal references (your book/frameworks)",
                      items: { type: "string" }
                    },
                    external: {
                      type: "array",
                      description: "External references",
                      items: { type: "string" }
                    }
                  },
                  required: ["internal", "external"],
                  additionalProperties: false
                }
              },
              required: [
                "power",
                "gravity",
                "risk",
                "issue_confidence_pct",
                "tl_dr",
                "snapshot",
                "whats_happening",
                "why_it_matters",
                "narrative_summary",
                "moves",
                "explanations",
                "definitions",
                "issue_type",
                "issue_category",
                "issue_layer",
                "diagnostic",
                "references"
              ],
              additionalProperties: false
            }
          }
        }
      };
      
      console.log('🤖 Using JSON Schema for structured response validation');
      
      // Add vector store if configured (for your book extracts and frameworks)
      if (VECTOR_STORE_ID) {
        console.log(`📚 Attaching vector store: ${VECTOR_STORE_ID}`);
        runPayload.tool_resources = {
          file_search: {
            vector_store_ids: [VECTOR_STORE_ID]
          }
        };
      }
      
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify(runPayload)
      });
      
      if (!runResponse.ok) {
        const errorData = await runResponse.json();
        throw new Error(`Failed to run assistant: ${JSON.stringify(errorData)}`);
      }
      
      const run = await runResponse.json();
      console.log(`✅ Run started: ${run.id}`);
      
      // STEP 4: Poll for completion
      console.log('⏳ Waiting for assistant to complete...');
      let runStatus = run.status;
      let attempts = 0;
      const maxAttempts = 60; // 60 attempts = ~2 minutes max
      
      while (runStatus !== 'completed' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });
        
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
        attempts++;
        
        console.log(`⏳ Status: ${runStatus} (attempt ${attempts}/${maxAttempts})`);
        
        if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
          throw new Error(`Assistant run ${runStatus}: ${statusData.last_error?.message || 'Unknown error'}`);
        }
      }
      
      if (runStatus !== 'completed') {
        throw new Error('Assistant run timed out');
      }
      
      console.log('✅ Assistant completed!');
      
      // STEP 5: Get the messages
      console.log('📨 Retrieving assistant response...');
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!messagesResponse.ok) {
        const errorData = await messagesResponse.json();
        throw new Error(`Failed to retrieve messages: ${JSON.stringify(errorData)}`);
      }
      
      const messages = await messagesResponse.json();
      
      // Get the assistant's response (first message)
      const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');
      
      if (!assistantMessage) {
        throw new Error('No assistant response found');
      }
      
      // Extract text content
      const textContent = assistantMessage.content.find((c: any) => c.type === 'text');
      const responseText = textContent?.text?.value || '';
      
      console.log('✅ Response received');
      console.log(`📄 Response length: ${responseText.length} chars`);
      
      // STEP 6: Parse the JSON response
      console.log('🔍 Parsing JSON response...');
      const analysis = this.parseOpenAIResponse(responseText);
      
      // Return analysis + metadata
      return {
        analysis,
        metadata: {
          assistant_id: ASSISTANT_ID,
          vector_store_id: VECTOR_STORE_ID || null,
          run_id: run.id,
          thread_id: thread.id
        }
      };
      
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Parse the OpenAI assistant response
   * Expects the EXACT JSON schema you defined
   */
  private parseOpenAIResponse(responseText: string): any {
    try {
      // Try to extract JSON from the response
      let jsonStr = responseText.trim();
      
      // If wrapped in markdown code blocks, extract
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const data = JSON.parse(jsonStr);
      
      // Return the parsed data exactly as OpenAI returns it
      // This matches your JSON schema perfectly
      return data;
      
    } catch (error) {
      console.error('❌ Failed to parse OpenAI response:', error);
      console.log('Raw response:', responseText);
      throw new Error('Failed to parse OpenAI response - ensure your assistant returns valid JSON');
    }
  }
}

// Singleton instance
export const openAIDirectService = new OpenAIDirectService();

/**
 * Export a simple function for use in App.tsx
 * NOTE: payment_plan is fetched from users table, not passed as parameter
 * NOTE: payment_transactions table is populated by Stripe webhooks
 */
export async function submitTextAnalysis(
  text: string,
  userId: string,
  userEmail: string
): Promise<{ 
  success: boolean; 
  data?: ProcessedAnalysis;
  jobId: string; 
  error?: string;
}> {
  return openAIDirectService.submitTextAnalysis(text, userId, userEmail);
}
