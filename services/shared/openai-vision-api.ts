/**
 * ========================================
 * SHARED: OpenAI Vision API Module
 * ========================================
 * 
 * Handles image analysis using GPT-4 Vision (Chat Completions API).
 * This is separate from the Assistants API because:
 * - Assistants API does NOT support base64-encoded images
 * - Chat Completions API DOES support Vision with base64
 * 
 * @author MaverickAI Enigma Radar™
 * @version 1.0.0 - Modular Vision
 * @date October 10, 2025
 */

import { getOpenAIKey } from '../../utils/openai-config';

export interface VisionAnalysisOptions {
  inputText: string;
  imageBase64Array: { filename: string; base64: string; mimeType: string }[];
}

export interface VisionResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Analyze images using GPT-4 Vision via Chat Completions API
 * Returns a text description that can be used in the main analysis
 */
export async function analyzeImagesWithVision(
  options: VisionAnalysisOptions
): Promise<VisionResponse> {
  console.log('🖼️ Starting Vision API analysis...');
  console.log(`📸 Images: ${options.imageBase64Array.length}`);
  
  const apiKey = getOpenAIKey();
  
  try {
    // Build content array with text prompt + images
    const content: any[] = [
      {
        type: 'text',
        text: `You are analyzing images for a psychological power dynamics platform called MaverickAI Enigma Radar™.

The user has provided the following context:
"${options.inputText}"

Please analyze the attached image(s) and extract:
1. What's visible in the image(s) - describe all relevant content
2. Any text visible in the image(s) - transcribe it exactly
3. The emotional tone or power dynamics visible (if applicable)
4. Any contextual information that would be relevant for psychological analysis

Be thorough and detailed. This will be used as input for a deeper power dynamics analysis.

Images provided: ${options.imageBase64Array.map(img => img.filename).join(', ')}`
      }
    ];
    
    // Add each image
    options.imageBase64Array.forEach((img, index) => {
      console.log(`📸 Adding image ${index + 1}: ${img.filename}`);
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${img.mimeType};base64,${img.base64}`,
          detail: 'high' // High quality analysis
        }
      });
    });
    
    // Call Chat Completions API with Vision
    console.log('🤖 Calling GPT-4 Vision...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // GPT-4o supports vision
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        max_tokens: 2000, // Allow detailed description
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Vision API error:', errorData);
      throw new Error(`Vision API failed: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    const visionContent = data.choices[0].message.content;
    
    console.log('✅ Vision analysis complete');
    console.log(`📝 Vision output length: ${visionContent.length} chars`);
    console.log(`🎯 Tokens used: ${data.usage.total_tokens}`);
    
    return {
      content: visionContent,
      model: data.model,
      usage: data.usage
    };
    
  } catch (error) {
    console.error('❌ Vision API call failed:', error);
    throw error;
  }
}

/**
 * Helper: Check if file is an image
 */
export function isImageFile(file: File): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
  const fileName = file.name.toLowerCase();
  return imageExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Helper: Convert image file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
