import { useState, useRef, useMemo, useEffect } from 'react';
import { Plus, Paperclip, Lightbulb } from 'lucide-react';
import { FileUploadModal } from './FileUploadModal';
import { SampleScenariosModal } from './SampleScenariosModal';
import { BrandHeader } from './BrandHeader';
import { RadarIcon } from './RadarIcon';
import { type ScenarioCategory } from '../types/sample-scenarios';

interface ChatInterfaceProps {
  onSubmit: (text: string, files: File[]) => void;
  enabledScenarios?: ScenarioCategory[];
}

export function ChatInterface({ onSubmit, enabledScenarios = ['corporate', 'personal', 'wealth', 'legal'] }: ChatInterfaceProps) {
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent back navigation after submission
  useEffect(() => {
    if (hasSubmitted) {
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      };
      
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [hasSubmitted]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea - increased max height to 200px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setIsFileModalOpen(false);
  };

  const handleSubmit = async () => {
    // Strong duplicate prevention
    if ((!inputText.trim() && uploadedFiles.length === 0) || isSubmitting) {
      console.log('🚫 DUPLICATE SUBMIT PREVENTED in ChatInterface');
      return;
    }
    
    console.log('🔒 LOCKING ChatInterface submit button...');
    setIsSubmitting(true);
    setHasSubmitted(true); // Mark as submitted to prevent back navigation
    
    // Call onSubmit immediately - no artificial delay
    onSubmit(inputText, uploadedFiles);
    
    // Clear inputs
    setInputText('');
    setUploadedFiles([]);
    
    // Keep button disabled for 2 seconds to prevent rapid double-clicks
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('🔓 ChatInterface submit button unlocked');
    }, 2000);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleScenarioSelect = (text: string, shouldFocus: boolean) => {
    setInputText(text);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      
      // Focus and move cursor to end if editing
      if (shouldFocus) {
        setTimeout(() => {
          textareaRef.current?.focus();
          const length = text.length;
          textareaRef.current?.setSelectionRange(length, length);
        }, 100);
      }
    }
  };

  const canSubmit = (inputText.trim().length > 0 || uploadedFiles.length > 0) && !isSubmitting;

  return (
    <>
      <div className="w-full h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] flex flex-col overflow-hidden">
        {/* Header */}
        <BrandHeader subtitle="Upload content for strategic analysis" />

        {/* Chat Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 pb-64">
          <div className="max-w-md mx-auto">
            {/* Welcome Message - More Compact */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
              <p className="text-white text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                🎯 Strategic Intelligence Analysis
              </p>
              <ul className="space-y-2 text-sm text-cyan-300 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <li>• Decode psychological patterns in communications</li>
                <li>• Analyze power dynamics in documents</li>
                <li>• Extract strategic insights from content</li>
              </ul>
              
              {/* Sample Scenarios Button */}
              {enabledScenarios.length > 0 && (
                <button
                  onClick={() => setIsScenariosModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-white/20 transition-all duration-200 active:scale-[0.98]"
                  data-name="btn_view_sample_scenarios"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        View Sample Scenarios
                      </span>
                    </div>
                    <span className="text-cyan-400 text-xs">→</span>
                  </div>
                </button>
              )}
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-gray-400 px-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Attached Files ({uploadedFiles.length}):
                </p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                    <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {file.name}
                      </p>
                      <p className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                      data-name={`btn_remove_file_${index}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at bottom, always visible */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-b from-[#342FA5] to-[#14123F] z-10">
          <div className="max-w-md mx-auto">
            {/* Text Input with side buttons */}
            <div className="flex items-start gap-3 mb-3">
              {/* File Upload Button - Left Side */}
              <button
                onClick={() => setIsFileModalOpen(true)}
                className="flex-shrink-0 w-[52px] h-[52px] rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center transition-colors"
                data-name="btn_attach_files"
              >
                <Plus className="w-6 h-6 text-cyan-400" />
              </button>

              {/* Text Input - WRAPPED IN GLOWING CONTAINER - TALLER */}
              <div className="relative flex-1">
                {/* Glowing frame animation */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-60 blur-sm animate-pulse" />
                
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleTextChange}
                  placeholder="Describe your situation or challenge here...&#10;&#10;Be as detailed as you like. The more context you provide, the better the analysis."
                  className="relative w-full min-h-[120px] max-h-[200px] px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-cyan-300/30 resize-none scrollbar-hide focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  data-name="input_chat_text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  spellCheck="true"
                  enterKeyHint="send"
                />
              </div>
              
              {/* Radar Submit Button - Right Side */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all relative ${
                  canSubmit && !isSubmitting
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 cursor-pointer active:scale-95'
                    : 'bg-white/10 cursor-not-allowed opacity-50'
                }`}
                data-name="btn_submit_radar"
              >
                <RadarIcon className="w-8 h-8 text-white" />
                
                {/* Pulse rings - only show when can submit */}
                {canSubmit && !isSubmitting && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
                    <div className="absolute inset-1 rounded-full border-2 border-cyan-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </button>
            </div>

            {/* Input Hint */}
            <p className="text-center text-xs text-cyan-400/70" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {isSubmitting ? 'Initiating Radar Scan...' : canSubmit ? '✨ Tap radar to begin psychological analysis' : '💡 Upload files + add text, then tap radar'}
            </p>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFilesUploaded={handleFilesUploaded}
      />
      
      {/* Sample Scenarios Modal */}
      <SampleScenariosModal
        isOpen={isScenariosModalOpen}
        onClose={() => setIsScenariosModalOpen(false)}
        onSelectScenario={handleScenarioSelect}
        enabledScenarios={enabledScenarios}
      />
    </>
  );
}