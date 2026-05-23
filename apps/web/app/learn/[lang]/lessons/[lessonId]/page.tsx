'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';

export default function LessonViewerPage() {
  const { lessonId, lang } = useParams();
  const router = useRouter();
  const { data: lesson, isLoading } = trpc.getLessonById.useQuery(lessonId as string);
  const completeMutation = trpc.markLessonComplete.useMutation();

  const handleComplete = async () => {
    // In a real app, we'd get the userId from auth
    // For now, placeholder or check auth
    await completeMutation.mutateAsync({ userId: 'temp', lessonId: lessonId as string });
    router.push(`/learn/${lang}/lessons`);
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col bg-bg-base overflow-hidden">
        {/* Sub-nav */}
        <div className="h-12 border-b border-border-dim bg-bg-surface flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1 hover:bg-bg-raised rounded text-text-lo">
              <ChevronLeft size={20} />
            </button>
            <div className="h-4 w-px bg-border-dim" />
            <span className="text-xs font-bold text-text-lo uppercase tracking-widest">{lesson?.module.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-bold text-text-lo hover:text-text-hi uppercase tracking-widest transition-colors">
              <BookOpen size={16} />
              Open Notes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-bg-surface w-3/4 rounded" />
                <div className="h-4 bg-bg-surface w-full rounded" />
                <div className="h-4 bg-bg-surface w-full rounded" />
                <div className="h-64 bg-bg-surface w-full rounded" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Lesson {lesson?.order}</span>
                  <h1 className="text-4xl font-bold text-text-hi tracking-tight leading-tight">{lesson?.title}</h1>
                </div>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-text-hi prose-p:text-text-lo prose-p:leading-relaxed prose-code:text-accent prose-pre:bg-bg-raised prose-pre:border prose-pre:border-border-dim">
                  <div dangerouslySetInnerHTML={{ __html: lesson?.content || '' }} />
                </div>

                <div className="pt-12 border-t border-border-dim flex items-center justify-between">
                  <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-text-lo hover:text-text-hi uppercase tracking-widest transition-colors">
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 bg-accent text-bg-base font-bold px-8 py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    <CheckCircle size={18} />
                    COMPLETE & CONTINUE
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
