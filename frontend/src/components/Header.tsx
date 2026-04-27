import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";

const Header: React.FC = () => {
  const { state } = useAuthContext();

  return (
    <header className="h-20 bg-white border-b border-gray-100 shadow-sm fixed top-0 right-0 left-72 z-20 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] group-focus-within:text-[#008f26] transition-colors" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-12 pr-4 py-3 bg-[#F0F0F0] border-transparent rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#008f26]/20 focus:border-[#008f26] transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 text-[#737373] hover:text-[#141414] hover:bg-[#F0F0F0] rounded-full transition-all relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#008f26] rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#141414] tracking-tight">{state.username || state.email}</p>
            <p className="text-[10px] text-[#737373] font-bold uppercase tracking-widest group-hover:text-[#008f26] transition-colors">Standard Vault</p>
          </div>
          <div className="bg-[#F0F0F0] p-2 rounded-full border border-gray-100 group-hover:border-[#008f26]/30 transition-all">
            <User className="w-5 h-5 text-[#737373] group-hover:text-[#008f26]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
