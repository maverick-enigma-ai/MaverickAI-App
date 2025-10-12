/**
 * 🧪 TEST DASHBOARD
 * 
 * Simple UI to test the OpenAI Direct Service
 * Shows real-time status and logs
 */

import { useState } from 'react';
import { openAIDirectServiceSimplified } from '../services/openai-direct-service-simplified';
import { supabase } from '../utils/supabase/client';

export function TestDashboard() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleTest = async () => {
    if (!query.trim()) {
      alert('Please enter a query!');
      return;
    }

    setIsProcessing(true);
    setLogs([]);
    setResult(null);
    setError(null);

    try {
      addLog('🚀 Starting test...');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not logged in!');
      }

      addLog(`👤 User: ${user.email}`);
      addLog(`📝 Query: ${query.substring(0, 50)}...`);
      addLog('🔄 Calling OpenAI Direct Service...');

      const response = await openAIDirectServiceSimplified.submitQuery(
        user.id,
        user.email || 'test@example.com',
        query
      );

      if (response.success) {
        addLog('✅ SUCCESS!');
        addLog(`📊 Analysis ID: ${response.analysisId}`);
        setResult(response.data);
      } else {
        addLog('❌ FAILED!');
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      addLog('💥 ERROR!');
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧪 OpenAI Direct Service Test Dashboard
          </h1>
          <p className="text-cyan-400">
            Simplified version with better logging
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <label className="block text-white mb-2 font-semibold">
            Enter Test Query:
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., My boss keeps micromanaging me during meetings..."
            className="w-full h-32 p-4 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
            disabled={isProcessing}
          />
          
          <button
            onClick={handleTest}
            disabled={isProcessing}
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25"
          >
            {isProcessing ? '🔄 Processing...' : '🚀 Run Test'}
          </button>
        </div>

        {/* Logs Section */}
        {logs.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">📋 Console Logs</h2>
            <div className="bg-black/50 rounded-xl p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-green-500/30">
            <h2 className="text-xl font-bold text-white mb-4">✅ Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-black/30 rounded-xl p-4 text-center">
                <div className="text-cyan-400 text-sm mb-1">Power</div>
                <div className="text-3xl font-bold text-white">{result.powerScore}</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 text-center">
                <div className="text-purple-400 text-sm mb-1">Gravity</div>
                <div className="text-3xl font-bold text-white">{result.gravityScore}</div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 text-center">
                <div className="text-pink-400 text-sm mb-1">Risk</div>
                <div className="text-3xl font-bold text-white">{result.riskScore}</div>
              </div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-cyan-400 text-sm mb-2">Summary</div>
              <div className="text-white">{result.summary}</div>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
            <h2 className="text-xl font-bold text-white mb-4">❌ Error</h2>
            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm text-red-400">
              {error}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">📖 Instructions</h2>
          <ul className="space-y-2 text-gray-300">
            <li>✅ Make sure you're logged in</li>
            <li>✅ Enter a test query above</li>
            <li>✅ Click "Run Test"</li>
            <li>✅ Watch the console logs in real-time</li>
            <li>✅ Check the browser console for detailed OpenAI logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
