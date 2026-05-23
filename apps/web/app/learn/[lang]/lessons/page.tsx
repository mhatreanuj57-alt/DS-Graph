'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, PlayCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function LessonsPage() {
  const { lang } = useParams();
  const { data: modules, isLoading } = trpc.getModulesByLanguage.useQuery(lang as string);

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto bg-bg-base p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-border-dim pb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-hi tracking-tight capitalize">{lang} Curriculum</h1>
              <p className="text-text-lo text-sm mt-2">Master {lang} through structured, hands-on modules.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">0%</div>
              <div className="text-[10px] text-text-lo font-bold uppercase tracking-widest">Progress</div>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-bg-surface animate-pulse rounded-xl border border-border-dim" />
              ))
            ) : modules?.map((module) => (
              <div key={module.id} className="bg-bg-surface border border-border-dim rounded-xl overflow-hidden shadow-lg transition-all hover:border-accent/20">
                <div className="bg-bg-raised/50 px-6 py-4 border-b border-border-dim flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-text-lo/20">0{module.order}</span>
                    <h2 className="text-lg font-bold text-text-hi">{module.title}</h2>
                  </div>
                  <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest bg-bg-base px-2 py-0.5 rounded border border-border-dim">
                    {module.lessons.length} Lessons
                  </span>
                </div>
                <div className="divide-y divide-border-dim">
                  {module.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lang}/lessons/${lesson.id}`}
                      className="group flex items-center justify-between px-6 py-4 hover:bg-bg-raised transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-text-lo group-hover:text-accent transition-colors">
                          <PlayCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-hi">{lesson.title}</h4>
                          <span className="text-[10px] text-text-lo uppercase font-bold tracking-widest">
                            Lesson {lesson.order}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-lo group-hover:text-text-hi transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
