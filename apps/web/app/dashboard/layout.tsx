/**
 * Dashboard Layout - Yetkili panel duzeni.
 * Sidebar navigasyonu iceren temiz layout.
 */
'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white h-full overflow-y-auto">
          <div className="p-4">
            <DashboardNav />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <span className="font-semibold text-lg">Menü</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1">
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <DashboardNav />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center p-4 border-b border-slate-200 bg-white">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <span className="ml-3 font-semibold text-slate-800">Yönetim Paneli</span>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
