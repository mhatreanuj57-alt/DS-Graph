'use client';

import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { Menu, Terminal } from 'lucide-react';

export default function Navbar() {
  const { toggleSidebar } = useUIStore();

  return (
    <nav className="h-12 border-b border-border-dim bg-bg-surface flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-bg-raised rounded text-text-lo hover:text-text-hi transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-accent p-1 rounded">
            <Terminal size={16} className="text-bg-base" />
          </div>
          <span className="font-mono font-bold text-text-hi tracking-tight">CODEFORGE</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Auth status will go here */}
        <div className="w-8 h-8 rounded-full bg-bg-raised border border-border-dim" />
      </div>
    </nav>
  );
}
