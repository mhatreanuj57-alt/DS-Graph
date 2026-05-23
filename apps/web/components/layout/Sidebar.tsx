'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Code2, Hash, FileJson, Coffee } from 'lucide-react';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: Code2, count: 120 },
  { id: 'typescript', name: 'TypeScript', icon: Code2, count: 85 },
  { id: 'python', name: 'Python', icon: Hash, count: 150 },
  { id: 'rust', name: 'Rust', icon: FileJson, count: 42 },
  { id: 'java', name: 'Java', icon: Coffee, count: 64 },
];

export default function Sidebar() {
  const { languageId, setLanguageId } = useEditorStore();

  return (
    <aside className="w-60 border-r border-border-dim bg-bg-surface flex flex-col">
      <div className="p-4 border-b border-border-dim">
        <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Languages</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguageId(lang.id)}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
              languageId === lang.id 
                ? 'bg-bg-raised text-accent border-r-2 border-accent' 
                : 'text-text-lo hover:bg-bg-raised hover:text-text-hi'
            }`}
          >
            <div className="flex items-center gap-3">
              <lang.icon size={16} />
              <span>{lang.name}</span>
            </div>
            <span className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded border border-border-dim text-text-lo">
              {lang.count}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
