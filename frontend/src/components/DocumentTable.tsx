import React, { useState } from 'react';
import { FileText, Download, Trash2, Eye, Share2, Loader2 } from 'lucide-react';
import type { Document } from '../types/document';
import { useDeleteDocument, useShareDocument } from '../hooks/useDocuments';
import { documentService } from '../service/documentService';
import ShareModal from './ShareModal';
import FileViewerModal from './FileViewerModal';

interface DocumentTableProps {
  documents: Document[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  const deleteMutation = useDeleteDocument();
  const shareMutation = useShareDocument();
  
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this document?')) {
        deleteMutation.mutate(id);
    }
  };

  const handleShare = async (id: number) => {
    shareMutation.mutate(id, {
      onSuccess: (data) => {
        setSelectedDoc(data);
        setIsShareModalOpen(true);
      }
    });
  };

  const handleView = (doc: Document) => {
    setViewingDoc(doc);
    setIsViewerOpen(true);
  };

  const handleDownload = async (doc: Document) => {
    try {
      await documentService.downloadFile(doc.fileUrl, doc.fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F0F0F0]/30 border-b border-gray-100">
            <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Name</th>
            <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Security</th>
            <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Modified</th>
            <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-[#F0F0F0]/20 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center text-[#737373] group-hover:bg-white group-hover:text-[#008f26] transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-[#141414]">{doc.fileName}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#008f26]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#008f26]">
                    Secure vault
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="text-sm font-medium text-[#737373]">
                  {new Date(doc.uploadedAt).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                  })}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button 
                    title="View" 
                    onClick={() => handleView(doc)}
                    className="p-2 text-[#737373] hover:text-[#141414] hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    title="Share" 
                    onClick={() => handleShare(doc.id)}
                    disabled={shareMutation.isPending}
                    className="p-2 text-[#737373] hover:text-[#008f26] hover:bg-white rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {shareMutation.isPending && shareMutation.variables === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    title="Download" 
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-[#737373] hover:text-[#008f26] hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    title="Delete" 
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-[#737373] hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDoc && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          fileName={selectedDoc.fileName}
          shareToken={selectedDoc.shareToken!}
        />
      )}

      {viewingDoc && (
        <FileViewerModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          fileName={viewingDoc.fileName}
          fileUrl={viewingDoc.fileUrl}
          fileType={viewingDoc.fileType}
        />
      )}
    </>
  );
};

export default DocumentTable;
