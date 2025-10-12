/**
 * ========================================
 * SHARED: OpenAI Response Parser
 * ========================================
 * 
 * Parses and normalizes OpenAI Assistant responses for both Option A and Option B.
 * Ensures consistent data structure regardless of response format.
 * 
 * @author MaverickAI Enigma Radar™
 * @version 2.0.0 - Modular Design
 * @date October 10, 2025
 */

export interface PsychologicalProfile {
  primaryMotivation: string;
  motivationEvidence: string;
  hiddenDriver: string;
  hiddenDriverSignal: string;
  emotionalState: string;
  emotionalEvidence: string;
  powerDynamic: string;
  powerDynamicEvidence: string;
}

export interface ParsedAnalysis {
  // Core scores (0-100)
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  confidenceLevel: number;
  
  // Summaries
  summary: string;
  snapshot?: string;
  whatsHappening: string;
  whyItMatters: string;
  narrativeSummary: string;
  
  // Strategic moves (as strings with bullet points)
  immediateMove: string;
  strategicTool: string;
  analyticalCheck: string;
  longTermFix: string;
  
  // Explanations
  powerExplanation: string;
  gravityExplanation: string;
  riskExplanation: string;
  
  // Definitions
  powerDefinition?: string;
  gravityDefinition?: string;
  riskDefinition?: string;
  
  // Classifications
  issueType: string;
  issueCategory: string;
  issueLayer: string;
  
  // 🧠 NEW: Psychological Intelligence
  psychologicalProfile?: PsychologicalProfile;
}

/**
 * Parse OpenAI response (handles both json_schema and json_object formats)
 */
export function parseOpenAIResponse(responseText: string): ParsedAnalysis {
  console.log('🔍 Parsing OpenAI response...');
  
  // Remove markdown code blocks if present
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '');
  }
  
  try {
    const parsed = JSON.parse(jsonText);
    
    // 🔍 DEBUG: Log the raw parsed response to see what we're getting
    console.log('🔍 Raw parsed OpenAI response:', JSON.stringify(parsed, null, 2));
    console.log('🔍 Available keys:', Object.keys(parsed));
    
    // Normalize scores to 0-100 range
    const normalizeScore = (score: any): number => {
      const num = typeof score === 'string' ? parseFloat(score) : score;
      const normalized = Math.max(0, Math.min(100, Math.round(num || 0)));
      console.log(`🔍 Normalizing score: ${score} -> ${normalized}`);
      return normalized;
    };
    
    // Helper to join array items with bullet points
    const joinWithBullets = (items: any): string => {
      if (!items) return '';
      if (typeof items === 'string') return items;
      if (Array.isArray(items)) {
        return items.map(item => `• ${item}`).join('\n');
      }
      return String(items);
    };
    
    // Parse based on structure (Option A uses nested objects, Option B uses flat structure)
    const isOptionAFormat = parsed.moves && typeof parsed.moves === 'object';
    const isLegacyFormat = parsed.Awakening || parsed['Stakeholder Map'];
    
    console.log(`🔍 Detected format: ${isOptionAFormat ? 'Option A (json_schema)' : isLegacyFormat ? 'LEGACY NARRATIVE FORMAT (WRONG!)' : 'Option B (json_object)'}`);
    
    // Handle legacy "Awakening" format (OLD ASSISTANT INSTRUCTIONS)
    if (isLegacyFormat) {
      console.error('❌❌❌ CRITICAL: OpenAI returned WRONG FORMAT!');
      console.error('❌ Your assistant is using OLD instructions!');
      console.error('❌ Update your assistant instructions at: https://platform.openai.com/assistants');
      console.error('❌ Use content from: /openai-assistant-instructions.txt');
      
      // Return default values with error message
      return {
        powerScore: 0,
        gravityScore: 0,
        riskScore: 0,
        confidenceLevel: 0,
        
        summary: '⚠️ ERROR: Assistant returned wrong format - update assistant instructions',
        snapshot: parsed.Awakening || '',
        whatsHappening: JSON.stringify(parsed['Invisible Architecture'] || parsed.Toolkit || []).substring(0, 500),
        whyItMatters: 'Your OpenAI Assistant is using outdated instructions. Please update it with the content from /openai-assistant-instructions.txt',
        narrativeSummary: parsed['Sovereignty Move'] || '',
        
        immediateMove: '1. Go to https://platform.openai.com/assistants\n2. Edit your assistant\n3. Replace instructions with content from /openai-assistant-instructions.txt',
        strategicTool: '',
        analyticalCheck: '',
        longTermFix: '',
        
        powerExplanation: '',
        gravityExplanation: '',
        riskExplanation: '',
        
        powerDefinition: '',
        gravityDefinition: '',
        riskDefinition: '',
        
        issueType: 'Configuration Error',
        issueCategory: 'Assistant Instructions Mismatch',
        issueLayer: 'System'
      };
    }
    
    if (isOptionAFormat) {
      // Option A format (json_schema with nested objects)
      console.log('📋 Detected Option A format (json_schema)');
      
      return {
        powerScore: normalizeScore(parsed.power),
        gravityScore: normalizeScore(parsed.gravity),
        riskScore: normalizeScore(parsed.risk),
        confidenceLevel: normalizeScore(parsed.issue_confidence_pct || 85),
        
        summary: parsed.tl_dr || 'Analysis complete',
        snapshot: parsed.snapshot || '',
        whatsHappening: parsed.whats_happening || '',
        whyItMatters: parsed.why_it_matters || '',
        narrativeSummary: parsed.narrative_summary || '',
        
        immediateMove: joinWithBullets(parsed.moves?.immediate_action),
        strategicTool: joinWithBullets(parsed.moves?.strategic_tool),
        analyticalCheck: joinWithBullets(parsed.moves?.analytical_check),
        longTermFix: joinWithBullets(parsed.moves?.long_term_fix),
        
        powerExplanation: parsed.explanations?.power || '',
        gravityExplanation: parsed.explanations?.gravity || '',
        riskExplanation: parsed.explanations?.risk || '',
        
        powerDefinition: parsed.definitions?.power || '',
        gravityDefinition: parsed.definitions?.gravity || '',
        riskDefinition: parsed.definitions?.risk || '',
        
        issueType: parsed.issue_type || '',
        issueCategory: parsed.issue_category || '',
        issueLayer: parsed.issue_layer || '',
        
        // 🧠 Psychological Profile (Option A format)
        psychologicalProfile: parsed.psychological_profile ? {
          primaryMotivation: parsed.psychological_profile.primary_motivation || '',
          motivationEvidence: parsed.psychological_profile.motivation_evidence || '',
          hiddenDriver: parsed.psychological_profile.hidden_driver || '',
          hiddenDriverSignal: parsed.psychological_profile.hidden_driver_signal || '',
          emotionalState: parsed.psychological_profile.emotional_state || '',
          emotionalEvidence: parsed.psychological_profile.emotional_evidence || '',
          powerDynamic: parsed.psychological_profile.power_dynamic || '',
          powerDynamicEvidence: parsed.psychological_profile.power_dynamic_evidence || ''
        } : undefined
      };
    } else {
      // Option B format (json_object with flat structure)
      // Try multiple field name variations for compatibility
      console.log('📎 Detected Option B format (json_object)');
      
      // Flexible field extraction - try multiple variations
      const getPower = () => parsed.power_score || parsed.power || parsed.powerScore || 0;
      const getGravity = () => parsed.gravity_score || parsed.gravity || parsed.gravityScore || 0;
      const getRisk = () => parsed.risk_score || parsed.risk || parsed.riskScore || 0;
      
      console.log(`🔍 Power field values: power_score=${parsed.power_score}, power=${parsed.power}, powerScore=${parsed.powerScore}`);
      console.log(`🔍 Gravity field values: gravity_score=${parsed.gravity_score}, gravity=${parsed.gravity}, gravityScore=${parsed.gravityScore}`);
      console.log(`🔍 Risk field values: risk_score=${parsed.risk_score}, risk=${parsed.risk}, riskScore=${parsed.riskScore}`);
      
      return {
        powerScore: normalizeScore(getPower()),
        gravityScore: normalizeScore(getGravity()),
        riskScore: normalizeScore(getRisk()),
        confidenceLevel: normalizeScore(parsed.issue_confidence_pct || parsed.confidence || 85),
        
        summary: parsed.tl_dr || parsed.summary || 'Analysis complete',
        snapshot: parsed.snapshot || '',
        whatsHappening: parsed.whats_happening || parsed.whatsHappening || '',
        whyItMatters: parsed.why_it_matters || parsed.whyItMatters || '',
        narrativeSummary: parsed.narrative_summary || parsed.narrativeSummary || '',
        
        immediateMove: parsed.immediate_move || parsed.immediateMove || '',
        strategicTool: parsed.strategic_tool || parsed.strategicTool || '',
        analyticalCheck: parsed.analytical_check || parsed.analyticalCheck || '',
        longTermFix: parsed.long_term_fix || parsed.longTermFix || '',
        
        powerExplanation: parsed.power_expl || parsed.power_explanation || parsed.powerExplanation || '',
        gravityExplanation: parsed.gravity_expl || parsed.gravity_explanation || parsed.gravityExplanation || '',
        riskExplanation: parsed.risk_expl || parsed.risk_explanation || parsed.riskExplanation || '',
        
        powerDefinition: parsed.power_definition || parsed.powerDefinition || '',
        gravityDefinition: parsed.gravity_definition || parsed.gravityDefinition || '',
        riskDefinition: parsed.risk_definition || parsed.riskDefinition || '',
        
        issueType: parsed.issue_type || parsed.issueType || '',
        issueCategory: parsed.issue_category || parsed.issueCategory || '',
        issueLayer: parsed.issue_layer || parsed.issueLayer || '',
        
        // 🧠 Psychological Profile (Option B format)
        psychologicalProfile: parsed.psychological_profile ? {
          primaryMotivation: parsed.psychological_profile.primary_motivation || '',
          motivationEvidence: parsed.psychological_profile.motivation_evidence || '',
          hiddenDriver: parsed.psychological_profile.hidden_driver || '',
          hiddenDriverSignal: parsed.psychological_profile.hidden_driver_signal || '',
          emotionalState: parsed.psychological_profile.emotional_state || '',
          emotionalEvidence: parsed.psychological_profile.emotional_evidence || '',
          powerDynamic: parsed.psychological_profile.power_dynamic || '',
          powerDynamicEvidence: parsed.psychological_profile.power_dynamic_evidence || ''
        } : undefined
      };
    }
  } catch (error) {
    console.error('❌ Failed to parse OpenAI response:', error);
    console.error('📄 Raw response:', responseText.substring(0, 500));
    throw new Error('Failed to parse OpenAI response - assistant may not be returning valid JSON');
  }
}
