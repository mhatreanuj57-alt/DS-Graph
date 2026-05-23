'use client';

import React from 'react';
import { Play, RotateCcw, Copy, Settings, Sparkles } from 'lucide-react';

interface EditorToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onToggleExplain: () => void;
  isRunning: boolean;
}

export default function EditorToolbar({ onRun, onReset, onToggleExplain, isRunning }: EditorToolbarProps) {
  return (
    <div className="h-10 border-b border-border-dim bg-bg-surface flex items-center px-2 justify-between">
      <div className="flex items-center gap-1">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
            isRunning 
              ? 'bg-bg-raised text-text-lo cursor-not-allowed' 
              : 'bg-accent text-bg-base hover:brightness-110 active:scale-95'
          }`}
        >
          <Play size={14} fill="currentColor" />
          {isRunning ? 'RUNNING...' : 'RUN'}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-text-lo hover:bg-bg-raised hover:text-text-hi transition-colors"
        >
          <RotateCcw size={14} />
          RESET
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={onToggleExplain}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-accent hover:bg-accent/10 transition-colors"
        >
          <Sparkles size={14} />
          EXPLAIN
        </button>
        <button className="p-1.5 text-text-lo hover:bg-bg-raised hover:text-text-hi rounded transition-colors">
          <Copy size={16} />
        </button>
        <button className="p-1.5 text-text-lo hover:bg-bg-raised hover:text-text-hi rounded transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
