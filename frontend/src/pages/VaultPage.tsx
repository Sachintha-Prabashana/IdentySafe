import { useState } from "react";
import { Plus, ShieldCheck, Activity, Database, Link as LinkIcon, Loader2 } from "lucide-react";
import { useAuthContext } from "@asgardeo/auth-react";
import DocumentTable from "../components/DocumentTable";
import UploadModal from "../components/UploadModal";
import { useDocuments } from "../hooks/useDocuments";

const VaultPage = () => {
    const { state } = useAuthContext();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    /**
     * Using React Query hook instead of manual useEffect + axios.
     * Only enable the query when the user is authenticated to prevent 401 errors.
     */
    const { data: documents = [], isLoading, refetch, isFetching } = useDocuments(state.isAuthenticated);

    const sharedLinksCount = documents.filter(doc => !!doc.shareToken).length;

    const stats = [
        { label: 'Vault Items', value: documents.length.toString(), icon: Database, color: 'text-[#008f26]' },
        { label: 'Security Health', value: 'Excellent', icon: ShieldCheck, color: 'text-[#008f26]' },
        { label: 'Public Links', value: `${sharedLinksCount} Active`, icon: LinkIcon, color: 'text-[#008f26]' }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-[#141414] tracking-tight">
                        Welcome, {state.username || state.email}
                    </h2>
                    <p className="text-[#737373] text-lg font-medium">Your digital vault is secured and up to date.</p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-pill bg-[#008f26] text-white hover:bg-[#00731f] flex items-center gap-2 shadow-lg shadow-[#008f26]/10"
                >
                    <Plus className="w-5 h-5" />
                    Upload document
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="card-evernote p-8 space-y-6 group cursor-default hover:border-[#008f26]/20 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="bg-[#F0F0F0] p-3 rounded-2xl group-hover:bg-[#008f26]/10 transition-colors">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <Activity className="w-4 h-4 text-[#F0F0F0] group-hover:text-[#008f26]/20 transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#141414] mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-bold text-[#141414] tracking-tight">All Documents</h3>
                    <button 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="text-sm font-bold text-[#737373] hover:text-[#141414] transition-colors uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-[#008f26]/30 disabled:opacity-50"
                    >
                        {isFetching ? 'Syncing...' : 'Refresh list'}
                    </button>
                </div>
                
                <div className="card-evernote overflow-hidden min-h-[300px] flex flex-col items-center justify-center relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4 text-[#737373]">
                            <Loader2 className="w-10 h-10 animate-spin text-[#008f26]" />
                            <p className="font-bold uppercase tracking-widest text-xs">Accessing Secure Vault...</p>
                        </div>
                    ) : documents.length > 0 ? (
                        <DocumentTable documents={documents} />
                    ) : (
                        <div className="text-center p-20 space-y-4">
                            <div className="bg-[#F0F0F0] w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Database className="w-8 h-8 text-[#737373]" />
                            </div>
                            <p className="text-[#141414] font-bold">No documents found</p>
                            <p className="text-[#737373] text-sm max-w-xs mx-auto">Your vault is empty. Use the upload button to secure your first document.</p>
                        </div>
                    )}
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default VaultPage;
