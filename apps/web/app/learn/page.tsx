'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MonacoEditor from '@/components/editor/MonacoEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import OutputPanel from '@/components/editor/OutputPanel';
import { useEditorStore } from '@/store/editorStore';
import { useExecution } from '@/lib/hooks/useExecution';

export default function LearnPage() {
  const { code, languageId, setCode } = useEditorStore();
  const { executeCode, isRunning, result } = useExecution();

  const handleRun = () => {
    executeCode(languageId, code);
  };

  const handleReset = () => {
    // In a real app, this would reset to the original snippet code
    setCode('// Reset to original snippet\nconsole.log("Hello, CodeForge!");');
  };

  return (
    <AppShell>
      <div className="flex-1 flex overflow-hidden">
        {/* Mid Panel: Snippet List (Simplified for MVP) */}
        <div className="w-80 border-r border-border-dim bg-bg-surface flex flex-col">
          <div className="p-4 border-b border-border-dim">
            <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Snippets</h2>
          </div>
          <div className="p-4">
            <div className="p-3 rounded bg-bg-raised border border-accent/20 border-l-2 border-l-accent cursor-pointer group">
              <h3 className="text-sm font-bold text-text-hi group-hover:text-accent transition-colors">Hello World</h3>
              <p className="text-xs text-text-lo mt-1 line-clamp-2">The classic entry point for any programming language.</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded text-text-lo border border-border-dim">Beginner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor + Output */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorToolbar onRun={handleRun} onReset={handleReset} isRunning={isRunning} />
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 border-b border-border-dim">
              <MonacoEditor />
            </div>
            <div className="h-1/3 min-h-[150px]">
              <OutputPanel 
                output={result?.stdout} 
                error={result?.stderr || result?.compile_output}
                executionTime={result?.time}
                memory={result?.memory}
                status={result?.status?.description}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
