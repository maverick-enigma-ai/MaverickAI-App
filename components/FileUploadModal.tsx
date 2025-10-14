import { useState, useRef } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { MobileFilePreview } from './MobileFilePreview';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded?: (files: File[]) => void;
}

export function FileUploadModal({ isOpen, onClose, onFilesUploaded }: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setIsUploading(true);
      const newFiles = Array.from(files);
      // Limit to 3 files for mobile
      setUploadedFiles(prev => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 3);
      });
      
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const handleClose = () => {
    // Pass files to parent if callback provided
    if (onFilesUploaded && uploadedFiles.length > 0) {
      onFilesUploaded(uploadedFiles);
    }
    
    // Reset all states when closing
    setUploadedFiles([]);
    setIsUploading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] rounded-t-3xl sm:rounded-3xl border border-white/20 max-h-[90vh] overflow-hidden backdrop-blur-md"
            data-name="modal_file_upload"
          >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Upload Files
            </h2>
            <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Select files for AI processing
            </p>
          </div>
          <motion.button
            onClick={handleClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-300 min-h-[48px] min-w-[48px] shadow-lg hover:shadow-cyan-500/30 group relative overflow-hidden"
            data-name="btn_close_modal"
          >
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
            <X className="w-6 h-6 text-white/70 group-hover:text-white relative z-10 transition-colors" />
          </motion.button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Upload Area */}
          <div className="mb-6">
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className={`
                w-full h-28 rounded-2xl border-2 border-dashed
                ${isUploading 
                  ? 'border-cyan-400 bg-cyan-50/5' 
                  : 'border-cyan-300/50 bg-white/5 hover:bg-white/10'
                }
                backdrop-blur-sm transition-all duration-300
                flex flex-col items-center justify-center gap-2
                active:scale-98 touch-none
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              data-name="btn_upload_files"
            >
              {isUploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Tap to select files
                    </p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      PDF, Word, Excel, PowerPoint (Max 3)
                    </p>
                  </div>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.pptx,.xlsx,.xls,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              data-name="input_file_selector"
            />
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3 mb-6" data-name="list_uploaded_files">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Files ({uploadedFiles.length}/3)
                </h3>
                <button
                  onClick={clearAllFiles}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded bg-red-500/10"
                  data-name="btn_clear_all"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Clear
                </button>
              </div>

              {uploadedFiles.map((file, index) => (
                <MobileFilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => removeFile(index)}
                  index={index}
                />
              ))}
            </div>
          )}



          {/* Empty State */}
          {uploadedFiles.length === 0 && !isUploading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                No files selected
              </p>
              <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Upload files to start AI processing
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer - Award-Winning Done Button */}
        {uploadedFiles.length > 0 && (
          <div className="p-6 border-t border-white/10">
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white flex items-center justify-center gap-3 transition-all duration-300 min-h-[60px] shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 relative overflow-hidden group"
              data-name="btn_done"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}
            >
              {/* Animated gradient background */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 opacity-0 group-hover:opacity-100"
                style={{ backgroundSize: '200% 100%' }}
              />
              
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
              
              <span className="relative z-10 flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.span>
                <span>Done</span>
              </span>
            </motion.button>
            <p className="text-center text-xs text-white/50 mt-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Files attached. Add your situation text and tap Send.
            </p>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}