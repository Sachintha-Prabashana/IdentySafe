import React from 'react';
import { ShieldCheck, Settings, Share2, LogOut } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { signOut } = useAuthContext();

  const menuItems = [
    { id: 'vault', label: 'My Vault', icon: ShieldCheck, path: '/vault' },
    { id: 'shared', label: 'Shared Links', icon: Share2, path: '/shared' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-30 shadow-sm">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-[#008f26] p-1 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#141414]">IdentySafe</h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-[#F0F0F0] text-[#141414]' 
                : 'text-[#737373] hover:text-[#141414] hover:bg-[#F0F0F0]/50'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#008f26]' : 'group-hover:text-[#008f26]'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-[#008f26] rounded-full"></div>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#737373] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
