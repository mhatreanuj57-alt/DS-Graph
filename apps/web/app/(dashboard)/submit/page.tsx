'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/lib/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';
import { Code2, Send, AlertCircle } from 'lucide-react';

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: languages } = trpc.getLanguages.useQuery();
  const mutation = trpc.createSnippet.useMutation({
    onSuccess: () => {
      router.push('/learn');
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    languageSlug: 'javascript',
    difficulty: 1,
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    mutation.mutate({
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdBy: user.uid,
    });
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-bg-base p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent p-2 rounded-lg">
              <Code2 size={24} className="text-bg-base" />
            </div>
            <h1 className="text-2xl font-bold text-text-hi tracking-tight">Submit Snippet</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface border border-border-dim rounded-xl p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., QuickSort in Rust"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Description</label>
                <textarea
                  placeholder="What does this snippet do?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Language</label>
                  <select
                    value={formData.languageSlug}
                    onChange={(e) => setFormData({ ...formData, languageSlug: e.target.value })}
                    className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors"
                  >
                    {languages?.map((lang: any) => (
                      <option key={lang.id} value={lang.slug}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) })}
                    className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value={1}>Beginner</option>
                    <option value={2}>Intermediate</option>
                    <option value={3}>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Code</label>
                <textarea
                  required
                  placeholder="Paste your code here..."
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-3 font-mono text-sm text-text-hi focus:outline-none focus:border-accent transition-colors h-64 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="algorithm, sort, optimization"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {mutation.isError && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex items-center gap-3">
                <AlertCircle size={18} />
                <span className="text-xs font-bold">Failed to submit snippet. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-accent text-bg-base font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {mutation.isPending ? 'SUBMITTING...' : 'SUBMIT SNIPPET'}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
