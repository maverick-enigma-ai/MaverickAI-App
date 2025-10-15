import { useState, useRef, useMemo, useEffect } from 'react';
import { Plus, Paperclip, Lightbulb } from 'lucide-react';
import { FileUploadModal } from './FileUploadModal';
import { SampleScenariosModal } from './SampleScenariosModal';
import { BrandHeader } from './BrandHeader';
import { RadarIcon } from './RadarIcon';
import { type ScenarioCategory } from '../types/sample-scenarios';
import { BRAND_COLORS } from '../utils/brand-colors';

interface ChatInterfaceProps {
  onSubmit: (text: string, files: File[]) => void;
  enabledScenarios?: ScenarioCategory[];
}

export function ChatInterface({ onSubmit, enabledScenarios = ['corporate', 'personal', 'wealth', 'legal'] }: ChatInterfaceProps) {
  // Ensure enabledScenarios is always an array
  const safeEnabledScenarios = enabledScenarios || ['corporate', 'personal', 'wealth', 'legal'];
  
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if ((!inputText.trim() && uploadedFiles.length === 0) || isSubmitting) {
      console.log('🚫 DUPLICATE SUBMIT PREVENTED in ChatInterface');
      return;
    }
    
    console.log('🔒 LOCKING ChatInterface submit button...');
    setIsSubmitting(true);
    setHasSubmitted(true);
    
    onSubmit(inputText, uploadedFiles);
    
    setInputText('');
    setUploadedFiles([]);
    
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
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      
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
      <div className="w-full h-screen flex flex-col overflow-hidden" style={{
        background: BRAND_COLORS.gradients.background
      }}>
        {/* Header */}
        <BrandHeader subtitle="Upload content for strategic analysis" />

        {/* Chat Area - Scrollable with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 pb-64 scrollbar-hide">
          <div className="max-w-md mx-auto">
            {/* Welcome Message - More Compact */}
            <div className="rounded-2xl p-4 mb-4 backdrop-blur-md" style={{
              background: BRAND_COLORS.glass.normal,
              border: `1px solid ${BRAND_COLORS.borders.normal}`
            }}>
              <p className="text-sm mb-3" style={{ 
                color: BRAND_COLORS.text.white,
                fontFamily: 'system-ui, -apple-system, sans-serif', 
                fontWeight: 600 
              }}>
                🎯 Strategic Intelligence Analysis
              </p>
              <ul className="space-y-2 text-sm mb-4" style={{ 
                color: BRAND_COLORS.cyanText,
                fontFamily: 'system-ui, -apple-system, sans-serif' 
              }}>
                <li>• Decode psychological patterns in communications</li>
                <li>• Analyze power dynamics in documents</li>
                <li>• Extract strategic insights from content</li>
              </ul>
              
              {/* Quick Start Examples - Visible Sample Profiles */}
              <div className="space-y-2 mb-3">
                <p className="text-xs px-1" style={{ 
                  color: BRAND_COLORS.cyanText,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 600
                }}>
                  👆 Quick Start Examples - Tap to Use:
                </p>
                
                {/* Corporate Example */}
                <button
                  onClick={() => handleScenarioSelect('My colleague is using passive-aggressive tactics in meetings, undermining my contributions while maintaining a friendly facade. They consistently interrupt me during presentations, then later present similar ideas as their own.', true)}
                  className="w-full py-2.5 px-3 rounded-xl text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: `${BRAND_COLORS.cyan}1A`,
                    border: `1px solid ${BRAND_COLORS.cyan}33`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.cyan}26`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.cyan}1A`;
                  }}
                  data-name="btn_sample_corporate"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">💼</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ 
                        color: BRAND_COLORS.text.white,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 600
                      }}>
                        Undermining Colleague
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ 
                        color: BRAND_COLORS.cyanText,
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        Passive-aggressive tactics in meetings...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Personal Example */}
                <button
                  onClick={() => handleScenarioSelect('A close friend constantly uses guilt and emotional manipulation to get their way. They\'ll make plans, then cancel last minute with dramatic reasons, but expect me to drop everything when they need support. When I set boundaries, they accuse me of being "selfish."', true)}
                  className="w-full py-2.5 px-3 rounded-xl text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: `${BRAND_COLORS.purple}1A`,
                    border: `1px solid ${BRAND_COLORS.purple}33`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.purple}26`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.purple}1A`;
                  }}
                  data-name="btn_sample_personal"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">👥</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ 
                        color: BRAND_COLORS.text.white,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 600
                      }}>
                        Manipulative Friend
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ 
                        color: `${BRAND_COLORS.purple}E6`,
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        Guilt and emotional manipulation...
                      </p>
                    </div>
                  </div>
                </button>

                {/* Wealth Example */}
                <button
                  onClick={() => handleScenarioSelect('A financial advisor is pushing aggressive investment strategies that feel misaligned with my risk tolerance. They use technical jargon to make me feel uninformed, then emphasize limited-time opportunities and the success of "smart clients" who acted quickly.', true)}
                  className="w-full py-2.5 px-3 rounded-xl text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: `${BRAND_COLORS.teal}1A`,
                    border: `1px solid ${BRAND_COLORS.teal}33`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.teal}26`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${BRAND_COLORS.teal}1A`;
                  }}
                  data-name="btn_sample_wealth"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">💰</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ 
                        color: BRAND_COLORS.text.white,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 600
                      }}>
                        Investment Pressure
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ 
                        color: `${BRAND_COLORS.teal}E6`,
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        Aggressive investment strategies...
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Sample Scenarios Button - More Examples */}
              {safeEnabledScenarios.length > 0 && (
                <button
                  onClick={() => setIsScenariosModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(to right, ${BRAND_COLORS.cyan}26, ${BRAND_COLORS.purple}26)`,
                    border: `1px solid ${BRAND_COLORS.borders.normal}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${BRAND_COLORS.cyan}33, ${BRAND_COLORS.purple}33)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${BRAND_COLORS.cyan}26, ${BRAND_COLORS.purple}26)`;
                  }}
                  data-name="btn_view_sample_scenarios"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" style={{ color: BRAND_COLORS.cyanText }} />
                      <span className="text-sm" style={{ 
                        color: BRAND_COLORS.text.white,
                        fontFamily: 'system-ui, -apple-system, sans-serif', 
                        fontWeight: 600 
                      }}>
                        View More Scenarios (15+)
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: BRAND_COLORS.cyanText }}>→</span>
                  </div>
                </button>
              )}
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs px-1" style={{ 
                  color: 'rgba(156, 163, 175, 1)',
                  fontFamily: 'system-ui, -apple-system, sans-serif' 
                }}>
                  Attached Files ({uploadedFiles.length}):
                </p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 backdrop-blur-md rounded-lg p-3" style={{
                    background: BRAND_COLORS.glass.normal,
                    border: `1px solid ${BRAND_COLORS.borders.normal}`
                  }}>
                    <Paperclip className="w-4 h-4 shrink-0" style={{ color: BRAND_COLORS.cyan }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ 
                        color: BRAND_COLORS.text.white,
                        fontFamily: 'system-ui, -apple-system, sans-serif' 
                      }}>
                        {file.name}
                      </p>
                      <p className="text-xs" style={{ 
                        color: `${BRAND_COLORS.cyan}E6`,
                        fontFamily: 'system-ui, -apple-system, sans-serif' 
                      }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="transition-colors text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ color: '#f87171' }}
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

        {/* Input Area - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-10" style={{
          borderTop: `1px solid ${BRAND_COLORS.borders.normal}`,
          background: `linear-gradient(to bottom, ${BRAND_COLORS.deepBlue}, ${BRAND_COLORS.navy})`
        }}>
          <div className="max-w-md mx-auto">
            {/* Text Input with side buttons */}
            <div className="flex items-start gap-3 mb-3">
              {/* File Upload Button */}
              <button
                onClick={() => setIsFileModalOpen(true)}
                className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: `${BRAND_COLORS.cyan}33`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${BRAND_COLORS.cyan}4D`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${BRAND_COLORS.cyan}33`}
                data-name="btn_attach_files"
              >
                <Plus className="w-6 h-6" style={{ color: BRAND_COLORS.cyan }} />
              </button>

              {/* Text Input - GLOWING CONTAINER */}
              <div className="relative flex-1">
                {/* Glowing frame animation */}
                <div className="absolute -inset-0.5 rounded-2xl opacity-60 blur-sm animate-pulse" style={{
                  background: `linear-gradient(to right, ${BRAND_COLORS.cyan}, ${BRAND_COLORS.deepBlue}, ${BRAND_COLORS.purple})`
                }} />
                
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleTextChange}
                  placeholder="Describe your situation or challenge here...&#10;&#10;Be as detailed as you like. The more context you provide, the better the analysis."
                  className="relative w-full min-h-[120px] max-h-[200px] px-4 py-3 rounded-2xl resize-none scrollbar-hide focus:outline-none transition-all placeholder-shown:text-cyan-300/40"
                  style={{
                    backdropFilter: 'blur(16px) saturate(180%)',
                    background: BRAND_COLORS.glass.normal,
                    border: `1px solid ${BRAND_COLORS.borders.normal}`,
                    color: BRAND_COLORS.text.white,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    ['--placeholder-opacity' as any]: '0.4'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = `${BRAND_COLORS.cyan}80`;
                    e.target.style.boxShadow = `0 0 0 2px ${BRAND_COLORS.cyan}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BRAND_COLORS.borders.normal;
                    e.target.style.boxShadow = 'none';
                  }}
                  data-name="input_chat_text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  spellCheck="true"
                  enterKeyHint="send"
                />
              </div>
              
              {/* Radar Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex-shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all relative active:scale-95"
                style={{
                  background: canSubmit && !isSubmitting ? BRAND_COLORS.gradients.cyan : BRAND_COLORS.glass.normal,
                  cursor: !canSubmit || isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: !canSubmit || isSubmitting ? 0.5 : 1
                }}
                data-name="btn_submit_radar"
              >
                <RadarIcon className="w-8 h-8" style={{ color: BRAND_COLORS.text.white }} />
                
                {/* Pulse rings */}
                {canSubmit && !isSubmitting && (
                  <>
                    <div className="absolute inset-0 rounded-full animate-ping" style={{
                      border: `2px solid ${BRAND_COLORS.cyan}33`
                    }} />
                    <div className="absolute inset-1 rounded-full animate-ping" style={{
                      border: `2px solid ${BRAND_COLORS.cyan}26`,
                      animationDelay: '0.5s'
                    }} />
                  </>
                )}
              </button>
            </div>

            {/* Input Hint */}
            <p className="text-center text-xs" style={{ 
              color: BRAND_COLORS.cyanText,
              fontFamily: 'system-ui, -apple-system, sans-serif' 
            }}>
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
        enabledScenarios={safeEnabledScenarios}
      />
    </>
  );
}
