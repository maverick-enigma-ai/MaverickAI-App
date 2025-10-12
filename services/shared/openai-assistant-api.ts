/**
 * ========================================
 * SHARED: OpenAI Assistant API Module
 * ========================================
 * 
 * Handles all OpenAI Assistant API interactions for both Option A and Option B.
 * This ensures consistency and makes it easy to modify OpenAI integration in one place.
 * 
 * @author MaverickAI Enigma Radar™
 * @version 2.0.0 - Modular Design
 * @date October 10, 2025
 */

import { getOpenAIKey, getOpenAIAssistantID } from '../../utils/openai-config';

export interface AssistantRunOptions {
  inputText: string;
  tempVectorStoreId?: string; // For Option B (document uploads)
  // NOTE: Images are handled separately via Vision API module
  // Vision results are included in inputText as text
}

export interface AssistantResponse {
  content: string;
  threadId: string;
  runId: string;
}

/**
 * Call OpenAI Assistant API
 * Handles both Option A (no files) and Option B (with files)
 */
export async function callOpenAIAssistant(
  options: AssistantRunOptions
): Promise<AssistantResponse> {
  console.log('🤖 Calling OpenAI Assistant API...');
  
  const apiKey = getOpenAIKey();
  const ASSISTANT_ID = getOpenAIAssistantID();
  
  if (!ASSISTANT_ID) {
    throw new Error(
      'OpenAI Assistant ID not configured!\\n\\n' +
      'For Figma Make:\\n' +
      '1. Get your Assistant ID from: https://platform.openai.com/assistants\\n' +
      '2. Add it to /utils/openai-config.ts in FIGMA_MAKE_ASSISTANT_ID\\n\\n' +
      'For Vercel:\\n' +
      '1. Add VITE_OPENAI_ASSISTANT_ID to .env\\n' +
      '2. Deploy to Vercel\\n'
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
    
    // NOTE: If Assistant has response_format: json_object, we MUST mention "json" in the message
    // Option A uses json_schema (doesn't need this), but Option B needs it
    
    // Images are handled via Vision API module separately
    // The Vision analysis is already included in inputText as text
    const messageContent = options.tempVectorStoreId 
      ? `${options.inputText}\n\nPlease analyze this situation and respond in JSON format with all required fields.`
      : options.inputText;
    
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent
      })
    });
    
    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
    }
    
    console.log('✅ Message added');
    
    // STEP 3: Run the assistant
    console.log('🏃 Running assistant...');
    
    // Build run payload - different for Option A vs Option B
    const runPayload: any = {
      assistant_id: ASSISTANT_ID
    };
    
    // Option B: Include temporary vector store for user's uploaded files
    if (options.tempVectorStoreId) {
      console.log(`📎 With temporary vector store: ${options.tempVectorStoreId}`);
      runPayload.tool_resources = {
        file_search: {
          vector_store_ids: [options.tempVectorStoreId]
        }
      };
    }
    // Option A: Use JSON schema for validated responses
    else {
      console.log('📋 With JSON schema validation...');
      runPayload.response_format = {
        type: "json_schema",
        json_schema: {
          name: "maverick_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              // CORE SCORES (0-100)
              power: { type: "number", description: "Power dynamics score (0-100)" },
              gravity: { type: "number", description: "Gravity/seriousness score (0-100)" },
              risk: { type: "number", description: "Risk/danger score (0-100)" },
              issue_confidence_pct: { type: "number", description: "Confidence in analysis (0-100)" },
              
              // SUMMARY FIELDS
              tl_dr: { type: "string", description: "One-sentence summary" },
              snapshot: { type: "string", description: "Quick snapshot (2-3 sentences)" },
              whats_happening: { type: "string", description: "What's actually happening" },
              why_it_matters: { type: "string", description: "Why this matters" },
              narrative_summary: { type: "string", description: "Full narrative" },
              
              // STRATEGIC MOVES (arrays of strings)
              moves: {
                type: "object",
                properties: {
                  immediate_action: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Immediate tactical moves (array)"
                  },
                  strategic_tool: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Strategic tools to use (array)"
                  },
                  analytical_check: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Things to verify/check (array)"
                  },
                  long_term_fix: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Long-term solutions (array)"
                  }
                },
                required: ["immediate_action", "strategic_tool", "analytical_check", "long_term_fix"],
                additionalProperties: false
              },
              
              // EXPLANATIONS
              explanations: {
                type: "object",
                properties: {
                  power: { type: "string", description: "Why this power score" },
                  gravity: { type: "string", description: "Why this gravity score" },
                  risk: { type: "string", description: "Why this risk score" }
                },
                required: ["power", "gravity", "risk"],
                additionalProperties: false
              },
              
              // DEFINITIONS
              definitions: {
                type: "object",
                properties: {
                  power: { type: "string", description: "What power means here" },
                  gravity: { type: "string", description: "What gravity means here" },
                  risk: { type: "string", description: "What risk means here" }
                },
                required: ["power", "gravity", "risk"],
                additionalProperties: false
              },
              
              // CLASSIFICATIONS
              issue_type: { type: "string", description: "Type of issue" },
              issue_category: { type: "string", description: "Category" },
              issue_layer: { type: "string", description: "Which layer" }
            },
            required: [
              "power", "gravity", "risk", "issue_confidence_pct",
              "tl_dr", "snapshot", "whats_happening", "why_it_matters", "narrative_summary",
              "moves", "explanations", "definitions",
              "issue_type", "issue_category", "issue_layer"
            ],
            additionalProperties: false
          }
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
    
    // STEP 4: Wait for completion
    console.log('⏳ Waiting for assistant to complete...');
    await waitForRunCompletion(thread.id, run.id, apiKey);
    
    // STEP 5: Get the response
    console.log('📨 Retrieving assistant response...');
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages?order=desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );
    
    if (!messagesResponse.ok) {
      throw new Error('Failed to retrieve messages');
    }
    
    const messages = await messagesResponse.json();
    const assistantMessage = messages.data[0];
    
    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }
    
    const content = assistantMessage.content[0];
    let responseText = '';
    
    if (content.type === 'text') {
      responseText = content.text.value;
    } else {
      throw new Error('Unexpected response format');
    }
    
    console.log('✅ Response received');
    console.log(`📄 Response length: ${responseText.length} chars`);
    
    return {
      content: responseText,
      threadId: thread.id,
      runId: run.id
    };
    
  } catch (error) {
    console.error('❌ OpenAI API call failed:', error);
    throw error;
  }
}

/**
 * Wait for assistant run to complete
 */
async function waitForRunCompletion(
  threadId: string,
  runId: string,
  apiKey: string,
  maxAttempts: number = 60
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to check run status');
    }
    
    const run = await response.json();
    
    if (run.status === 'completed') {
      console.log('✅ Assistant completed!');
      return;
    }
    
    if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
      throw new Error(`Assistant run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
    }
    
    console.log(`⏳ Status: ${run.status} (attempt ${attempt}/${maxAttempts})`)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Assistant run timeout');
}
