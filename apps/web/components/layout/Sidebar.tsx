'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { trpc } from '@/lib/trpc';
import { Code2, Hash, FileJson, Coffee, Globe, Database, Cpu, Layers } from 'lucide-react';

const iconMap: Record<string, any> = {
  javascript: Code2,
  typescript: Code2,
  python: Hash,
  rust: FileJson,
  java: Coffee,
  html: Globe,
  css: Layers,
  sql: Database,
  cpp: Cpu,
  c: Cpu,
  // ... add more icons as needed
};

export default function Sidebar() {
  const { languageId, setLanguageId } = useEditorStore();
  const { data: languages, isLoading } = trpc.getLanguages.useQuery();

  return (
    <aside className="w-60 border-r border-border-dim bg-bg-surface flex flex-col">
      <div className="p-4 border-b border-border-dim">
        <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Languages</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <div className="px-4 py-2 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-bg-raised animate-pulse rounded" />
            ))}
          </div>
        ) : (
          languages?.map((lang) => {
            const Icon = iconMap[lang.slug] || Code2;
            return (
              <button
                key={lang.id}
                onClick={() => setLanguageId(lang.slug)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  languageId === lang.slug 
                    ? 'bg-bg-raised text-accent border-r-2 border-accent' 
                    : 'text-text-lo hover:bg-bg-raised hover:text-text-hi'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{lang.name}</span>
                </div>
                <span className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded border border-border-dim text-text-lo">
                  {lang._count.snippets}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
