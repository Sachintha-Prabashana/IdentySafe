import { X, Download, Shield, FileText, Maximize2, ExternalLink } from 'lucide-react';
import { documentService } from '../service/documentService';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ isOpen, onClose, fileName, fileUrl, fileType }) => {
  if (!isOpen) return null;

  const isImage = fileType.toLowerCase().startsWith('image/');
  const isPdf = fileType.toLowerCase().includes('pdf') || fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141414]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 m-4">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-[#008f26]/10 p-2.5 rounded-2xl">
              <Shield className="w-6 h-6 text-[#008f26]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-[#141414] text-lg tracking-tight truncate max-w-md">{fileName}</h3>
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Secure Preview
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="p-3 hover:bg-[#F0F0F0] rounded-2xl transition-all text-[#737373] hover:text-[#141414]"
              title="Open in new tab"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => documentService.downloadFile(fileUrl, fileName)}
              className="p-3 hover:bg-[#F0F0F0] rounded-2xl transition-all text-[#737373] hover:text-[#008f26]"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-gray-100 mx-2" />
            <button
              onClick={onClose}
              className="p-3 hover:bg-red-50 rounded-2xl transition-all text-[#737373] hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#737373]/10 overflow-auto flex items-center justify-center p-4 sm:p-12 relative group">
          {isImage ? (
            <img 
              src={fileUrl} 
              alt={fileName} 
              className="max-w-full max-h-full object-contain rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-700"
            />
          ) : isPdf ? (
            <div className="w-full h-full relative group/viewer">
              <iframe
                src={`${fileUrl}#view=FitH`}
                className="w-full h-full rounded-xl border border-gray-200 shadow-sm bg-white"
                title={fileName}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover/viewer:opacity-100 transition-opacity">
                 <button 
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-black transition-colors"
                 >
                   <ExternalLink className="w-4 h-4" />
                   Open Original
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 max-w-sm p-12 card-evernote">
              <div className="bg-[#F0F0F0] w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-[#737373]" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#141414]">No Preview Available</p>
                <p className="text-[#737373] text-sm font-medium">This file type cannot be previewed directly in the browser.</p>
              </div>
              <button
                onClick={() => documentService.downloadFile(fileUrl, fileName)}
                className="btn-pill w-full bg-[#141414] text-white hover:bg-black flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download to View
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-center justify-center shrink-0">
          <p className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.3em]">
            End-to-End Secure Preview by IdentySafe
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
