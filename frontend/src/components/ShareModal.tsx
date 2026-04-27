import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  shareToken: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, fileName, shareToken }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/share/${shareToken}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#008f26]">
                <Shield className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Sharing</span>
              </div>
              <h3 className="text-3xl font-bold text-[#141414] tracking-tight">Share Document</h3>
              <p className="text-[#737373] font-medium truncate max-w-sm">{fileName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F0F0F0] rounded-full transition-colors text-[#737373]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-[#F0F0F0]/50 rounded-3xl border border-[#F0F0F0] space-y-4">
              <p className="text-xs font-bold text-[#737373] uppercase tracking-widest">Public Access Link</p>
              <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#141414] select-all"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-[#F0F0F0] rounded-xl transition-all text-[#008f26] group-active:scale-95"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[11px] text-[#737373] font-medium leading-relaxed italic">
                Anyone with this link can view and download the document without logging in.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => window.open(shareUrl, '_blank')}
                className="flex-1 btn-pill bg-[#141414] text-white hover:bg-black flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Preview Link
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-pill border-2 border-[#F0F0F0] text-[#141414] hover:bg-[#F0F0F0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
