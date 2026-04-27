import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, Shield, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { usePublicDocument } from '../hooks/useDocuments';
import { documentService } from '../service/documentService';
import FileViewerModal from '../components/FileViewerModal';

const PublicViewPage = () => {
    const { token } = useParams<{ token: string }>();
    const { data: doc, isLoading, error } = usePublicDocument(token);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-10">
                <div className="space-y-6 text-center animate-pulse">
                    <div className="bg-[#008f26]/10 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto">
                        <Shield className="w-10 h-10 text-[#008f26]" />
                    </div>
                    <div className="space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-[#008f26] mx-auto" />
                        <p className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">Verifying Secure Link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !doc) {
        return (
            <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-10">
                <div className="max-w-md w-full card-evernote p-12 text-center space-y-8">
                    <div className="bg-red-50 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-[#141414] tracking-tight">Access Denied</h2>
                        <p className="text-[#737373] font-medium leading-relaxed">
                            This shared link is invalid, revoked, or has expired. Please contact the owner for a new link.
                        </p>
                    </div>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="btn-pill w-full bg-[#141414] text-white hover:bg-black transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-6 sm:p-10">
            <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-[#008f26]/10 p-4 rounded-[28px]">
                        <Shield className="w-8 h-8 text-[#008f26]" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[#008f26] uppercase tracking-[0.3em]">IdentySafe Secure Transfer</p>
                        <h1 className="text-4xl font-bold text-[#141414] tracking-tight">Shared Document</h1>
                    </div>
                </div>

                <div className="card-evernote overflow-hidden bg-white shadow-2xl shadow-gray-200/50">
                    <div className="p-10 sm:p-14 space-y-10">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-24 h-24 bg-[#FBFBFB] rounded-[36px] flex items-center justify-center border border-gray-100 shadow-inner">
                                <FileText className="w-12 h-12 text-[#737373]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-[#141414] tracking-tight break-all">
                                    {doc.fileName}
                                </h3>
                                <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest bg-[#F0F0F0] px-3 py-1 rounded-full w-fit mx-auto">
                                    {(doc.fileType?.split('/')[1] || 'FILE').toUpperCase()}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setIsViewerOpen(true)}
                                className="btn-pill flex items-center justify-center gap-2 bg-[#141414] text-white hover:bg-black transition-all shadow-lg shadow-black/10 h-14"
                            >
                                <Eye className="w-5 h-5" />
                                <span className="font-bold">Preview File</span>
                            </button>
                            <button
                                onClick={() => documentService.downloadFile(doc.fileUrl, doc.fileName)}
                                className="btn-pill flex items-center justify-center gap-2 bg-[#008f26] text-white hover:bg-[#00731f] transition-all shadow-lg shadow-[#008f26]/10 h-14"
                            >
                                <Download className="w-5 h-5" />
                                <span className="font-bold">Download</span>
                            </button>
                        </div>

                        <div className="bg-[#FBFBFB] p-6 rounded-3xl border border-gray-100 flex items-start gap-4">
                            <Shield className="w-5 h-5 text-[#008f26] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-[#141414] uppercase tracking-wider">End-to-End Encryption</p>
                                <p className="text-xs text-[#737373] font-medium leading-relaxed">
                                    This file was shared securely via IdentySafe. Access is controlled by the owner and may be revoked at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[#737373] text-sm font-medium">
                    Powered by <span className="font-bold text-[#141414]">IdentySafe</span>
                </p>
            </div>

            <FileViewerModal
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                fileName={doc.fileName}
                fileUrl={doc.fileUrl}
                fileType={doc.fileType}
            />
        </div>
    );
};

export default PublicViewPage;
