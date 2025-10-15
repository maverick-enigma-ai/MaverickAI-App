/**
 * Secure Vercel Serverless Function - OpenAI Analysis with File Upload Support
 * API keys stay on server - NEVER exposed to browser
 * Handles both text-only and text+files submissions
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Server-side environment variables (SECURE - not exposed to browser)
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.VITE_OPENAI_ASSISTANT_ID || process.env.OPENAI_ASSISTANT_ID;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🔐 Use SERVICE_ROLE_KEY for server-side operations (bypasses RLS, full database access)
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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

  // Declare variables outside try-catch so they're available in catch block
  let inputText: string = '';
  let userId: string | undefined;
  let userEmail: string | undefined;
  let files: any[] | undefined;
  let jobId: string = '';

  try {
    // ACCEPT BOTH PARAMETER FORMATS
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // Old format: { prompt, attachments }
    // New format: { inputText, userId, userEmail, files }
    inputText = body.inputText || body.prompt;
    userId = body.userId;
    userEmail = body.userEmail;
    files = body.files; // Array of { name, type, size, data }

    // Validation
    if (!inputText || inputText.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Input text must be at least 10 characters',
        success: false 
      });
    }

    jobId = generateUUID();
    const now = new Date().toISOString();

    console.log(`📋 Job ID: ${jobId}`);
    console.log(`👤 User: ${userEmail || 'unknown'}`);
    console.log(`📝 Text length: ${inputText.length} chars`);
    console.log(`📎 Files: ${files?.length || 0}`);
    console.log(`🔑 Assistant ID: ${OPENAI_ASSISTANT_ID}`);

    // STEP 1: Create pending records in BOTH tables (if userId provided)
    if (userId && userEmail) {
      console.log('📝 Creating Supabase records...');
      
      // 1A: Insert into analyses table
      await supabase
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
      
      // 1B: Insert into submissions table (tracks UI state)
      await supabase
        .from('submissions')
        .insert({
          id: generateUUID(),
          analysis_id: jobId,
          user_id: userId,
          email: userEmail,
          status: 'processing',
          input_querytext: inputText,
          job_id: jobId,
          query_id: jobId,
          created_at: now,
          updated_at: now
        });
      
      console.log('✅ Created records in analyses + submissions tables');
    }

    // STEP 2: Verify Assistant
    console.log('🤖 Verifying OpenAI Assistant...');
    
    const assistantResponse = await fetch(`https://api.openai.com/v1/assistants/${OPENAI_ASSISTANT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      console.error('❌ Assistant not found:', errorText);
      throw new Error(`Assistant not found: ${errorText}`);
    }
    
    const assistant = await assistantResponse.json();
    console.log(`✅ Assistant: ${assistant.name}`);
    console.log(`📋 Model: ${assistant.model}`);
    console.log(`📝 Has instructions: ${assistant.instructions ? 'YES' : 'NO'}`);

    // STEP 3: Handle File Uploads (if present)
    let vectorStoreId: string | undefined;
    let visionAnalysis: string | undefined;
    
    if (files && files.length > 0) {
      console.log(`📎 Processing ${files.length} file(s)...`);
      
      try {
        // Helper function to check if file is an image
        const isImage = (fileType: string, fileName: string): boolean => {
          const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const lowerName = fileName.toLowerCase();
          
          return imageTypes.includes(fileType) || 
                 imageExtensions.some(ext => lowerName.endsWith(ext));
        };
        
        // Separate images from documents
        const imageFiles = files.filter(f => isImage(f.type, f.name));
        const documentFiles = files.filter(f => !isImage(f.type, f.name));
        
        console.log(`🖼️  Images: ${imageFiles.length}`);
        console.log(`📄 Documents: ${documentFiles.length}`);
        
        // PART A: Process images with Vision API
        if (imageFiles.length > 0) {
          console.log('🖼️  Processing images with Vision API...');
          
          const imageContents = imageFiles.map(file => ({
            type: 'image_url' as const,
            image_url: {
              url: file.data.startsWith('data:') ? file.data : `data:${file.type};base64,${file.data}`
            }
          }));
          
          const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [{
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analyze these images in detail. Describe what you see, any text visible, the context, emotional tone, and anything relevant for psychological power dynamic analysis.'
                  },
                  ...imageContents
                ]
              }],
              max_tokens: 1000
            })
          });
          
          if (!visionResponse.ok) {
            const errorText = await visionResponse.text();
            console.error('❌ Vision API failed:', errorText);
            throw new Error(`Vision analysis failed: ${errorText}`);
          }
          
          const visionResult = await visionResponse.json();
          visionAnalysis = visionResult.choices[0].message.content;
          console.log(`✅ Vision analysis complete (${visionAnalysis.length} chars)`);
        }
        
        // PART B: Process documents with Vector Store (if any)
        if (documentFiles.length > 0) {
          console.log(`📄 Uploading ${documentFiles.length} document(s) to Vector Store...`);
          
          const uploadedFileIds: string[] = [];
          
          for (const file of documentFiles) {
            console.log(`  📤 Uploading: ${file.name} (${file.type})`);
            
            // Convert base64 to buffer
            const base64Data = file.data.split(',')[1] || file.data;
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Create form data
            const formData = new FormData();
            const blob = new Blob([buffer], { type: file.type });
            formData.append('file', blob, file.name);
            formData.append('purpose', 'assistants');
            
            // Upload to OpenAI
            const uploadResponse = await fetch('https://api.openai.com/v1/files', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
              },
              body: formData
            });
            
            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              console.error(`  ❌ Upload failed for ${file.name}:`, errorText);
              throw new Error(`File upload failed: ${errorText}`);
            }
            
            const uploadResult = await uploadResponse.json();
            uploadedFileIds.push(uploadResult.id);
            console.log(`  ✅ Uploaded: ${file.name} (ID: ${uploadResult.id})`);
          }
          
          // Create vector store with uploaded document files
          console.log('🗂️ Creating vector store...');
          
          const vectorStoreResponse = await fetch('https://api.openai.com/v1/vector_stores', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
              name: `Analysis ${jobId}`,
              file_ids: uploadedFileIds
            })
          });
          
          if (!vectorStoreResponse.ok) {
            const errorText = await vectorStoreResponse.text();
            console.error('❌ Vector store creation failed:', errorText);
            throw new Error(`Vector store creation failed: ${errorText}`);
          }
          
          const vectorStore = await vectorStoreResponse.json();
          vectorStoreId = vectorStore.id;
          console.log(`✅ Vector store created: ${vectorStoreId}`);
        }
        
      } catch (fileError) {
        console.error('❌ File processing error:', fileError);
        throw new Error(`File processing failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }
    }

    // STEP 4: Create Thread (with vector store if files present)
    console.log('📤 Creating thread...');
    
    // Combine input text with vision analysis (if present)
    let combinedMessage = inputText;
    if (visionAnalysis) {
      combinedMessage = `${inputText}\n\n[VISUAL CONTEXT FROM UPLOADED IMAGES]:\n${visionAnalysis}`;
      console.log('📸 Including vision analysis in message');
    }
    
    const threadPayload: any = {
      messages: [{
        role: 'user',
        content: combinedMessage
      }]
    };
    
    if (vectorStoreId) {
      threadPayload.tool_resources = {
        file_search: {
          vector_store_ids: [vectorStoreId]
        }
      };
    }
    
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
      throw new Error(`Thread creation failed: ${errorText}`);
    }

    const thread = await threadResponse.json();
    console.log(`📎 Thread: ${thread.id}`);

    // STEP 5: Create Run
    console.log('🏃 Creating run...');
    
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: OPENAI_ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('❌ Run creation failed:', errorText);
      throw new Error(`Run creation failed: ${errorText}`);
    }

    const run = await runResponse.json();
    console.log(`🏃 Run: ${run.id}`);

    // STEP 6: Poll for completion
    console.log('⏳ Polling...');
    
    let attempts = 0;
    const maxAttempts = 20;
    let runStatus = run.status;
    let runData = run;

    while (attempts < maxAttempts && !['completed', 'failed', 'cancelled', 'expired'].includes(runStatus)) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (statusResponse.ok) {
        runData = await statusResponse.json();
        runStatus = runData.status;
        console.log(`🔄 Poll ${attempts}: ${runStatus}`);
      }
    }

    if (runStatus !== 'completed') {
      throw new Error(`Run failed: ${runStatus}`);
    }

    console.log('✅ Run completed!');

    // STEP 7: Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage) {
      throw new Error('No assistant response');
    }

    const responseText = assistantMessage.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text.value)
      .join('\n');

    console.log('📄 Parsing response...');

    // Parse JSON
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      throw new Error('Failed to parse response');
    }

    // STEP 8: Update Supabase (if userId provided)
    if (userId && userEmail) {
      console.log('💾 Saving to Supabase...');

      const updateData = {
        tl_dr: parsedResponse.tl_dr || '',
        whats_happening: parsedResponse.whats_happening || '',
        why_it_matters: parsedResponse.why_it_matters || '',
        narrative_summary: parsedResponse.narrative_summary || '',
        
        power_score: String(parsedResponse.power_score || 0),
        gravity_score: String(parsedResponse.gravity_score || 0),
        risk_score: String(parsedResponse.risk_score || 0),
        issue_confidence_pct: String(parsedResponse.issue_confidence_pct || 0),
        
        power_expl: parsedResponse.power_expl || '',
        gravity_expl: parsedResponse.gravity_expl || '',
        risk_expl: parsedResponse.risk_expl || '',
        
        immediate_move: parsedResponse.immediate_move || '',
        strategic_tool: parsedResponse.strategic_tool || '',
        analytical_check: parsedResponse.analytical_check || '',
        long_term_fix: parsedResponse.long_term_fix || '',
        
        issue_type: parsedResponse.issue_type || '',
        issue_category: parsedResponse.issue_category || '',
        issue_layer: parsedResponse.issue_layer || '',
        
        diagnostic_state: parsedResponse.diagnostic_state || '',
        diagnostic_so_what: parsedResponse.diagnostic_so_what || '',
        
        radar_red_1: joinWithBullets(parsedResponse.radar_red_1),
        radar_red_2: joinWithBullets(parsedResponse.radar_red_2),
        radar_red_3: joinWithBullets(parsedResponse.radar_red_3),
        tactical_moves: joinWithBullets(parsedResponse.tactical_moves),
        
        psychological_profile: parsedResponse.psychological_profile || null,
        
        // ✅ DIAGNOSIS FIELDS (Primary, Secondary, Tertiary)
        diagnosis_primary: parsedResponse.diagnosis_primary || '',
        diagnosis_secondary: parsedResponse.diagnosis_secondary || '',
        diagnosis_tertiary: parsedResponse.diagnosis_tertiary || '',
        
        status: 'completed',
        is_ready: true,
        updated_at: new Date().toISOString(),
        processing_completed_at: new Date().toISOString()
      };

      await supabase
        .from('analyses')
        .update(updateData)
        .eq('id', jobId);
      
      // Update submissions table status (for UI polling)
      await supabase
        .from('submissions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('job_id', jobId);
      
      console.log('✅ Updated both analyses + submissions tables');
    }

    const elapsedTime = Date.now() - startTime;
    console.log(`✅ Complete in ${elapsedTime}ms`);

    // Return success (both formats supported)
    return res.status(200).json({
      success: true,
      ok: true,
      jobId,
      text: parsedResponse.tl_dr || 'Analysis complete',
      data: {
        id: jobId,
        jobId,
        userId,
        title: parsedResponse.tl_dr || 'Strategic Analysis',
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
        
        // ✅ PSYCHOLOGICAL PROFILE (was missing!)
        psychologicalProfile: parsedResponse.psychological_profile || null,
        
        // ✅ DIAGNOSIS FIELDS (Primary, Secondary, Tertiary)
        diagnosisPrimary: parsedResponse.diagnosis_primary || '',
        diagnosisSecondary: parsedResponse.diagnosis_secondary || '',
        diagnosisTertiary: parsedResponse.diagnosis_tertiary || '',
        
        // ✅ RADAR RED FLAGS (formatted)
        radarRed1: joinWithBullets(parsedResponse.radar_red_1),
        radarRed2: joinWithBullets(parsedResponse.radar_red_2),
        radarRed3: joinWithBullets(parsedResponse.radar_red_3),
        tacticalMoves: joinWithBullets(parsedResponse.tactical_moves),
        
        status: 'completed',
        isReady: true,
        createdAt: now,
        updatedAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error('❌ Error:', error);
    
    // Mark submission as failed (if userId provided)
    if (userId && userEmail) {
      try {
        await supabase
          .from('submissions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('job_id', jobId);
        
        await supabase
          .from('analyses')
          .update({
            status: 'failed',
            error_json: JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' }),
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }
    
    return res.status(500).json({
      success: false,
      ok: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
      elapsedTime
    });
  }
}
