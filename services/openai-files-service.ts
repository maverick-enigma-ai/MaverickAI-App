/**
 * ========================================
 * OPTION B: OpenAI Direct Integration
 * WITH FILE ATTACHMENTS
 * ========================================
 * 
 * This module handles queries WITH file attachments by:
 * 1. Creating a temporary vector store in OpenAI
 * 2. Uploading user files to the temporary vector store
 * 3. Running the assistant with the temporary vector store (user's files)
 *    NOTE: Permanent knowledge (book/frameworks) should be attached to the Assistant itself
 * 4. Processing and returning results
 * 5. Automatic cleanup (OpenAI deletes temp files after 24h)
 * 
 * STATUS: ⏳ NOT YET INTEGRATED
 * - Waiting for Option A testing to complete
 * - Ready to integrate when needed
 * 
 * @author MaverickAI Enigma Radar™
 * @version 1.0.0-beta (Option B - File Uploads)
 */

import { ProcessedAnalysis } from '../types/runradar-api';
import { db } from '../utils/database/database-adapter';
import { callOpenAIAssistant } from './shared/openai-assistant-api';
import { parseOpenAIResponse } from './shared/openai-response-parser';
import { getOpenAIKey } from '../utils/openai-config';
import { analyzeImagesWithVision, isImageFile, fileToBase64 } from './shared/openai-vision-api';

class OpenAIFilesService {
  /**
   * Generate proper UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Submit text analysis WITH file attachments
   * Uses OpenAI temporary vector stores (no Supabase storage!)
   */
  async submitWithFiles(
    inputText: string,
    files: File[],
    userId: string,
    userEmail: string,
    paymentPlan: string = 'basic'
  ): Promise<{
    success: boolean;
    jobId: string;
    data?: ProcessedAnalysis;
    error?: string;
  }> {
    const jobId = this.generateUUID();
    
    console.log('🚀 OPTION B: Direct OpenAI submission WITH FILES started');
    console.log(`📋 Job ID: ${jobId}`);
    console.log(`👤 User: ${userEmail}`);
    console.log(`📝 Text length: ${inputText.length} chars`);
    console.log(`📎 Files: ${files.length}`);
    
    try {
      // STEP 1: Create pending record using database adapter
      console.log('📝 Step 1: Creating pending record in database...');
      console.log('⚠️  Files will be stored in OpenAI temporary vector store, NOT database!');
      
      const createResult = await db.createAnalysis({
        id: jobId,
        user_id: userId,
        email: userEmail,
        input_text: inputText,
        status: 'processing',
        is_ready: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job_id: jobId,
        query_id: jobId
      });
      
      if (!createResult.success) {
        console.error('❌ Failed to create database record:', createResult.error);
        throw new Error(`Failed to create record: ${createResult.error}`);
      }
      
      console.log('✅ Pending record created in database');
      
      // STEP 2: Get OpenAI API key (use openai-config for cross-platform compatibility)
      console.log('🔑 Step 2: Retrieving OpenAI API key...');
      
      let apiKey: string;
      try {
        apiKey = getOpenAIKey();
        console.log('✅ API key found');
      } catch (error) {
        console.error('❌ OpenAI API key not found:', error);
        throw error;
      }
      
      // STEP 3: Separate images from documents
      console.log('📤 Step 3: Processing files...');
      const imageFiles = files.filter(f => isImageFile(f));
      const documentFiles = files.filter(f => !isImageFile(f));
      
      console.log(`🖼️  Images: ${imageFiles.length}`);
      console.log(`📄 Documents: ${documentFiles.length}`);
      
      // STEP 3A: Analyze images with Vision API (if any)
      let visionAnalysis = '';
      if (imageFiles.length > 0) {
        console.log('🖼️  Step 3A: Analyzing images with Vision API...');
        
        // Convert images to base64
        const imageBase64Array = await Promise.all(
          imageFiles.map(async (file) => ({
            filename: file.name,
            base64: await fileToBase64(file),
            mimeType: file.type || 'image/png'
          }))
        );
        console.log(`✅ Converted ${imageBase64Array.length} images to base64`);
        
        // Call Vision API to analyze images
        const visionResponse = await analyzeImagesWithVision({
          inputText: inputText,
          imageBase64Array: imageBase64Array
        });
        
        visionAnalysis = visionResponse.content;
        console.log('✅ Vision analysis complete');
        console.log(`📝 Vision output: ${visionAnalysis.substring(0, 200)}...`);
      }
      
      // STEP 3B: Upload documents to vector store (if any)
      let vectorStoreId = '';
      if (documentFiles.length > 0) {
        console.log('📤 Step 3B: Uploading documents to OpenAI temporary vector store...');
        vectorStoreId = await this.uploadFilesToOpenAI(documentFiles, apiKey);
        console.log(`✅ Temporary vector store created: ${vectorStoreId}`);
        console.log('⏰ Note: OpenAI will automatically delete these files after 24 hours');
      }
      
      // STEP 4: Call OpenAI Assistant API with combined input
      console.log('🤖 Step 4: Calling OpenAI Assistant API...');
      
      // Update status to processing
      await db.updateAnalysis(jobId, { status: 'processing' });
      
      // Build enhanced input text with Vision analysis (if any)
      let enhancedInputText = inputText;
      
      if (visionAnalysis) {
        enhancedInputText += '\n\n[VISUAL ANALYSIS FROM ATTACHED IMAGES]:\n';
        enhancedInputText += visionAnalysis;
        enhancedInputText += '\n\n[END OF VISUAL ANALYSIS]';
        console.log('📸 Added Vision analysis to input text');
      }
      
      if (documentFiles.length > 0) {
        console.log(`📄 Using vector store for ${documentFiles.length} document(s)`);
      }
      
      // Call Assistant API with text only (Vision analysis already converted to text)
      const response = await callOpenAIAssistant({
        inputText: enhancedInputText,
        tempVectorStoreId: vectorStoreId || undefined
      });
      
      const analysis = parseOpenAIResponse(response.content);
      
      console.log('✅ OpenAI analysis complete');
      console.log(`📊 Scores: P${analysis.powerScore} G${analysis.gravityScore} R${analysis.riskScore}`);
      
      // STEP 5: Save results using database adapter
      console.log('💾 Step 5: Saving results to database...');
      console.log(`🔍 jobId to update: ${jobId}`);
      console.log(`🔍 Analysis data to save:`, {
        power: analysis.powerScore,
        gravity: analysis.gravityScore,
        risk: analysis.riskScore,
        confidence: analysis.confidenceLevel,
        summary: analysis.summary?.substring(0, 50)
      });
      
      const updateResult = await db.updateAnalysis(jobId, {
        status: 'completed',
        is_ready: true,
        
        // Scores
        power_score: analysis.powerScore,
        gravity_score: analysis.gravityScore,
        risk_score: analysis.riskScore,
        confidence_level: analysis.confidenceLevel,
        
        // Analysis content
        tl_dr: analysis.summary,
        whats_happening: analysis.whatsHappening,
        why_it_matters: analysis.whyItMatters,
        narrative_summary: analysis.narrativeSummary,
        
        // Strategic moves
        immediate_move: analysis.immediateMove,
        strategic_tool: analysis.strategicTool,
        analytical_check: analysis.analyticalCheck,
        long_term_fix: analysis.longTermFix,
        
        // Explanations
        power_explanation: analysis.powerExplanation,
        gravity_explanation: analysis.gravityExplanation,
        risk_explanation: analysis.riskExplanation,
        
        // Definitions (if available)
        power_definition: analysis.powerDefinition,
        gravity_definition: analysis.gravityDefinition,
        risk_definition: analysis.riskDefinition,
        
        // Classifications
        issue_type: analysis.issueType,
        issue_category: analysis.issueCategory,
        issue_layer: analysis.issueLayer,
        
        // Timestamps
        updated_at: new Date().toISOString(),
        processing_completed_at: new Date().toISOString()
      });
      
      console.log('🔍 Database update result:', updateResult);
      
      if (!updateResult.success) {
        console.error('❌❌❌ CRITICAL: Failed to update database with results!');
        console.error('❌ Error:', updateResult.error);
        console.error('❌ This means OpenAI worked but database save failed!');
        throw new Error(`Failed to save results: ${updateResult.error}`);
      }
      
      console.log('✅✅✅ COMPLETE! Results saved to database');
      console.log('🔍 Saved record:', updateResult.data);
      console.log('🗑️  OpenAI will automatically clean up temporary files in 24 hours');
      
      // STEP 6: Return the complete analysis
      const processedAnalysis: ProcessedAnalysis = {
        id: jobId,
        jobId: jobId,
        userId: userId,
        title: analysis.summary,
        inputText: inputText,
        summary: analysis.summary,
        
        powerScore: analysis.powerScore,
        gravityScore: analysis.gravityScore,
        riskScore: analysis.riskScore,
        confidenceLevel: analysis.confidenceLevel,
        
        whatsHappening: analysis.whatsHappening,
        whyItMatters: analysis.whyItMatters,
        narrativeSummary: analysis.narrativeSummary,
        
        immediateMove: analysis.immediateMove,
        strategicTool: analysis.strategicTool,
        analyticalCheck: analysis.analyticalCheck,
        longTermFix: analysis.longTermFix,
        
        powerExplanation: analysis.powerExplanation,
        gravityExplanation: analysis.gravityExplanation,
        riskExplanation: analysis.riskExplanation,
        
        issueType: analysis.issueType,
        issueCategory: analysis.issueCategory,
        issueLayer: analysis.issueLayer,
        
        diagnosisPrimary: analysis.diagnosisPrimary,
        diagnosisSecondary: analysis.diagnosisSecondary,
        diagnosisTertiary: analysis.diagnosisTertiary,
        
        status: 'completed',
        isReady: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        jobId: jobId,
        data: processedAnalysis
      };
      
    } catch (error) {
      console.error('❌ Option B submission failed:', error);
      
      // Update database with error
      await db.updateAnalysis(jobId, {
        status: 'failed',
        updated_at: new Date().toISOString()
      });
      
      return {
        success: false,
        jobId: jobId,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Upload DOCUMENT files to OpenAI and create a temporary vector store
   * This stores files in OpenAI, NOT Supabase!
   * 
   * NOTE: Vector Stores only support text-based files (PDF, DOCX, TXT, etc.)
   * Images (PNG, JPG) are NOT supported - use Vision API module instead!
   */
  private async uploadFilesToOpenAI(
    files: File[],
    apiKey: string
  ): Promise<string> {
    console.log(`📤 Processing ${files.length} file(s) for OpenAI...`);
    
    // Separate images from documents (use imported function, not this.isImageFile!)
    const imageFiles = files.filter(f => isImageFile(f));
    const documentFiles = files.filter(f => !isImageFile(f));
    
    console.log(`🖼️  Image files: ${imageFiles.length}`);
    console.log(`📄 Document files: ${documentFiles.length}`);
    
    // If there are images, we'll handle them differently
    if (imageFiles.length > 0) {
      console.warn('⚠️  WARNING: Image files detected!');
      console.warn('⚠️  Vector Stores do NOT support images (PNG, JPG, etc.)');
      console.warn('⚠️  Images will be analyzed using Vision API instead');
    }
    
    // If no document files, return empty vector store ID
    // Images will be handled separately in the assistant call
    if (documentFiles.length === 0) {
      console.log('📝 No document files to upload to vector store');
      console.log('🖼️  All files are images - will use Vision API');
      return ''; // Empty string means no vector store needed
    }
    
    // Upload only document files to vector store
    const fileIds: string[] = [];
    
    for (let i = 0; i < documentFiles.length; i++) {
      const file = documentFiles[i];
      console.log(`📄 Uploading document ${i + 1}/${documentFiles.length}: ${file.name} (${file.size} bytes)`);
      
      // FIX: Normalize file extension to lowercase (OpenAI is case-sensitive!)
      // IMG_6830.PNG → IMG_6830.png
      let fileToUpload = file;
      const originalName = file.name;
      const nameParts = originalName.split('.');
      
      if (nameParts.length > 1) {
        const extension = nameParts.pop()!.toLowerCase();
        const baseName = nameParts.join('.');
        const normalizedName = `${baseName}.${extension}`;
        
        if (normalizedName !== originalName) {
          console.log(`🔧 Normalizing extension: ${originalName} → ${normalizedName}`);
          // Create new File with normalized name
          fileToUpload = new File([file], normalizedName, { type: file.type });
        }
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('purpose', 'assistants'); // Required for assistant files
      
      const uploadResponse = await fetch('https://api.openai.com/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
          // Don't set Content-Type - browser sets it with boundary for FormData
        },
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Failed to upload file ${file.name}: ${JSON.stringify(errorData)}`);
      }
      
      const fileData = await uploadResponse.json();
      fileIds.push(fileData.id);
      console.log(`✅ File uploaded: ${fileData.id}`);
    }
    
    // Create a temporary vector store with these files
    console.log('📚 Creating temporary vector store...');
    const vectorStoreResponse = await fetch('https://api.openai.com/v1/vector_stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        name: `Temp Upload - ${new Date().toISOString()}`,
        file_ids: fileIds,
        expires_after: {
          anchor: 'last_active_at',
          days: 1 // Auto-delete after 1 day of inactivity
        }
      })
    });
    
    if (!vectorStoreResponse.ok) {
      const errorData = await vectorStoreResponse.json();
      throw new Error(`Failed to create vector store: ${JSON.stringify(errorData)}`);
    }
    
    const vectorStore = await vectorStoreResponse.json();
    console.log(`✅ Temporary vector store created: ${vectorStore.id}`);
    console.log('⏰ Files will auto-delete after 1 day');
    
    // Wait for vector store to be ready (files need to be processed)
    console.log('⏳ Waiting for files to be processed...');
    await this.waitForVectorStoreReady(vectorStore.id, apiKey);
    
    return vectorStore.id;
  }

  /**
   * Wait for vector store to finish processing files
   */
  private async waitForVectorStoreReady(
    vectorStoreId: string,
    apiKey: string,
    maxAttempts: number = 60
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check vector store status');
      }
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        console.log(`✅ Vector store ready (${data.file_counts?.completed || 0} files processed)`);
        return;
      }
      
      if (data.status === 'failed') {
        throw new Error('Vector store processing failed');
      }
      
      console.log(`⏳ Processing files... (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    
    throw new Error('Vector store processing timeout');
  }

  /**
   * DEPRECATED: Now using shared/openai-assistant-api.ts module
   * Kept for reference only
   */
  private async callOpenAIAssistantWithFiles_DEPRECATED(
    inputText: string,
    tempVectorStoreId: string,
    apiKey: string
  ): Promise<any> {
    console.log('🤖 Calling OpenAI Assistant API with files...');
    
    // Use centralized config (with Figma Make fallback)
    const ASSISTANT_ID = getOpenAIAssistantID();
    const PERMANENT_VECTOR_STORE_ID = getOpenAIVectorStoreID();
    
    if (!ASSISTANT_ID) {
      throw new Error('OpenAI Assistant ID not configured - please add it to /utils/openai-config.ts');
    }
    
    console.log('✅ Using Assistant ID:', ASSISTANT_ID);
    
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
      // NOTE: Assistant has response_format: json_object configured, so we MUST mention "json" in the message
      const messageContent = `${inputText}\n\nPlease analyze this situation and respond in JSON format with all required fields.`;
      
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
      
      // STEP 3: Run the assistant with temporary vector store (user's uploaded files)
      // NOTE: OpenAI only allows 1 vector store per request
      // The permanent vector store (book/frameworks) should be attached to the Assistant itself
      console.log('🏃 Running assistant with user files...');
      console.log(`📎 Temporary vector store: ${tempVectorStoreId} (user files)`);
      console.log('📚 Note: Permanent knowledge (book/frameworks) should be attached to Assistant, not passed here');
      
      const vectorStoreIds = [tempVectorStoreId]; // ONLY the temp store (OpenAI limit: 1 vector store)
      
      const runPayload: any = {
        assistant_id: ASSISTANT_ID,
        tool_resources: {
          file_search: {
            vector_store_ids: vectorStoreIds
          }
        }
      };
      
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
      await this.waitForRunCompletion(thread.id, run.id, apiKey);
      
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
      
      // STEP 6: Parse the JSON response
      console.log('🔍 Parsing JSON response...');
      const analysis = this.parseOpenAIResponse(responseText);
      
      return analysis;
      
    } catch (error) {
      console.error('❌ OpenAI API call failed:', error);
      throw error;
    }
  }

  /**
   * Wait for assistant run to complete
   */
  private async waitForRunCompletion(
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
      
      console.log(`⏳ Status: ${run.status} (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Assistant run timeout');
  }

  /**
   * DEPRECATED: Now using shared/openai-response-parser.ts module
   * Kept for reference only
   */
  private parseOpenAIResponse_DEPRECATED(responseText: string): any {
    // Remove markdown code blocks if present
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    try {
      const parsed = JSON.parse(jsonText);
      
      // Normalize scores to 0-100 range
      const normalizeScore = (score: any): number => {
        const num = typeof score === 'string' ? parseFloat(score) : score;
        return Math.max(0, Math.min(100, Math.round(num || 0)));
      };
      
      return {
        powerScore: normalizeScore(parsed.power_score),
        gravityScore: normalizeScore(parsed.gravity_score),
        riskScore: normalizeScore(parsed.risk_score),
        confidenceLevel: normalizeScore(parsed.issue_confidence_pct || 85),
        
        summary: parsed.tl_dr || 'Analysis complete',
        whatsHappening: parsed.whats_happening || '',
        whyItMatters: parsed.why_it_matters || '',
        narrativeSummary: parsed.narrative_summary || '',
        
        immediateMove: parsed.immediate_move || '',
        strategicTool: parsed.strategic_tool || '',
        analyticalCheck: parsed.analytical_check || '',
        longTermFix: parsed.long_term_fix || '',
        
        powerExplanation: parsed.power_expl || '',
        gravityExplanation: parsed.gravity_expl || '',
        riskExplanation: parsed.risk_expl || '',
        
        issueType: parsed.issue_type || '',
        issueCategory: parsed.issue_category || '',
        issueLayer: parsed.issue_layer || '',
        
        diagnosisPrimary: parsed.diagnosis_primary || '',
        diagnosisSecondary: parsed.diagnosis_secondary || '',
        diagnosisTertiary: parsed.diagnosis_tertiary || ''
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Raw response:', responseText.substring(0, 500));
      throw new Error('Failed to parse OpenAI response - assistant may not be returning valid JSON');
    }
  }
}

// Export singleton instance
export const openaiFilesService = new OpenAIFilesService();

// Export the main function for easy import
export async function submitWithFiles(
  inputText: string,
  files: File[],
  userId: string,
  userEmail: string,
  paymentPlan: string = 'basic'
) {
  return openaiFilesService.submitWithFiles(inputText, files, userId, userEmail, paymentPlan);
}
