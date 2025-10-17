/**
 * 🧪 SANDBOX TEST PAGE
 * 
 * This is a dedicated testing environment for file upload functionality.
 * Access via: /#sandbox or /sandbox route
 * 
 * Features:
 * - Test file uploads without affecting production
 * - See detailed logs of file upload process
 * - Configure sandbox webhook URL
 * - Initialize Supabase Storage bucket
 */

import { useState } from 'react';
import { useRunRadarSandbox } from './runradar-service-sandbox.legacy';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BrandHeader } from '../components/BrandHeader';
import { ChevronLeft, TestTube, Upload, Database, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SandboxTestPageProps {
  onBack: () => void;
  user: {
    uid: string;
    email: string;
    paymentPlan?: string;
  };
}

export function SandboxTestPage({ onBack, user }: SandboxTestPageProps) {
  const [text, setText] = useState('This is a sandbox test of the file upload system. Testing with attachments.');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    jobId?: string;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [storageInitialized, setStorageInitialized] = useState(false);
  
  const { submitAnalysis, testConnection, initializeStorage } = useRunRadarSandbox();
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };
  
  const handleInitializeStorage = async () => {
    addLog('🗄️ Initializing Supabase Storage bucket...');
    const result = await initializeStorage();
    
    if (result.success) {
      addLog('✅ Storage initialized successfully!');
      setStorageInitialized(true);
    } else {
      addLog(`❌ Storage initialization failed: ${result.message}`);
    }
  };
  
  const handleTestConnection = async () => {
    addLog('🧪 Testing webhook connection...');
    const result = await testConnection();
    
    if (result.success) {
      addLog('✅ Webhook connection successful!');
      setTestResult({ success: true, message: result.message });
    } else {
      addLog(`❌ Webhook test failed: ${result.message}`);
      setTestResult({ success: false, message: result.message });
    }
  };
  
  const handleSubmit = async () => {
    if (!text.trim()) {
      addLog('❌ Please enter some text');
      return;
    }
    
    setIsSubmitting(true);
    setTestResult(null);
    addLog('🚀 Starting sandbox submission...');
    addLog(`📝 Text: ${text.substring(0, 50)}...`);
    addLog(`📎 Files: ${files.length}`);
    
    if (files.length > 0) {
      files.forEach((file, i) => {
        addLog(`   📄 File ${i + 1}: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      });
    }
    
    try {
      const result = await submitAnalysis(
        text,
        user.uid,
        user.email,
        user.paymentPlan || 'basic',
        files
      );
      
      if (result.success) {
        addLog('✅ Submission successful!');
        addLog(`🆔 Job ID: ${result.jobId}`);
        if (result.data) {
          addLog('📊 Analysis data received from Supabase');
          addLog(`   Power: ${result.data.powerScore}`);
          addLog(`   Gravity: ${result.data.gravityScore}`);
          addLog(`   Risk: ${result.data.riskScore}`);
        }
        setTestResult({
          success: true,
          message: 'Analysis completed successfully!',
          jobId: result.jobId
        });
      } else {
        addLog(`❌ Submission failed: ${result.error}`);
        setTestResult({
          success: false,
          message: result.error || 'Unknown error'
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`💥 Exception: ${errorMsg}`);
      setTestResult({
        success: false,
        message: errorMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#14123F]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <TestTube className="w-8 h-8 text-[#00d4ff]" />
              <div>
                <h1 className="font-semibold">File Upload Sandbox</h1>
                <p className="text-sm text-white/60">Testing Environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Setup Instructions */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#fbbf24] mt-0.5" />
              <div className="flex-1">
                <h2 className="font-semibold mb-2">Setup Instructions</h2>
                <ol className="text-sm text-white/80 space-y-2 list-decimal list-inside">
                  <li>Update <code className="bg-white/10 px-2 py-0.5 rounded">SANDBOX_CONFIG.WEBHOOK_URL</code> in <code className="bg-white/10 px-2 py-0.5 rounded">/services/runradar-service-sandbox.ts</code></li>
                  <li>Initialize Supabase Storage bucket (one-time setup)</li>
                  <li>Test webhook connection</li>
                  <li>Submit test data with file attachments</li>
                  <li>Check Make.com execution history</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Quick Actions */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleInitializeStorage}
              disabled={storageInitialized}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Database className="w-4 h-4 mr-2" />
              {storageInitialized ? 'Storage Ready' : 'Initialize Storage'}
            </Button>
            
            <Button
              onClick={handleTestConnection}
              className="bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 text-[#00d4ff] border border-[#00d4ff]/30"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test Webhook
            </Button>
          </div>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{testResult.message}</p>
                  {testResult.jobId && (
                    <p className="text-sm text-white/60 mt-1">Job ID: {testResult.jobId}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Test Form */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Test Submission</h2>
          
          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe a situation to analyze..."
                className="w-full min-h-[120px] px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent resize-none"
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                File Attachments
              </label>
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                maxFiles={5}
                maxSizeMB={10}
              />
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !text.trim()}
              className="w-full h-14 bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] hover:opacity-90 text-[#14123F] font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#14123F]/30 border-t-[#14123F] rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Submit Test
                </>
              )}
            </Button>
          </div>
        </Card>
        
        {/* Logs */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Activity Log</h2>
            <Button
              onClick={() => setLogs([])}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Clear
            </Button>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-white/40">No activity yet...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-white/80">{log}</div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {/* User Info */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-4">
          <div className="text-sm text-white/60">
            <p>Testing as: <span className="text-white">{user.email}</span></p>
            <p>User ID: <span className="text-white/80 font-mono text-xs">{user.uid}</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
}