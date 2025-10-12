import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { FilePreview } from './FilePreview';

export function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="flex items-center gap-4">
        {/* Upload Button */}
        <div className="relative">
          <button
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              w-12 h-12 rounded-full 
              backdrop-blur-[14px] backdrop-filter bg-[rgba(255,255,255,0.08)] 
              border border-[#5eceff] border-solid
              shadow-[0px_10px_28px_0px_rgba(43,192,255,0.18)]
              flex items-center justify-center
              transition-all duration-300 cursor-pointer
              hover:bg-[rgba(255,255,255,0.12)]
              ${isDragOver ? 'bg-[rgba(94,206,255,0.2)] scale-110' : ''}
            `}
          >
            <Plus className={`w-6 h-6 transition-colors duration-300 ${
              isDragOver ? 'text-[#5eceff]' : 'text-[#eaf4ff]'
            }`} />
          </button>
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* File Previews */}
        {uploadedFiles.length > 0 && (
          <div className="flex gap-3 max-w-[280px] overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.2)] scrollbar-track-transparent">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative flex-shrink-0">
                <FilePreview 
                  file={file} 
                  onRemove={() => removeFile(index)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      {uploadedFiles.length === 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-gray-500 text-center">
            Click the + button or drag files to upload
          </p>
        </div>
      )}
    </div>
  );
}