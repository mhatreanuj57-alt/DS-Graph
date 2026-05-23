'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import MonacoEditor from '@/components/editor/MonacoEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import OutputPanel from '@/components/editor/OutputPanel';
import SnippetList from '@/components/snippet/SnippetList';
import ExplainPanel from '@/components/ai/ExplainPanel';
import { useEditorStore } from '@/store/editorStore';
import { useExecution } from '@/lib/hooks/useExecution';

export default function LearnPage() {
  const { code, languageId, setCode } = useEditorStore();
  const { executeCode, isRunning, result } = useExecution();
  const [showExplain, setShowExplain] = useState(false);

  const handleRun = () => {
    executeCode(languageId, code);
  };

  const handleReset = () => {
    setCode('// Reset to original snippet\nconsole.log("Hello, CodeForge!");');
  };

  return (
    <AppShell>
      <div className="flex-1 flex overflow-hidden relative">
        <SnippetList />

        {/* Right Panel: Editor + Output */}
        <div className="flex-1 flex flex-col min-w-0">
          <EditorToolbar 
            onRun={handleRun} 
            onReset={handleReset} 
            onToggleExplain={() => setShowExplain(!showExplain)}
            isRunning={isRunning} 
          />
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

        {showExplain && (
          <ExplainPanel 
            code={code} 
            language={languageId} 
            onClose={() => setShowExplain(false)} 
          />
        )}
      </div>
    </AppShell>
  );
}
