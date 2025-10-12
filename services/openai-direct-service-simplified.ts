/**
 * 🎯 SIMPLIFIED OPENAI DIRECT SERVICE
 * 
 * Changes from previous version:
 * - ✅ Only one ID field (id)
 * - ✅ Clearer logging
 * - ✅ Better error handling
 * - ✅ Simpler flow
 */

import { supabase } from '../utils/supabase/client';
import { db } from '../utils/database/database-adapter';
import { getEnv } from '../utils/env-adapter';
import { getOpenAIKey } from '../utils/openai-config';

// Types
interface OpenAIAnalysis {
  power: number;
  gravity: number;
  risk: number;
  issue_confidence_pct: number;
  tl_dr: string;
  snapshot: string;
  whats_happening: string;
  why_it_matters: string;
  narrative_summary: string;
  moves?: {
    immediate_action?: string[];
    strategic_tool?: string[];
    analytical_check?: string[];
    long_term_fix?: string[];
  };
  explanations?: {
    power?: string;
    gravity?: string;
    risk?: string;
  };
  definitions?: {
    power?: string;
    gravity?: string;
    risk?: string;
  };
  issue_type?: string;
  issue_category?: string;
  issue_layer?: string;
}

interface ProcessedAnalysis {
  id: string;
  userId: string;
  inputText: string;
  summary: string;
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  status: string;
  isReady: boolean;
}

const joinWithBullets = (arr?: string[]): string => {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n');
};

class OpenAIDirectServiceSimplified {
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
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
    const supabase = createClient();
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
   * Submit text-only query directly to OpenAI (bypasses Make.com)
   * @param userId - User's UUID from auth.users
   * @param userEmail - User's email
   * @param inputText - The query text
   * @returns Promise with success status, analysis data, and analysisId
   * 
   * NOTE: payment_plan is stored in users table, not analyses table
   * NOTE: payment_transactions table is populated by Stripe webhooks
   */
  async submitQuery(
    userId: string,
    userEmail: string,
    inputText: string
  ): Promise<{ success: boolean; data?: ProcessedAnalysis; error?: string; analysisId?: string }> {
    
    const analysisId = this.generateUUID();
    const now = new Date().toISOString();
    const supabase = createClient();

    console.log('\n🚀 ═══════════════════════════════════════════════════════');
    console.log('   OPENAI DIRECT SERVICE - SIMPLIFIED VERSION');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`📋 Analysis ID: ${analysisId}`);
    console.log(`👤 User: ${userEmail}`);
    console.log(`📝 Query: ${inputText.substring(0, 100)}...`);
    
    try {
      // ──────────────────────────────────────────────────────────
      // STEP 1: Create pending records in BOTH tables
      // ──────────────────────────────────────────────────────────
      console.log('\n📝 STEP 1: Creating database records...');
      
      // 1A. Create analysis record using database adapter
      const analysisResult = await db.createAnalysis({
        id: analysisId,
        user_id: userId,
        email: userEmail,
        input_text: inputText,
        status: 'processing',
        is_ready: false,
        created_at: now,
        updated_at: now
      });
      
      if (!analysisResult.success) {
        console.error('❌ Failed to create analysis record:', analysisResult.error);
        throw new Error(`Database error: ${analysisResult.error}`);
      }
      
      console.log('   ✅ Analysis record created');
      
      // 1B. Create submission record using database adapter
      const submissionResult = await db.createSubmission({
        analysis_id: analysisId,
        user_id: userId,
        email: userEmail,
        input_querytext: inputText,
        status: 'pending',
        created_at: now,
        updated_at: now
      });
      
      if (!submissionResult.success) {
        console.error('❌ Failed to create submission record:', submissionResult.error);
        throw new Error(`Submission error: ${submissionResult.error}`);
      }
      
      console.log('   ✅ Submission record created');
      console.log('   ✅ Both records created successfully!');
      
      // ──────────────────────────────────────────────────────────
      // STEP 2: Get OpenAI credentials (using env-adapter)
      // ──────────────────────────────────────────────────────────
      console.log('\n🔑 STEP 2: Checking OpenAI credentials...');
      
      let OPENAI_API_KEY: string;
      let ASSISTANT_ID: string | undefined;
      
      try {
        OPENAI_API_KEY = getOpenAIKey();
        console.log('   ✅ API key found');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'OpenAI API key not configured';
        console.error(`❌ ${errorMsg}`);
        await this.updateToError(supabase, analysisId, errorMsg);
        throw error;
      }
      
      ASSISTANT_ID = getEnv('OPENAI_ASSISTANT_ID') || getEnv('VITE_OPENAI_ASSISTANT_ID');
      
      if (!ASSISTANT_ID) {
        const errorMsg = 'OpenAI Assistant ID not configured - please add VITE_OPENAI_ASSISTANT_ID to your environment';
        console.error(`❌ ${errorMsg}`);
        await this.updateToError(supabase, analysisId, errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('   ✅ Assistant ID found');
      
      // ──────────────────────────────────────────────────────────
      // STEP 3: Call OpenAI Assistant
      // ──────────────────────────────────────────────────────────
      console.log('\n🤖 STEP 3: Calling OpenAI Assistant API...');
      
      await supabase
        .from('analyses')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', analysisId);
      
      const result = await this.callOpenAI(inputText, OPENAI_API_KEY, ASSISTANT_ID);
      
      console.log('   ✅ OpenAI analysis complete!');
      console.log(`   📊 Power: ${result.power} | Gravity: ${result.gravity} | Risk: ${result.risk}`);
      
      // ──────────────────────────────────────────────────────────
      // STEP 4: Save results to database
      // ──────────────────────────────────────────────────────────
      console.log('\n💾 STEP 4: Saving results...');
      
      const radarStability = Math.round(100 - result.power);
      const radarStrategy = Math.round((result.power + result.risk) / 2);
      
      await supabase
        .from('analyses')
        .update({
          status: 'completed',
          is_ready: true,
          
          // Scores
          power_score: result.power,
          gravity_score: result.gravity,
          risk_score: result.risk,
          confidence_level: result.issue_confidence_pct,
          
          // Radar (duplicates)
          radar_control: result.risk,
          radar_gravity: result.gravity,
          radar_confidence: result.issue_confidence_pct,
          radar_stability: radarStability,
          radar_strategy: radarStrategy,
          
          // Summaries
          summary: result.tl_dr,
          tl_dr: result.tl_dr,
          snapshot: result.snapshot,
          whats_happening: result.whats_happening,
          why_it_matters: result.why_it_matters,
          narrative_summary: result.narrative_summary,
          
          // Moves
          immediate_move: joinWithBullets(result.moves?.immediate_action),
          strategic_tool: joinWithBullets(result.moves?.strategic_tool),
          analytical_check: joinWithBullets(result.moves?.analytical_check),
          long_term_fix: joinWithBullets(result.moves?.long_term_fix),
          
          // Explanations
          power_explanation: result.explanations?.power,
          gravity_explanation: result.explanations?.gravity,
          risk_explanation: result.explanations?.risk,
          
          // Definitions
          power_definition: result.definitions?.power,
          gravity_definition: result.definitions?.gravity,
          risk_definition: result.definitions?.risk,
          
          // Categories
          issue_type: result.issue_type,
          issue_category: result.issue_category,
          issue_layer: result.issue_layer,
          
          // Timestamps
          updated_at: new Date().toISOString(),
          processing_completed_at: new Date().toISOString()
        })
        .eq('id', analysisId);
      
      console.log('   ✅ Analysis data saved');
      
      // Update submission status
      await supabase
        .from('submissions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('analysis_id', analysisId);
      
      console.log('   ✅ Submission marked complete');
      
      console.log('\n✅ ═══════════════════════════════════════════════════════');
      console.log('   SUCCESS! Analysis complete and saved');
      console.log('═══════════════════════════════════════════════════════\n');
      
      return {
        success: true,
        analysisId: analysisId,
        data: {
          id: analysisId,
          userId: userId,
          inputText: inputText,
          summary: result.tl_dr,
          powerScore: result.power,
          gravityScore: result.gravity,
          riskScore: result.risk,
          status: 'completed',
          isReady: true
        }
      };
      
    } catch (error) {
      console.error('\n💥 ═══════════════════════════════════════════════════════');
      console.error('   ERROR OCCURRED');
      console.error('═══════════════════════════════════════════════════════');
      console.error(error);
      
      await this.updateToError(supabase, analysisId, error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async updateToError(supabase: any, analysisId: string, errorMessage: string) {
    try {
      await supabase
        .from('analyses')
        .update({
          status: 'error',
          error_json: { message: errorMessage, timestamp: new Date().toISOString() },
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);
      
      await supabase
        .from('submissions')
        .update({
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('analysis_id', analysisId);
    } catch (e) {
      console.error('Failed to update error status:', e);
    }
  }
  
  private async callOpenAI(inputText: string, apiKey: string, assistantId: string): Promise<OpenAIAnalysis> {
    console.log('   🔄 Creating thread...');
    
    // Create thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });
    
    if (!threadResponse.ok) {
      throw new Error(`Thread creation failed: ${await threadResponse.text()}`);
    }
    
    const thread = await threadResponse.json();
    console.log(`   ✅ Thread created: ${thread.id}`);
    
    // Add message
    console.log('   🔄 Adding message...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: inputText
      })
    });
    
    if (!messageResponse.ok) {
      throw new Error(`Message creation failed: ${await messageResponse.text()}`);
    }
    
    console.log('   ✅ Message added');
    
    // Run assistant
    console.log('   🔄 Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });
    
    if (!runResponse.ok) {
      throw new Error(`Run creation failed: ${await runResponse.text()}`);
    }
    
    const run = await runResponse.json();
    console.log(`   ✅ Run started: ${run.id}`);
    
    // Poll for completion
    console.log('   🔄 Waiting for completion...');
    let runStatus = run;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max
    
    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      runStatus = await statusResponse.json();
      attempts++;
      
      console.log(`   ⏳ Status: ${runStatus.status} (${attempts * 5}s elapsed)`);
      
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      }
    }
    
    if (runStatus.status !== 'completed') {
      throw new Error('Run timed out after 5 minutes');
    }
    
    console.log('   ✅ Run completed!');
    
    // Get messages
    console.log('   🔄 Fetching response...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find((m: any) => m.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }
    
    const content = assistantMessage.content[0].text.value;
    console.log('   ✅ Response received');
    
    // Parse JSON
    console.log('   🔄 Parsing JSON...');
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    console.log('   ✅ JSON parsed successfully');
    
    return analysis;
  }
}

export const openAIDirectServiceSimplified = new OpenAIDirectServiceSimplified();
