import { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import { FileUploadModal } from './FileUploadModal';

export function MobileFileUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Main Screen */}
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto text-center">
          {/* App Logo/Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl text-white mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            AI File Processor
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-400 mb-12" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Upload files and let AI analyze them for you
          </p>

          {/* Upload Button */}
          <button
            onClick={openModal}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/25 transition-all duration-300 active:scale-98"
            data-name="btn_open_upload"
          >
            <Upload className="w-5 h-5" />
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}>
              Upload Files
            </span>
          </button>

          {/* Features */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  PDF & Document Analysis
                </p>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Extract insights from your documents
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Image Recognition
                </p>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Understand content in your images
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Smart Processing
                </p>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Powered by Make.com & OpenAI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}