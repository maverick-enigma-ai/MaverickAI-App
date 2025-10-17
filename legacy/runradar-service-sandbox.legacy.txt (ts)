/**
 * 🧪 SANDBOX VERSION - RunRadar Service with File Upload Support
 * 
 * This is a TEST version that includes file upload functionality.
 * Use this for testing with your cloned Make scenario.
 * 
 * Key differences from production:
 * - Accepts files parameter in submitAnalysis
 * - Uploads files to Supabase Storage
 * - Sends file URLs to Make.com webhook
 * - Uses sandbox webhook URL (configurable)
 */

import { supabase } from '../utils/supabase/client';
import { ProcessedAnalysis } from '../types/runradar-api';

// 🧪 SANDBOX CONFIG - Update these for your cloned Make scenario
const SANDBOX_CONFIG = {
  // Set this to your cloned Make scenario webhook URL
  WEBHOOK_URL: 'https://hook.eu2.make.com/xqco7jv8mbfegb2lo1glcw5g3zu5rsbi',

  // Supabase Storage bucket for file uploads
  STORAGE_BUCKET: 'make-9398f716-uploads',
  
  // Polling configuration
  POLLING_INTERVAL: 3000, // 3 seconds
  MAX_POLLING_ATTEMPTS: 60, // 3 minutes total (60 * 3s = 180s)
};

interface SubmitAnalysisResult {
  success: boolean;
  jobId?: string;
  data?: ProcessedAnalysis;
  error?: string;
}

interface FileUploadResult {
  success: boolean;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Upload a file to Supabase Storage and return a signed URL
 */
async function uploadFileToStorage(file: File, jobId: string): Promise<FileUploadResult> {
  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${jobId}/${timestamp}_${sanitizedName}`;
    
    console.log(`📤 Uploading file: ${file.name} (${file.size} bytes)`);
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(SANDBOX_CONFIG.STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error(`❌ Upload failed for ${file.name}:`, uploadError);
      return {
        success: false,
        fileName: file.name,
        error: uploadError.message
      };
    }
    
    console.log(`✅ File uploaded: ${filePath}`);
    
    // Generate signed URL (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(SANDBOX_CONFIG.STORAGE_BUCKET)
      .createSignedUrl(filePath, 3600);
    
    if (urlError) {
      console.error(`❌ Failed to generate signed URL:`, urlError);
      return {
        success: false,
        fileName: file.name,
        error: urlError.message
      };
    }
    
    console.log(`🔗 Signed URL generated for ${file.name}`);
    
    return {
      success: true,
      fileName: file.name,
      fileUrl: urlData.signedUrl,
      fileType: file.type,
      fileSize: file.size
    };
  } catch (error) {
    console.error(`💥 Exception uploading file:`, error);
    return {
      success: false,
      fileName: file.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 🧪 SANDBOX: Submit analysis with file attachments to Make.com
 */
export async function submitAnalysisSandbox(
  text: string,
  userId: string,
  userEmail: string,
  paymentPlan: string,
  files: File[] = []
): Promise<SubmitAnalysisResult> {
  try {
    const jobId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    console.log('🧪 SANDBOX MODE: Starting file upload test');
    console.log(`📦 Job ID: ${jobId}`);
    console.log(`📧 User: ${userEmail}`);
    console.log(`📝 Text length: ${text.length}`);
    console.log(`📎 Files to upload: ${files.length}`);
    
    // Upload files to Supabase Storage
    let uploadedFiles: FileUploadResult[] = [];
    if (files && files.length > 0) {
      console.log(`📤 Uploading ${files.length} file(s)...`);
      
      // Upload all files in parallel
      const uploadPromises = files.map(file => uploadFileToStorage(file, jobId));
      uploadedFiles = await Promise.all(uploadPromises);
      
      // Check for any upload failures
      const failedUploads = uploadedFiles.filter(result => !result.success);
      if (failedUploads.length > 0) {
        console.warn(`⚠️ ${failedUploads.length} file(s) failed to upload:`, failedUploads);
      }
      
      const successfulUploads = uploadedFiles.filter(result => result.success);
      console.log(`✅ Successfully uploaded ${successfulUploads.length} file(s)`);
    }
    
    // Prepare webhook payload with file attachments
    const payload = {
      // Core identifiers
      job_id: jobId,
      query_id: jobId,
      session_id: jobId,
      answers_id: jobId,
      
      // User information
      user_id: userId,
      user_email: userEmail,
      payment_plan: paymentPlan,
      
      // Input data
      input_text: text,
      
      // 🆕 FILE ATTACHMENTS - Array of file objects
      attachments: uploadedFiles
        .filter(result => result.success)
        .map(result => ({
          file_name: result.fileName,
          file_url: result.fileUrl,
          file_type: result.fileType,
          file_size: result.fileSize
        })),
      
      // Metadata
      status: 'pending',
      created_at: timestamp,
      updated_at: timestamp,
      
      // Source tracking
      source: 'enigma_radar_sandbox',
      version: '1.0.0'
    };
    
    console.log('🧪 SANDBOX PAYLOAD:', JSON.stringify(payload, null, 2));
    console.log(`📤 Sending to webhook: ${SANDBOX_CONFIG.WEBHOOK_URL}`);
    
    // Check if webhook URL is configured
    if (SANDBOX_CONFIG.WEBHOOK_URL.includes('YOUR_SANDBOX_WEBHOOK_HERE')) {
      console.error('❌ SANDBOX WEBHOOK NOT CONFIGURED!');
      console.error('📝 Please update SANDBOX_CONFIG.WEBHOOK_URL in /services/runradar-service-sandbox.ts');
      return {
        success: false,
        error: 'Sandbox webhook URL not configured. Please update SANDBOX_CONFIG.WEBHOOK_URL'
      };
    }
    
    // Send to Make.com webhook
    const response = await fetch(SANDBOX_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error(`❌ Webhook request failed: ${response.status} ${response.statusText}`);
      return {
        success: false,
        jobId,
        error: `Webhook request failed: ${response.status} ${response.statusText}`
      };
    }
    
    console.log('✅ Webhook request successful!');
    console.log('⏳ Starting to poll Supabase for results...');
    
    // Poll for results from Supabase
    const pollingResult = await pollForAnalysis(jobId, userId);
    
    if (pollingResult.success && pollingResult.data) {
      console.log('✅ Analysis complete and retrieved from Supabase!');
      return {
        success: true,
        jobId,
        data: pollingResult.data
      };
    } else {
      console.warn('⚠️ Polling completed but no results yet');
      return {
        success: false,
        jobId,
        error: pollingResult.error || 'Analysis is processing - check History later'
      };
    }
    
  } catch (error) {
    console.error('💥 Exception in submitAnalysisSandbox:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Poll Supabase for completed analysis
 */
async function pollForAnalysis(jobId: string, userId: string): Promise<SubmitAnalysisResult> {
  let attempts = 0;
  
  while (attempts < SANDBOX_CONFIG.MAX_POLLING_ATTEMPTS) {
    attempts++;
    console.log(`🔍 Polling attempt ${attempts}/${SANDBOX_CONFIG.MAX_POLLING_ATTEMPTS}...`);
    
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('query_id', jobId)
        .eq('user_id', userId)
        .eq('is_ready', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found yet - continue polling
          console.log('   ⏳ No results yet, waiting...');
        } else {
          console.error('   ❌ Database error:', error);
          return {
            success: false,
            error: `Database error: ${error.message}`
          };
        }
      } else if (data) {
        console.log('   ✅ Analysis found!');
        
        // Map database fields to ProcessedAnalysis
        const analysis: ProcessedAnalysis = {
          id: data.id,
          jobId: data.query_id,
          userId: data.user_id,
          title: data.title || 'Strategic Analysis',
          inputText: data.input_text || '',
          summary: data.summary || '',
          powerScore: data.power_score || 0,
          gravityScore: data.gravity_score || 0,
          riskScore: data.risk_score || 0,
          confidenceLevel: data.confidence_level || 0,
          whatsHappening: data.whats_happening || '',
          whyItMatters: data.why_it_matters || '',
          narrativeSummary: data.narrative_summary || '',
          immediateMove: data.immediate_move || '',
          strategicTool: data.strategic_tool || '',
          analyticalCheck: data.analytical_check || '',
          longTermFix: data.long_term_fix || '',
          powerExplanation: data.power_explanation || '',
          gravityExplanation: data.gravity_explanation || '',
          riskExplanation: data.risk_explanation || '',
          issueType: data.issue_type || '',
          issueCategory: data.issue_category || '',
          issueLayer: data.issue_layer || '',
          status: data.status || 'completed',
          isReady: data.is_ready || false,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        return {
          success: true,
          jobId,
          data: analysis
        };
      }
    } catch (error) {
      console.error('   💥 Polling exception:', error);
    }
    
    // Wait before next attempt
    if (attempts < SANDBOX_CONFIG.MAX_POLLING_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, SANDBOX_CONFIG.POLLING_INTERVAL));
    }
  }
  
  console.warn('⏰ Polling timeout - analysis may still be processing');
  return {
    success: false,
    jobId,
    error: 'Polling timeout - analysis may still be processing'
  };
}

/**
 * 🧪 SANDBOX: Test connection to Make.com with file metadata
 */
export async function testConnectionSandbox(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🧪 SANDBOX: Testing webhook connection...');
    
    if (SANDBOX_CONFIG.WEBHOOK_URL.includes('YOUR_SANDBOX_WEBHOOK_HERE')) {
      return {
        success: false,
        message: 'Sandbox webhook URL not configured'
      };
    }
    
    const testPayload = {
      test: true,
      message: '🧪 Sandbox webhook test with file support',
      timestamp: new Date().toISOString(),
      attachments: [
        {
          file_name: 'test_document.pdf',
          file_url: 'https://example.com/test.pdf',
          file_type: 'application/pdf',
          file_size: 12345
        }
      ]
    };
    
    const response = await fetch(SANDBOX_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    if (response.ok) {
      console.log('✅ Sandbox webhook test successful!');
      return {
        success: true,
        message: 'Sandbox webhook is responding'
      };
    } else {
      console.error('❌ Sandbox webhook test failed:', response.status);
      return {
        success: false,
        message: `Webhook test failed: ${response.status}`
      };
    }
  } catch (error) {
    console.error('💥 Sandbox test error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Test failed'
    };
  }
}

/**
 * 🧪 SANDBOX: Initialize storage bucket (run once)
 */
export async function initializeSandboxStorage(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🧪 Initializing sandbox storage bucket...');
    
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === SANDBOX_CONFIG.STORAGE_BUCKET);
    
    if (bucketExists) {
      console.log('✅ Storage bucket already exists');
      return {
        success: true,
        message: 'Storage bucket already exists'
      };
    }
    
    // Create bucket
    const { error } = await supabase.storage.createBucket(SANDBOX_CONFIG.STORAGE_BUCKET, {
      public: false, // Private bucket - files accessible only via signed URLs
      fileSizeLimit: 10485760, // 10MB limit
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]
    });
    
    if (error) {
      console.error('❌ Failed to create storage bucket:', error);
      return {
        success: false,
        message: `Failed to create bucket: ${error.message}`
      };
    }
    
    console.log('✅ Storage bucket created successfully!');
    return {
      success: true,
      message: 'Storage bucket created successfully'
    };
  } catch (error) {
    console.error('💥 Storage initialization error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Initialization failed'
    };
  }
}

export const useRunRadarSandbox = () => {
  return {
    submitAnalysis: submitAnalysisSandbox,
    testConnection: testConnectionSandbox,
    initializeStorage: initializeSandboxStorage,
  };
};