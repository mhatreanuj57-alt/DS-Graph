'use client';

import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { Menu, Terminal, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();

  return (
    <nav className="h-12 border-b border-border-dim bg-bg-surface flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-bg-raised rounded text-text-lo hover:text-text-hi transition-colors"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-accent p-1 rounded">
            <Terminal size={16} className="text-bg-base" />
          </div>
          <span className="font-mono font-bold text-text-hi tracking-tight">CODEFORGE</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-8 h-8 rounded-full overflow-hidden border border-border-dim hover:border-accent transition-colors">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-bg-raised flex items-center justify-center text-text-lo">
                  <UserIcon size={16} />
                </div>
              )}
            </Link>
            <button 
              onClick={() => logout()}
              className="p-1.5 text-text-lo hover:text-error hover:bg-error/10 rounded transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-xs font-bold text-bg-base bg-accent px-4 py-1.5 rounded hover:brightness-110 transition-all"
          >
            SIGN IN
          </Link>
        )}
      </div>
    </nav>
  );
}
