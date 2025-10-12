/**
 * 🎯 DATABASE ABSTRACTION LAYER
 * 
 * This module provides a clean interface for database operations,
 * making it easy to switch from Supabase to another provider.
 * 
 * Current Implementation: Supabase
 * Future Options: Firebase, MongoDB, PostgreSQL direct, etc.
 * 
 * Date: October 9, 2025
 */

import { supabase } from '../supabase/client';

// ────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────

export interface AnalysisRecord {
  id: string;
  user_id: string;
  email: string;
  input_text: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  is_ready: boolean;
  created_at: string;
  updated_at: string;
  
  // Analysis Results (optional until complete)
  power_score?: number;
  gravity_score?: number;
  risk_score?: number;
  confidence_level?: number;
  
  // Summaries
  summary?: string;
  tl_dr?: string;
  snapshot?: string;
  whats_happening?: string;
  why_it_matters?: string;
  narrative_summary?: string;
  
  // Moves
  immediate_move?: string;
  strategic_tool?: string;
  analytical_check?: string;
  long_term_fix?: string;
  
  // Explanations
  power_explanation?: string;
  gravity_explanation?: string;
  risk_explanation?: string;
  
  // Definitions
  power_definition?: string;
  gravity_definition?: string;
  risk_definition?: string;
  
  // Categories
  issue_type?: string;
  issue_category?: string;
  issue_layer?: string;
  
  // 🧠 Psychological Intelligence (Phase 2 - Gold Nugget #1)
  psychological_profile?: {
    primary_motivation: string;
    motivation_evidence: string;
    hidden_driver: string;
    hidden_driver_signal: string;
    emotional_state: string;
    emotional_evidence: string;
    power_dynamic: string;
    power_dynamic_evidence: string;
  };
  
  // Radar fields
  radar_control?: number;
  radar_gravity?: number;
  radar_confidence?: number;
  radar_stability?: number;
  radar_strategy?: number;
  
  // Timestamps
  processing_completed_at?: string;
  
  // Make.com tracking (optional - only for Make.com workflow)
  job_id?: string;
  query_id?: string;
  answers_id?: string;
}

export interface SubmissionRecord {
  id?: string;
  analysis_id: string;
  user_id: string;
  email: string;
  input_querytext?: string;  // Optional - may not be provided initially
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  
  // Make.com tracking (optional - only for Make.com workflow)
  job_id?: string;
  session_id?: string;
  query_id?: string;
  answers_id?: string;
  payment_plan?: string;
}

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ────────────────────────────────────────────────────────────────
// DATABASE ADAPTER CLASS
// ────────────────────────────────────────────────────────────────

class DatabaseAdapter {
  
  // ──────────────────────────────────────────────────────────────
  // ANALYSES TABLE OPERATIONS
  // ──────────────────────────────────────────────────────────────
  
  /**
   * Create a new analysis record
   * Only requires: id, user_id, email, input_text
   */
  async createAnalysis(data: Partial<AnalysisRecord>): Promise<DatabaseResult<AnalysisRecord>> {
    console.log(`🔧 DATABASE ADAPTER: createAnalysis called`);
    console.log(`🔧 Creating record with id=${data.id}, user_id=${data.user_id}, email=${data.email}`);
    
    try {
      const { data: result, error } = await supabase
        .from('analyses')
        .insert({
          id: data.id,
          user_id: data.user_id,
          email: data.email,
          input_text: data.input_text,
          status: data.status || 'processing',
          is_ready: data.is_ready || false,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          
          // Optional Make.com tracking fields
          job_id: data.job_id || null,
          query_id: data.query_id || null,
          answers_id: data.answers_id || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌❌❌ DATABASE ERROR creating analysis!');
        console.error('❌ Error object:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        return { success: false, error: error.message };
      }
      
      if (!result) {
        console.error('❌❌❌ NO RESULT RETURNED from database insert!');
        return { success: false, error: 'No result returned from database' };
      }
      
      console.log(`✅ DATABASE ADAPTER: Successfully created analysis ${data.id}`);
      console.log(`✅ Created record:`, result);
      return { success: true, data: result };
    } catch (err) {
      console.error('❌❌❌ EXCEPTION in createAnalysis!');
      console.error('❌ Exception:', err);
      return { success: false, error: String(err) };
    }
  }
  
  /**
   * Update an existing analysis with results
   */
  async updateAnalysis(
    id: string, 
    updates: Partial<AnalysisRecord>
  ): Promise<DatabaseResult<AnalysisRecord>> {
    console.log(`🔧 DATABASE ADAPTER: updateAnalysis called for id=${id}`);
    console.log(`🔧 Update payload keys:`, Object.keys(updates));
    
    try {
      const { data: result, error } = await supabase
        .from('analyses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌❌❌ DATABASE ERROR updating analysis!');
        console.error('❌ Error object:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        return { success: false, error: error.message };
      }
      
      if (!result) {
        console.error('❌❌❌ NO RESULT RETURNED from database update!');
        return { success: false, error: 'No result returned from database' };
      }
      
      console.log(`✅ DATABASE ADAPTER: Successfully updated analysis ${id}`);
      console.log(`✅ Updated record:`, result);
      return { success: true, data: result };
    } catch (err) {
      console.error('❌❌❌ EXCEPTION in updateAnalysis!');
      console.error('❌ Exception:', err);
      return { success: false, error: String(err) };
    }
  }
  
  /**
   * Get analysis by ID
   */
  async getAnalysisById(id: string): Promise<DatabaseResult<AnalysisRecord>> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('❌ Database error fetching analysis:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ Exception fetching analysis:', err);
      return { success: false, error: String(err) };
    }
  }
  
  /**
   * Get all analyses for a user
   */
  async getAnalysesByUserId(userId: string): Promise<DatabaseResult<AnalysisRecord[]>> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Database error fetching analyses:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: data || [] };
    } catch (err) {
      console.error('❌ Exception fetching analyses:', err);
      return { success: false, error: String(err) };
    }
  }
  
  // ──────────────────────────────────────────────────────────────
  // SUBMISSIONS TABLE OPERATIONS
  // ──────────────────────────────────────────────────────────────
  
  /**
   * Create a new submission record
   * Only requires: analysis_id, user_id, email, input_querytext
   */
  async createSubmission(data: Partial<SubmissionRecord>): Promise<DatabaseResult<SubmissionRecord>> {
    try {
      const { data: result, error } = await supabase
        .from('submissions')
        .insert({
          analysis_id: data.analysis_id,
          user_id: data.user_id,
          email: data.email,
          input_querytext: data.input_querytext,
          status: data.status || 'pending',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          
          // Optional Make.com tracking fields
          job_id: data.job_id || null,
          session_id: data.session_id || null,
          query_id: data.query_id || null,
          answers_id: data.answers_id || null,
          payment_plan: data.payment_plan || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Database error creating submission:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ Exception creating submission:', err);
      return { success: false, error: String(err) };
    }
  }
  
  /**
   * Update submission status
   */
  async updateSubmission(
    analysisId: string,
    updates: Partial<SubmissionRecord>
  ): Promise<DatabaseResult<SubmissionRecord>> {
    try {
      const { data: result, error } = await supabase
        .from('submissions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('analysis_id', analysisId)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Database error updating submission:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ Exception updating submission:', err);
      return { success: false, error: String(err) };
    }
  }
  
  // ──────────────────────────────────────────────────────────────
  // USERS TABLE OPERATIONS
  // ──────────────────────────────────────────────────────────────
  
  /**
   * Get user payment plan
   */
  async getUserPaymentPlan(userId: string): Promise<DatabaseResult<string>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('payment_plan')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.warn('⚠️ Could not fetch payment_plan, defaulting to free:', error?.message);
        return { success: true, data: 'free' };
      }
      
      return { success: true, data: data.payment_plan || 'free' };
    } catch (err) {
      console.warn('⚠️ Exception fetching payment_plan, defaulting to free:', err);
      return { success: true, data: 'free' };
    }
  }
}

// ────────────────────────────────────────────────────────────────
// EXPORT SINGLETON INSTANCE
// ────────────────────────────────────────────────────────────────

export const db = new DatabaseAdapter();

// ────────────────────────────────────────────────────────────────
// MIGRATION GUIDE FOR FUTURE DATABASE PROVIDERS
// ────────────────────────────────────────────────────────────────

/**
 * TO SWITCH TO A DIFFERENT DATABASE PROVIDER:
 * 
 * 1. Keep the same interface (AnalysisRecord, SubmissionRecord, etc.)
 * 2. Replace the DatabaseAdapter implementation
 * 3. Update imports at the top (remove supabase, add new provider)
 * 4. Keep the same method signatures
 * 5. All services using `db.createAnalysis()` will continue to work!
 * 
 * Example for Firebase:
 * 
 * import { getFirestore, collection, addDoc, updateDoc } from 'firebase/firestore';
 * const firestore = getFirestore();
 * 
 * async createAnalysis(data: Partial<AnalysisRecord>) {
 *   try {
 *     const docRef = await addDoc(collection(firestore, 'analyses'), data);
 *     return { success: true, data: { id: docRef.id, ...data } };
 *   } catch (err) {
 *     return { success: false, error: String(err) };
 *   }
 * }
 * 
 * No other files need to change! ✅
 */
