/**
 * Secure Vercel Serverless Function - OpenAI Analysis
 * API keys stay on server - NEVER exposed to browser
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Server-side environment variables (SECURE - not exposed to browser)
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.VITE_OPENAI_ASSISTANT_ID || process.env.OPENAI_ASSISTANT_ID;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Validate environment variables on module load
console.log('🔍 Environment variable check:');
console.log(`  OPENAI_API_KEY: ${OPENAI_API_KEY ? 'SET (length: ' + OPENAI_API_KEY.length + ')' : 'MISSING'}`);
console.log(`  OPENAI_ASSISTANT_ID: ${OPENAI_ASSISTANT_ID ? 'SET (' + OPENAI_ASSISTANT_ID + ')' : 'MISSING'}`);
console.log(`  SUPABASE_URL: ${SUPABASE_URL ? 'SET' : 'MISSING'}`);
console.log(`  SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'SET (length: ' + SUPABASE_ANON_KEY.length + ')' : 'MISSING'}`);

if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
  console.error('❌ CRITICAL: Missing OpenAI configuration in environment variables');
  console.error('   Add VITE_OPENAI_API_KEY and VITE_OPENAI_ASSISTANT_ID in Vercel');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ CRITICAL: Missing Supabase configuration in environment variables');
  console.error('   Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel');
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

// Helper function to join array of strings with bullet points
function joinWithBullets(arr: string[] | undefined): string {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n');
}

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  console.log('🚀 /api/analyze started');

  try {
    const { inputText, userId, userEmail } = req.body;

    // Validation
    if (!inputText || inputText.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Input text must be at least 10 characters',
        success: false 
      });
    }

    if (!userId || !userEmail) {
      return res.status(400).json({ 
        error: 'User ID and email are required',
        success: false 
      });
    }

    const jobId = generateUUID();
    const now = new Date().toISOString();

    console.log(`📋 Job ID: ${jobId}`);
    console.log(`👤 User: ${userEmail}`);
    console.log(`📝 Text length: ${inputText.length} chars`);

    // STEP 1: Create pending record in Supabase
    console.log('📝 Step 1: Creating pending record...');
    
    const { error: insertError } = await supabase
      .from('analyses')
      .insert({
        id: jobId,
        query_id: jobId,
        job_id: jobId,
        user_id: userId,
        input_querytext: inputText,
        status: 'processing',
        is_ready: false,
        created_at: now,
        updated_at: now,
        processing_started_at: now
      });

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return res.status(500).json({ 
        error: `Database error: ${insertError.message}`,
        success: false 
      });
    }

    console.log('✅ Pending record created');

    // STEP 2: Verify Assistant Exists and Has Instructions
    console.log('🤖 Step 2A: Verifying OpenAI Assistant...');
    console.log(`🔑 Assistant ID: ${OPENAI_ASSISTANT_ID}`);
    console.log(`🔑 API Key present: ${OPENAI_API_KEY ? 'YES' : 'NO'}`);
    
    // Retrieve the assistant to verify it exists and has instructions
    const assistantResponse = await fetch(`https://api.openai.com/v1/assistants/${OPENAI_ASSISTANT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      console.error('❌ Assistant retrieval failed:', errorText);
      console.error('❌ Status:', assistantResponse.status);
      
      // Update database with error
      await supabase
        .from('analyses')
        .update({
          status: 'failed',
          is_ready: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      throw new Error(`OpenAI Assistant not found or invalid: ${errorText}`);
    }
    
    const assistant = await assistantResponse.json();
    console.log(`✅ Assistant found: ${assistant.name || 'Unnamed'}`);
    console.log(`📋 Model: ${assistant.model}`);
    console.log(`📝 Has instructions: ${assistant.instructions ? 'YES' : 'NO'}`);
    
    if (!assistant.instructions || assistant.instructions.trim().length < 10) {
      console.error('❌ CRITICAL: Assistant has no instructions configured!');
      console.error('   Go to https://platform.openai.com/assistants and add instructions');
      
      // Update database with error
      await supabase
        .from('analyses')
        .update({
          status: 'failed',
          is_ready: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      throw new Error('OpenAI Assistant has no instructions configured. Please add instructions in the OpenAI platform.');
    }
    
    // STEP 2B: Create Thread and Run
    console.log('🤖 Step 2B: Creating thread and run...');
    console.log(`📝 Input text preview: "${inputText.substring(0, 100)}..."`);
    
    // Create thread
    const threadPayload = {
      messages: [{
        role: 'user',
        content: inputText
      }]
    };
    
    console.log('📤 Creating thread with message...');
    
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify(threadPayload)
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('❌ Thread creation failed:', errorText);
      console.error('❌ Status:', threadResponse.status);
      console.error('❌ Status Text:', threadResponse.statusText);
      
      // Update database with error
      await supabase
        .from('analyses')
        .update({
          status: 'failed',
          is_ready: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      throw new Error(`OpenAI thread creation failed: ${errorText}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log(`📎 Thread created: ${threadId}`);

    // Create run with additional_instructions to ensure proper analysis
    const runPayload = {
      assistant_id: OPENAI_ASSISTANT_ID,
      additional_instructions: 'Analyze the following situation and provide a complete psychological power dynamics analysis in JSON format according to your instructions.'
    };
    
    console.log('📤 Creating run with assistant:', OPENAI_ASSISTANT_ID);
    
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify(runPayload)
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('❌ Run creation failed:', errorText);
      console.error('❌ Status:', runResponse.status);
      console.error('❌ Status Text:', runResponse.statusText);
      
      // Update database with error
      await supabase
        .from('analyses')
        .update({
          status: 'failed',
          is_ready: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      throw new Error(`OpenAI run creation failed: ${errorText}`);
    }

    const run = await runResponse.json();
    const runId = run.id;
    console.log(`🏃 Run started: ${runId}`);

    // STEP 3: Poll for completion (max 60 seconds)
    console.log('⏳ Step 3: Polling for results...');
    
    let attempts = 0;
    const maxAttempts = 20;
    let runStatus = run.status;
    let runData = run;

    while (attempts < maxAttempts && !['completed', 'failed', 'cancelled', 'expired'].includes(runStatus)) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second intervals
      attempts++;

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (statusResponse.ok) {
        runData = await statusResponse.json();
        runStatus = runData.status;
        console.log(`🔄 Poll ${attempts}/${maxAttempts}: ${runStatus}`);
      }
    }

    if (runStatus !== 'completed') {
      console.error(`❌ Run did not complete: ${runStatus}`);
      throw new Error(`OpenAI run failed with status: ${runStatus}`);
    }

    console.log('✅ Run completed!');

    // STEP 4: Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!messagesResponse.ok) {
      throw new Error('Failed to fetch messages');
    }

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    const responseText = assistantMessage.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text.value)
      .join('\n');

    console.log('📄 Response received, parsing JSON...');

    // Parse JSON response
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    // STEP 5: Update Supabase with results
    console.log('💾 Step 5: Saving results to database...');

    const updateData = {
      // Analysis content
      tl_dr: parsedResponse.tl_dr || parsedResponse.summary || '',
      whats_happening: parsedResponse.whats_happening || '',
      why_it_matters: parsedResponse.why_it_matters || '',
      narrative_summary: parsedResponse.narrative_summary || '',
      
      // Scores
      power_score: String(parsedResponse.power_score || 0),
      gravity_score: String(parsedResponse.gravity_score || 0),
      risk_score: String(parsedResponse.risk_score || 0),
      issue_confidence_pct: String(parsedResponse.issue_confidence_pct || 0),
      
      // Explanations
      power_expl: parsedResponse.power_expl || '',
      gravity_expl: parsedResponse.gravity_expl || '',
      risk_expl: parsedResponse.risk_expl || '',
      
      // Strategic moves
      immediate_move: parsedResponse.immediate_move || '',
      strategic_tool: parsedResponse.strategic_tool || '',
      analytical_check: parsedResponse.analytical_check || '',
      long_term_fix: parsedResponse.long_term_fix || '',
      
      // Classifications
      issue_type: parsedResponse.issue_type || '',
      issue_category: parsedResponse.issue_category || '',
      issue_layer: parsedResponse.issue_layer || '',
      
      // Diagnostics
      diagnostic_state: parsedResponse.diagnostic_state || '',
      diagnostic_so_what: parsedResponse.diagnostic_so_what || '',
      
      // Arrays with bullet points
      radar_red_1: joinWithBullets(parsedResponse.radar_red_1),
      radar_red_2: joinWithBullets(parsedResponse.radar_red_2),
      radar_red_3: joinWithBullets(parsedResponse.radar_red_3),
      tactical_moves: joinWithBullets(parsedResponse.tactical_moves),
      
      // Psychological profile
      psychological_profile: parsedResponse.psychological_profile || null,
      
      // Status
      status: 'completed',
      is_ready: true,
      updated_at: new Date().toISOString(),
      processing_completed_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('analyses')
      .update(updateData)
      .eq('id', jobId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw new Error(`Failed to save results: ${updateError.message}`);
    }

    const elapsedTime = Date.now() - startTime;
    console.log(`✅ Analysis complete in ${elapsedTime}ms (${(elapsedTime/1000).toFixed(1)}s)`);

    // Return success
    return res.status(200).json({
      success: true,
      jobId,
      message: 'Analysis completed successfully',
      elapsedTime,
      data: {
        id: jobId,
        jobId,
        userId,
        title: parsedResponse.tl_dr || 'Strategic Analysis Complete',
        inputText,
        summary: parsedResponse.tl_dr || '',
        
        powerScore: parseFloat(parsedResponse.power_score) || 0,
        gravityScore: parseFloat(parsedResponse.gravity_score) || 0,
        riskScore: parseFloat(parsedResponse.risk_score) || 0,
        confidenceLevel: parseFloat(parsedResponse.issue_confidence_pct) || 0,
        
        whatsHappening: parsedResponse.whats_happening || '',
        whyItMatters: parsedResponse.why_it_matters || '',
        narrativeSummary: parsedResponse.narrative_summary || '',
        
        immediateMove: parsedResponse.immediate_move || '',
        strategicTool: parsedResponse.strategic_tool || '',
        analyticalCheck: parsedResponse.analytical_check || '',
        longTermFix: parsedResponse.long_term_fix || '',
        
        powerExplanation: parsedResponse.power_expl || '',
        gravityExplanation: parsedResponse.gravity_expl || '',
        riskExplanation: parsedResponse.risk_expl || '',
        
        issueType: parsedResponse.issue_type || '',
        issueCategory: parsedResponse.issue_category || '',
        issueLayer: parsedResponse.issue_layer || '',
        
        diagnosticState: parsedResponse.diagnostic_state || '',
        diagnosticSoWhat: parsedResponse.diagnostic_so_what || '',
        
        status: 'completed',
        isReady: true,
        createdAt: now,
        updatedAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error('❌ Analysis failed:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Try to extract more details from the error
    let errorMessage = 'Analysis failed';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check if it's an OpenAI API error
      if (errorMessage.includes('OpenAI')) {
        errorDetails = '\n\nPossible causes:\n' +
          '1. OpenAI API key is invalid or expired\n' +
          '2. OpenAI Assistant ID is incorrect\n' +
          '3. Assistant has no instructions configured\n' +
          '4. OpenAI API is down or rate limited\n\n' +
          'Check Vercel logs for details.';
      }
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage + errorDetails,
      elapsedTime,
      timestamp: new Date().toISOString()
    });
  }
}
