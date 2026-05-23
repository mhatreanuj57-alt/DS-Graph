'use client';

import React from 'react';

interface OutputPanelProps {
  output?: string;
  error?: string;
  executionTime?: string;
  memory?: number;
  status?: string;
}

export default function OutputPanel({ output, error, executionTime, memory, status }: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-bg-base">
      <div className="h-8 border-y border-border-dim bg-bg-surface flex items-center px-3 justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest">Output</span>
          {status && (
            <span className={`text-[10px] font-bold uppercase ${
              status === 'success' ? 'text-success' : 'text-error'
            }`}>
              {status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {executionTime && (
            <span className="text-[10px] text-text-lo font-mono">{executionTime}ms</span>
          )}
          {memory && (
            <span className="text-[10px] text-text-lo font-mono">{Math.round(memory / 1024)}KB</span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {error ? (
          <pre className="text-error whitespace-pre-wrap">{error}</pre>
        ) : output ? (
          <pre className="text-text-hi whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-text-lo italic">Run your code to see the output here...</span>
        )}
      </div>
    </div>
  );
}
