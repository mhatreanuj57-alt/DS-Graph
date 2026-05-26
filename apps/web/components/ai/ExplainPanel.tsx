'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface ExplainPanelProps {
  code: string;
  language: string;
  onClose: () => void;
}

export default function ExplainPanel({ code, language, onClose }: ExplainPanelProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to explain code');
      }

      setExplanation(data.text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-bg-surface border-l border-border-dim z-20 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="h-12 border-b border-border-dim flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">AI Explanation</span>
        </div>
        <button onClick={onClose} className="text-text-lo hover:text-text-hi transition-colors">
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!explanation && !loading && (
          <div className="text-center py-12">
            <Sparkles size={32} className="text-accent mx-auto mb-4 opacity-50" />
            <h3 className="text-sm font-bold text-text-hi mb-2">Need an explanation?</h3>
            <p className="text-xs text-text-lo mb-6">Claude will analyze your code and provide a line-by-line breakdown.</p>
            <button
              onClick={handleExplain}
              className="bg-accent text-bg-base text-xs font-bold px-6 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              EXPLAIN CODE
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-lo">
            <Loader2 size={24} className="animate-spin mb-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Claude is thinking...</span>
          </div>
        )}

        {explanation && (
          <div className="prose prose-invert prose-xs">
            <pre className="whitespace-pre-wrap font-sans text-text-hi leading-relaxed text-xs">
              {explanation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
