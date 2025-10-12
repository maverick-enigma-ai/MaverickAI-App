import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio,
  File,
  X,
  Archive,
  Code,
  Download
} from 'lucide-react';

interface MobileFilePreviewProps {
  file: File;
  onRemove: () => void;
  index: number;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return { 
        icon: () => (
          <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PDF</span>
          </div>
        ), 
        color: 'text-red-400', 
        bg: 'bg-red-500/20' 
      };
    case 'doc':
    case 'docx':
      return { 
        icon: () => (
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">DOC</span>
          </div>
        ), 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/20' 
      };
    case 'xls':
    case 'xlsx':
      return { 
        icon: () => (
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">XLS</span>
          </div>
        ), 
        color: 'text-green-400', 
        bg: 'bg-green-500/20' 
      };
    case 'png':
      return { 
        icon: () => (
          <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PNG</span>
          </div>
        ), 
        color: 'text-purple-400', 
        bg: 'bg-purple-500/20' 
      };
    case 'jpg':
    case 'jpeg':
      return { 
        icon: () => (
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">JPG</span>
          </div>
        ), 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/20' 
      };
    case 'txt':
    case 'rtf':
      return { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/20' };
    case 'gif':
    case 'svg':
    case 'webp':
      return { icon: FileImage, color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return { icon: FileVideo, color: 'text-purple-400', bg: 'bg-purple-500/20' };
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return { icon: FileAudio, color: 'text-orange-400', bg: 'bg-orange-500/20' };
    case 'csv':
      return { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'cpp':
      return { icon: Code, color: 'text-indigo-400', bg: 'bg-indigo-500/20' };
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return { icon: Archive, color: 'text-amber-400', bg: 'bg-amber-500/20' };
    default:
      return { icon: File, color: 'text-gray-400', bg: 'bg-gray-500/20' };
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const truncateFileName = (name: string, maxLength: number = 25): string => {
  if (name.length <= maxLength) return name;
  const extension = name.split('.').pop();
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4) + '...';
  return `${truncatedName}.${extension}`;
};

export function MobileFilePreview({ file, onRemove, index }: MobileFilePreviewProps) {
  const fileInfo = getFileIcon(file.name);
  const IconComponent = fileInfo.icon;

  return (
    <div 
      className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      data-name={`file_preview_${index}`}
    >
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <div className={`w-14 h-14 rounded-2xl ${fileInfo.bg} backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10`}>
          {typeof fileInfo.icon === 'function' ? (
            <fileInfo.icon />
          ) : (
            <fileInfo.icon className={`w-7 h-7 ${fileInfo.color}`} />
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            {truncateFileName(file.name)}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {formatFileSize(file.size)}
            </span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              ✓ Ready
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRemove}
            className="w-12 h-12 rounded-xl bg-red-500/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/30 transition-colors border border-red-500/20 min-h-[48px] min-w-[48px]"
            data-name={`btn_remove_${index}`}
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}