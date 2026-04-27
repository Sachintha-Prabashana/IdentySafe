import { useAuthContext } from "@asgardeo/auth-react";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const LoginPage = () => {
    const { signIn } = useAuthContext();

    return (
        <div className="min-h-screen bg-[#F4EEE5] flex flex-col font-sans">
            {/* Header / Nav */}
            <nav className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-[#008f26] p-1.5 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#141414]">IdentySafe</span>
                </div>
                <div className="hidden sm:flex items-center gap-8 text-sm font-semibold text-[#737373]">
                    <a href="#" className="hover:text-[#141414]">Features</a>
                    <a href="#" className="hover:text-[#141414]">Security</a>
                    <a href="#" className="hover:text-[#141414]">About</a>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto space-y-12">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl sm:text-7xl font-bold text-[#141414] leading-[1.1] tracking-tight">
                        Your identification. <br />
                        <span className="text-[#008f26]">Safeguarded forever.</span>
                    </h1>
                    <p className="text-xl text-[#737373] max-w-2xl mx-auto leading-relaxed">
                        IdentySafe is the digital vault for your most vital documents. Secure, encrypted, and accessible from anywhere in the world.
                    </p>
                </div>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <button
                        onClick={() => signIn()}
                        className="btn-pill bg-[#141414] text-white hover:bg-black flex items-center gap-3 text-lg shadow-xl shadow-black/10 group"
                    >
                        Access your vault
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        {[
                            "Zero-trust encryption",
                            "Asgardeo identity cloud",
                            "Global availability"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-semibold text-[#737373]">
                                <CheckCircle2 className="w-4 h-4 text-[#008f26]" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full pt-12 animate-in fade-in zoom-in-95 duration-1000 delay-500">
                   <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-black/5 border border-white/50 max-w-2xl mx-auto">
                        <div className="bg-[#F0F0F0] rounded-2xl h-80 flex items-center justify-center overflow-hidden">
                             {/* Simplistic Illustration / Logo Placeholder */}
                             <div className="bg-white p-8 rounded-full shadow-lg scale-150">
                                <ShieldCheck className="w-12 h-12 text-[#008f26]" />
                             </div>
                        </div>
                   </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-8 py-12 text-center text-xs font-bold text-[#737373] uppercase tracking-[0.2em] border-t border-black/5">
                IdentySafe Digital Vault • Secured by WSO2 Asgardeo
            </footer>
        </div>
    );
};

export default LoginPage;
