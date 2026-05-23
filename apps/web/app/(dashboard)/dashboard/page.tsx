'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/lib/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Flame, BookMarked, Code2, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = trpc.getUserProfile.useQuery(user?.uid || '', {
    enabled: !!user?.uid,
  });

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-bg-base p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-accent overflow-hidden">
                <img src={user?.photoURL || ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-hi">{user?.displayName || 'Builder'}</h1>
                <p className="text-text-lo text-sm">Member since {new Date(user?.metadata.creationTime || '').toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-accent">
                  <Flame size={20} fill="currentColor" />
                  <span className="text-xl font-bold">{profile?.streak || 0}</span>
                </div>
                <span className="text-[10px] text-text-lo uppercase font-bold tracking-widest">Day Streak</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-surface border border-border-dim rounded-xl p-6">
              <div className="flex items-center gap-3 text-text-lo mb-2">
                <BookMarked size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Bookmarks</span>
              </div>
              <div className="text-3xl font-bold text-text-hi">{profile?._count.bookmarks || 0}</div>
            </div>
            <div className="bg-bg-surface border border-border-dim rounded-xl p-6">
              <div className="flex items-center gap-3 text-text-lo mb-2">
                <Code2 size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Submissions</span>
              </div>
              <div className="text-3xl font-bold text-text-hi">{profile?._count.snippets || 0}</div>
            </div>
            <div className="bg-bg-surface border border-border-dim rounded-xl p-6">
              <div className="flex items-center gap-3 text-text-lo mb-2">
                <Clock size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">History</span>
              </div>
              <div className="text-3xl font-bold text-text-hi">12</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-hi">Recent Activity</h2>
            <div className="bg-bg-surface border border-border-dim rounded-xl divide-y divide-border-dim">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-bg-raised/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent/10 p-2 rounded text-accent">
                      <Code2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-hi">Ran "Binary Search Implementation"</h4>
                      <p className="text-xs text-text-lo mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-text-lo hover:text-accent uppercase tracking-widest">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
