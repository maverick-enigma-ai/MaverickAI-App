import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, Check, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';

interface MediaUploadManagerProps {
  onClose: () => void;
  onMediaUploaded: (urls: { type: 'image' | 'video'; url: string; name: string }[]) => void;
  maxFiles?: number;
  acceptedTypes?: 'images' | 'videos' | 'both';
}

export function MediaUploadManager({
  onClose,
  onMediaUploaded,
  maxFiles = 6,
  acceptedTypes = 'both'
}: MediaUploadManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ type: 'image' | 'video'; url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const acceptTypes = acceptedTypes === 'images' 
    ? 'image/png,image/jpeg,image/jpg,image/webp'
    : acceptedTypes === 'videos'
    ? 'video/mp4,video/webm,video/mov'
    : 'image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/mov';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Check file limit
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    const newUploadedFiles: typeof uploadedFiles = [];

    for (const file of files) {
      try {
        // Determine file type
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        
        // Check file size (max 50MB for images, 500MB for videos)
        const maxSize = fileType === 'image' ? 50 * 1024 * 1024 : 500 * 1024 * 1024;
        if (file.size > maxSize) {
          setError(`${file.name} is too large. Max size: ${fileType === 'image' ? '50MB' : '500MB'}`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `landing-page-media/${fileName}`;

        // Update progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('public-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('public-media')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          newUploadedFiles.push({
            type: fileType,
            url: urlData.publicUrl,
            name: file.name
          });
          
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        }
      } catch (err) {
        console.error('Upload exception:', err);
        setError(`Failed to upload ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setUploading(false);
  };

  const handleRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onMediaUploaded(uploadedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-navy/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-glass-strong border border-border-cyan rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-2xl mb-2">Upload Media</h2>
            <p className="text-white/60">
              {acceptedTypes === 'images' 
                ? 'Upload screenshots or images'
                : acceptedTypes === 'videos'
                ? 'Upload demo videos'
                : 'Upload images and videos'}
              {' '}({uploadedFiles.length}/{maxFiles} used)
            </p>
          </div>
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-glass border border-border text-white hover:bg-glass-strong transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error text-error">
            {error}
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-6">
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-border-cyan rounded-2xl p-12 text-center hover:bg-glass transition-all">
              <Upload className="w-12 h-12 text-cyan mx-auto mb-4" />
              <p className="text-white mb-2">Click to upload or drag and drop</p>
              <p className="text-white/60 text-sm">
                {acceptedTypes === 'images' 
                  ? 'PNG, JPG, WEBP (max 50MB each)'
                  : acceptedTypes === 'videos'
                  ? 'MP4, WEBM, MOV (max 500MB each)'
                  : 'Images (PNG, JPG) or Videos (MP4, WEBM)'}
              </p>
            </div>
            <input
              type="file"
              accept={acceptTypes}
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || uploadedFiles.length >= maxFiles}
            />
          </label>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white mb-4">Uploaded Files</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative rounded-xl bg-glass border border-border overflow-hidden group"
                >
                  {/* Preview */}
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple/20 to-navy flex items-center justify-center">
                      <Video className="w-12 h-12 text-purple" />
                    </div>
                  )}
                  
                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-white/60 text-xs">{file.type}</p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-6">
            <div className="flex items-center gap-3 text-cyan">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploadedFiles.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-teal text-navy hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Save {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
