import { Plus } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="py-20 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 border-slate-200 text-slate-400">
        <Plus className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Vault Settings</h2>
      <p className="text-slate-500 max-w-md mx-auto font-medium">
        Manage your encryption keys, security preferences, and account settings here. 
        Customize your experience and keep your vault tight.
      </p>
    </div>
  );
};

export default SettingsPage;
