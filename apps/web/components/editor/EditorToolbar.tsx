'use client';

'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Settings, Sparkles, Trash2, Share2, Type } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

interface EditorToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onToggleExplain: () => void;
  isRunning: boolean;
}

export default function EditorToolbar({ onRun, onReset, onToggleExplain, isRunning }: EditorToolbarProps) {
  const { fontSize, setFontSize, vimMode, setVimMode, setCode } = useEditorStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="h-10 border-b border-border-dim bg-bg-surface flex items-center px-2 justify-between relative z-30">
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
        <button
          onClick={() => setCode('')}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-text-lo hover:bg-bg-raised hover:text-error transition-colors"
        >
          <Trash2 size={14} />
          CLEAR
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
        
        <div className="w-px h-4 bg-border-dim mx-1" />

        <button className="p-1.5 text-text-lo hover:bg-bg-raised hover:text-text-hi rounded transition-colors">
          <Share2 size={16} />
        </button>
        <button className="p-1.5 text-text-lo hover:bg-bg-raised hover:text-text-hi rounded transition-colors">
          <Copy size={16} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded transition-colors ${showSettings ? 'bg-bg-raised text-accent' : 'text-text-lo hover:bg-bg-raised hover:text-text-hi'}`}
          >
            <Settings size={16} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-border-dim rounded-lg shadow-2xl p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest">Font Size</span>
                  <span className="text-xs text-text-hi">{fontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest">Vim Mode</span>
                <button 
                  onClick={() => setVimMode(!vimMode)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${vimMode ? 'bg-accent' : 'bg-bg-raised'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${vimMode ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
