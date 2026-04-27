import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { useUploadDocument } from '../hooks/useDocuments';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /**
   * mutation handles the API call and cache invalidation.
   * onClose is called automatically on success via the hook.
   */
  const uploadMutation = useUploadDocument(() => {
    setFile(null);
    onClose();
  });

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
        uploadMutation.mutate(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141414]/20 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
           <h2 className="text-xl font-bold text-[#141414] tracking-tight">Upload document</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F0F0F0] rounded-full transition-all text-[#737373] hover:text-[#141414]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group h-64 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 text-center ${
              dragActive 
                ? 'border-[#008f26] bg-[#008f26]/5' 
                : 'border-gray-200 hover:border-[#008f26]/40 hover:bg-[#F0F0F0]/30'
            }`}
          >
            {file ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div className="bg-[#008f26]/10 p-4 rounded-full inline-block">
                    <CheckCircle2 className="w-8 h-8 text-[#008f26]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#141414]">{file.name}</p>
                  <p className="text-xs font-semibold text-[#737373]">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to secure</p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-xs font-bold text-[#008f26] hover:underline"
                >
                  Replace file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#F0F0F0] p-4 rounded-full inline-block group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-[#737373]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#141414]">Click or drag file to this area to upload</p>
                  <p className="text-sm font-medium text-[#737373]">PDF, JPG, PNG or DOCX (max. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F0F0F0]/50 rounded-xl border border-gray-100">
            <Shield className="w-5 h-5 text-[#008f26]" />
            <p className="text-xs font-semibold text-[#737373]">
                Documents are encrypted using industry-standard protocols before being stored in your private vault.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button 
              onClick={onClose}
              disabled={uploadMutation.isPending}
              className="px-6 py-2.5 text-sm font-bold text-[#737373] hover:text-[#141414] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
              className={`btn-pill text-white shadow-lg flex items-center gap-2 ${
                file ? 'bg-[#008f26] hover:bg-[#00731f] shadow-[#008f26]/10' : 'bg-gray-300 cursor-not-allowed'
              } disabled:opacity-70`}
            >
              {uploadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploadMutation.isPending ? 'Securing...' : 'Secure in vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
