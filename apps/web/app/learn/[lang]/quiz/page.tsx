'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, HelpCircle, Code, Lightbulb, ChevronRight, Star } from 'lucide-react';

export default function QuizListPage() {
  const { lang } = useParams();
  const { data: quizSets, isLoading } = trpc.getQuizSetsByLanguage.useQuery(lang as string);

  const typeIcons: Record<string, any> = {
    MCQ: HelpCircle,
    THEORETICAL: Lightbulb,
    PRACTICAL: Code,
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-bg-base p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-border-dim pb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-hi tracking-tight capitalize">{lang} Quizzes</h1>
              <p className="text-text-lo text-sm mt-2">Test your knowledge through MCQs, Theory, and Practical challenges.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-bg-surface border border-border-dim rounded-lg px-4 py-2 flex items-center gap-3">
                <Trophy size={20} className="text-accent" />
                <div>
                  <div className="text-lg font-bold text-text-hi">0</div>
                  <div className="text-[10px] text-text-lo font-bold uppercase tracking-widest">Total Points</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-bg-surface animate-pulse rounded-xl border border-border-dim" />
              ))
            ) : quizSets?.map((set) => {
              const Icon = typeIcons[set.type] || HelpCircle;
              return (
                <Link
                  key={set.id}
                  href={`/learn/${lang}/quiz/${set.id}`}
                  className="bg-bg-surface border border-border-dim rounded-xl p-6 hover:border-accent transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded bg-bg-raised text-text-lo group-hover:text-accent transition-colors`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(set.setNumber)].map((_, i) => (
                          <Star key={i} size={12} className="text-accent" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-hi group-hover:text-accent transition-colors">{set.title}</h3>
                      <p className="text-xs text-text-lo mt-1 uppercase font-bold tracking-widest">{set.type} SECTION</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs text-text-lo">{set._count.questions} Questions</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                      Start Quiz
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
