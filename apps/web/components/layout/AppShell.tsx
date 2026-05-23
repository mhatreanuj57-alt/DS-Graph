'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useUIStore } from '@/store/uiStore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
