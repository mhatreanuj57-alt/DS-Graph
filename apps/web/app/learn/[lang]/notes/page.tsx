'use client';

import React, { startTransition, useDeferredValue, useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { renderMarkdown } from '@/lib/renderMarkdown';
import { Book, ChevronRight, Code2, Search, Sparkles } from 'lucide-react';

export default function NotesPage() {
  const { lang } = useParams();
  const { data: notes, isLoading } = trpc.getNotesByLanguage.useQuery(lang as string);
  const { data: snippets } = trpc.getSnippets.useQuery({
    languageSlug: lang as string,
  });
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredNotes = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!notes) return [];
    if (!query) return notes;

    return notes.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(query),
    );
  }, [deferredSearch, notes]);

  const selectedNote = filteredNotes.find((n) => n.id === selectedNoteId) || filteredNotes[0];
  const renderedContent = selectedNote ? renderMarkdown(selectedNote.content) : '';

  const relatedSnippets = useMemo(() => {
    if (!selectedNote || !snippets) return [];

    const tokens = Array.from(
      new Set(
        selectedNote.title
          .toLowerCase()
          .split(/[^a-z0-9+#.]+/)
          .filter((token) => token.length > 2),
      ),
    );

    return snippets
      .map((snippet) => {
        const haystack = `${snippet.title} ${snippet.description || ''} ${snippet.category || ''} ${(snippet.tags || [])
          .map((tag) => tag.name || tag)
          .join(' ')}`.toLowerCase();

        const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
        return { snippet, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.snippet.views - a.snippet.views)
      .slice(0, 4)
      .map((entry) => entry.snippet);
  }, [selectedNote, snippets]);

  return (
    <AppShell>
      <div className="flex-1 flex overflow-hidden bg-bg-base">
        <div className="w-80 border-r border-border-dim bg-bg-surface flex flex-col shrink-0">
          <div className="p-4 border-b border-border-dim space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Language Notes</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-lo">
                {filteredNotes.length} Items
              </span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lo" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  startTransition(() => {
                    setSearch(nextSearch);
                  });
                }}
                className="w-full bg-bg-base border border-border-dim rounded-md pl-9 pr-3 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-bg-raised animate-pulse rounded border border-border-dim" />
              ))
            ) : filteredNotes.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-text-lo">
                No notes match your search.
              </div>
            ) : filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => startTransition(() => setSelectedNoteId(note.id))}
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

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-bg-surface w-1/2 rounded" />
                <div className="h-64 bg-bg-surface w-full rounded" />
              </div>
            ) : selectedNote ? (
              <div className="contents">
                <div className="space-y-8">
                  <div className="space-y-4 border-b border-border-dim pb-6">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-lo">
                      <span className="rounded-full border border-border-dim px-2 py-1">{String(lang)} note</span>
                      <span>{selectedNote.title.length} title chars</span>
                    </div>
                    <h1 className="text-4xl font-bold text-text-hi tracking-tight">{selectedNote.title}</h1>
                  </div>
                  <div className="prose prose-invert prose-lg max-w-none prose-headings:text-text-hi prose-p:text-text-lo prose-li:text-text-lo prose-strong:text-text-hi prose-code:text-accent prose-pre:bg-bg-raised prose-pre:border prose-pre:border-border-dim">
                    <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
                  </div>
                </div>
                <aside className="space-y-4">
                  <div className="rounded-2xl border border-border-dim bg-bg-surface p-5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-lo">
                      <Sparkles size={14} />
                      Related Snippets
                    </div>
                    <div className="mt-4 space-y-3">
                      {relatedSnippets.length === 0 ? (
                        <p className="text-xs leading-relaxed text-text-lo">
                          No strong snippet matches yet for this note title.
                        </p>
                      ) : (
                        relatedSnippets.map((snippet) => (
                          <Link
                            key={snippet.id}
                            href={`/snippet/${snippet.id}`}
                            className="block rounded-xl border border-border-dim bg-bg-raised p-3 transition-colors hover:border-accent/40"
                          >
                            <div className="flex items-start gap-3">
                              <Code2 size={16} className="mt-0.5 text-accent" />
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-text-hi">{snippet.title}</h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-lo">
                                  {snippet.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border-dim bg-bg-surface p-5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-lo">
                      <Book size={14} />
                      Reading Stats
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-text-lo">
                      <div className="flex items-center justify-between">
                        <span>Visible notes</span>
                        <span className="font-bold text-text-hi">{filteredNotes.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Snippet matches</span>
                        <span className="font-bold text-text-hi">{relatedSnippets.length}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="col-span-full flex h-full min-h-[50vh] flex-col items-center justify-center space-y-4 text-text-lo">
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
