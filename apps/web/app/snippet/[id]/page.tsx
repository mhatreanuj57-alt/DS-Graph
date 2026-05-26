import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { prisma } from '@codeforge/db';
import { notFound } from 'next/navigation';
import { Terminal, Calendar, User, Eye, ArrowUpCircle } from 'lucide-react';

export default async function SnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      language: true,
      tags: true,
      author: true,
    },
  });

  if (!snippet) {
    notFound();
  }

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-bg-base p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {snippet.language.name}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                snippet.difficulty === 1 ? 'border-success/30 text-success' :
                snippet.difficulty === 2 ? 'border-warning/30 text-warning' :
                'border-error/30 text-error'
              }`}>
                {snippet.difficulty === 1 ? 'Beginner' : snippet.difficulty === 2 ? 'Intermediate' : 'Advanced'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-text-hi tracking-tight">{snippet.title}</h1>
            <p className="text-lg text-text-lo leading-relaxed">{snippet.description}</p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-8 py-4 border-y border-border-dim">
            <div className="flex items-center gap-2 text-text-lo">
              <User size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{snippet.author.handle || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-lo">
              <Calendar size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{new Date(snippet.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-text-lo">
              <Eye size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{snippet.views} views</span>
            </div>
            <div className="flex items-center gap-2 text-text-lo">
              <ArrowUpCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{snippet.upvotes} upvotes</span>
            </div>
          </div>

          {/* Code Block */}
          <div className="bg-bg-raised border border-border-dim rounded-xl overflow-hidden">
            <div className="bg-bg-surface px-4 py-2 border-b border-border-dim flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-text-lo" />
                <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest">{snippet.language.name}</span>
              </div>
            </div>
            <pre className="p-6 text-sm font-mono text-text-hi overflow-x-auto leading-relaxed">
              <code>{snippet.code}</code>
            </pre>
          </div>

          {/* Explanation */}
          {snippet.explanationMd && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-hi">Explanation</h2>
              <div className="prose prose-invert max-w-none text-text-lo text-sm leading-relaxed">
                {snippet.explanationMd}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag) => (
              <span key={tag.id} className="text-[10px] font-bold text-text-lo uppercase tracking-widest bg-bg-surface px-2 py-1 rounded border border-border-dim">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
