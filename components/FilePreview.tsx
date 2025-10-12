import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio,
  File,
  X,
  Archive,
  Code
} from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'pdf':
      return <File className="w-[12px] h-[12px] text-red-500" />;
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
      return <FileText className="w-[12px] h-[12px] text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return <FileImage className="w-[12px] h-[12px] text-green-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return <FileVideo className="w-[12px] h-[12px] text-purple-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <FileAudio className="w-[12px] h-[12px] text-orange-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileText className="w-[12px] h-[12px] text-emerald-500" />;
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'cpp':
      return <Code className="w-[12px] h-[12px] text-indigo-500" />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <Archive className="w-[12px] h-[12px] text-amber-500" />;
    default:
      return <File className="w-[12px] h-[12px] text-gray-500" />;
  }
};

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const truncateFileName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4) + '...';
    return `${truncatedName}.${extension}`;
  };

  return (
    <div className="relative backdrop-blur-[14px] backdrop-filter bg-[rgba(255,255,255,0.08)] box-border content-stretch flex gap-[12px] items-center p-[8px] rounded-[18px] w-[120px]" data-name="File Preview">
      <div aria-hidden="true" className="absolute border border-[#5eceff] border-solid inset-[-1px] pointer-events-none rounded-[19px] shadow-[0px_10px_28px_0px_rgba(43,192,255,0.18)]" />
      <div className="shrink-0 w-[12px] h-[12px] flex items-center justify-center" data-name="File Type Icon">
        {getFileIcon(file.name)}
      </div>
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#eaf4ff] text-[9px] text-nowrap whitespace-pre flex-1 overflow-hidden">
        {truncateFileName(file.name, 10)}
      </p>
      <button 
        onClick={onRemove}
        className="font-['Inter:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[10px] text-[rgba(255,255,255,0.6)] text-nowrap whitespace-pre hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}