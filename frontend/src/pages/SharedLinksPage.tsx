import { useState } from 'react';
import { Link as LinkIcon, Trash2, Eye, Calendar, Loader2, Globe } from 'lucide-react';
import { useSharedDocuments, useRevokeShare } from '../hooks/useDocuments';
import { useAuthContext } from '@asgardeo/auth-react';
import FileViewerModal from '../components/FileViewerModal';
import type { Document } from '../types/document';

const SharedLinksPage = () => {
    const { state } = useAuthContext();
    const { data: sharedDocs = [], isLoading } = useSharedDocuments(state.isAuthenticated);
    const revokeMutation = useRevokeShare();
    
    const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const handleRevoke = (id: number) => {
        if (window.confirm('Revoking this link will immediately disable public access. Continue?')) {
            revokeMutation.mutate(id);
        }
    };

    const handleView = (doc: Document) => {
        setViewingDoc(doc);
        setIsViewerOpen(true);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#008f26]">
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Public Access Management</span>
                </div>
                <h2 className="text-4xl font-bold text-[#141414] tracking-tight">Shared Links</h2>
                <p className="text-[#737373] text-lg font-medium">Manage your publicly accessible documents and their security status.</p>
            </div>

            <div className="card-evernote overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4 text-[#737373]">
                        <Loader2 className="w-10 h-10 animate-spin text-[#008f26]" />
                        <p className="font-bold uppercase tracking-widest text-xs">Syncing shared links...</p>
                    </div>
                ) : sharedDocs.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F0F0F0]/30 border-b border-gray-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Document Name</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Link Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Expiration</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sharedDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-[#F0F0F0]/20 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-[#141414]">{doc.fileName}</p>
                                            <div className="flex items-center gap-2 text-[#737373] text-xs font-medium bg-[#F0F0F0] w-fit px-2 py-1 rounded-md">
                                                <LinkIcon className="w-3 h-3" />
                                                <span className="truncate max-w-[200px]">.../share/{doc.shareToken?.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-[#008f26]/10 text-[#008f26] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#008f26]/10">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[#737373] text-sm font-medium">
                                            <Calendar className="w-4 h-4" />
                                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'No expiry'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => handleView(doc)}
                                                className="btn-pill px-4 py-2 bg-white border border-[#F0F0F0] text-[#141414] hover:bg-[#F0F0F0] text-xs flex items-center gap-2"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>
                                            <button 
                                                onClick={() => handleRevoke(doc.id)}
                                                disabled={revokeMutation.isPending}
                                                className="btn-pill px-4 py-2 bg-[#F0F0F0] text-red-500 hover:bg-red-50 text-xs flex items-center gap-2"
                                            >
                                                {revokeMutation.isPending && revokeMutation.variables === doc.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                )}
                                                Revoke
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-20 space-y-6">
                        <div className="bg-[#F0F0F0] w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <LinkIcon className="w-10 h-10 text-[#737373]" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[#141414] text-xl font-bold">No active shared links</p>
                            <p className="text-[#737373] text-sm max-w-xs mx-auto font-medium">Generate public links from your vault to share documents securely.</p>
                        </div>
                    </div>
                )}
            </div>

            {viewingDoc && (
                <FileViewerModal
                    isOpen={isViewerOpen}
                    onClose={() => setIsViewerOpen(false)}
                    fileName={viewingDoc.fileName}
                    fileUrl={viewingDoc.fileUrl}
                    fileType={viewingDoc.fileType}
                />
            )}
        </div>
    );
};

export default SharedLinksPage;
