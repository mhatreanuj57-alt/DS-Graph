'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import { Book, ChevronRight, Search } from 'lucide-react';

export default function NotesPage() {
  const { lang } = useParams();
  const { data: notes, isLoading } = trpc.getNotesByLanguage.useQuery(lang as string);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes?.find((n) => n.id === selectedNoteId) || notes?.[0];

  return (
    <AppShell>
      <div className="flex-1 flex overflow-hidden bg-bg-base">
        {/* Notes Sidebar */}
        <div className="w-80 border-r border-border-dim bg-bg-surface flex flex-col shrink-0">
          <div className="p-4 border-b border-border-dim space-y-4">
            <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Language Notes</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lo" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full bg-bg-base border border-border-dim rounded-md pl-9 pr-3 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-bg-raised animate-pulse rounded border border-border-dim" />
              ))
            ) : notes?.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group ${
                  selectedNote?.id === note.id
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-transparent text-text-lo hover:bg-bg-raised'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Book size={16} className={selectedNote?.id === note.id ? 'text-accent' : 'text-text-lo'} />
                  <span className="text-xs font-bold truncate">{note.title}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-bg-surface w-1/2 rounded" />
                <div className="h-64 bg-bg-surface w-full rounded" />
              </div>
            ) : selectedNote ? (
              <>
                <h1 className="text-4xl font-bold text-text-hi tracking-tight">{selectedNote.title}</h1>
                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-text-hi prose-p:text-text-lo prose-code:text-accent prose-pre:bg-bg-raised">
                  <div dangerouslySetInnerHTML={{ __html: selectedNote.content }} />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-lo space-y-4">
                <Book size={48} className="opacity-20" />
                <p className="text-sm italic">Select a note to start reading.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
