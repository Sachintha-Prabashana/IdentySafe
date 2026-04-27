import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Sidebar />
      
      <div className="pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        
        <main className="flex-1 mt-16 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>

        <footer className="px-8 py-4 bg-white border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">
            IdentySafe © 2024 • Secured by Asgardeo
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
