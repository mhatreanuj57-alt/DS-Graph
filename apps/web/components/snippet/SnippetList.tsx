'use client';

import React from 'react';
import { trpc } from '@/lib/trpc';
import { useEditorStore } from '@/store/editorStore';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SnippetList() {
  const { languageId, setCode } = useEditorStore();
  const [search, setSearch] = React.useState('');
  
  const { data: snippets, isLoading } = trpc.getSnippets.useQuery({
    languageSlug: languageId,
    search: search || undefined,
  });

  return (
    <div className="w-80 border-r border-border-dim bg-bg-surface flex flex-col">
      <div className="p-4 border-b border-border-dim space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Snippets</h2>
          <button className="text-text-lo hover:text-text-hi transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lo" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-base border border-border-dim rounded-md pl-9 pr-3 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-bg-raised animate-pulse rounded border border-border-dim" />
          ))
        ) : snippets?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-text-lo">No snippets found.</p>
          </div>
        ) : (
          snippets?.map((snippet) => (
            <div
              key={snippet.id}
              onClick={() => setCode(snippet.code)}
              className="p-3 rounded bg-bg-raised border border-border-dim hover:border-accent/40 cursor-pointer group transition-all"
            >
              <h3 className="text-sm font-bold text-text-hi group-hover:text-accent transition-colors truncate">
                {snippet.title}
              </h3>
              <p className="text-xs text-text-lo mt-1 line-clamp-2 leading-relaxed">
                {snippet.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  snippet.difficulty === 1 ? 'border-success/30 text-success bg-success/5' :
                  snippet.difficulty === 2 ? 'border-warning/30 text-warning bg-warning/5' :
                  'border-error/30 text-error bg-error/5'
                }`}>
                  {snippet.difficulty === 1 ? 'Beginner' : snippet.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                </span>
                <span className="text-[10px] text-text-lo">{snippet.views} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
