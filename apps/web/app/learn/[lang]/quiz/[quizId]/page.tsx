'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, Timer, AlertCircle } from 'lucide-react';

export default function QuizRunnerPage() {
  const { quizId, lang } = useParams();
  const router = useRouter();
  const { data: quiz, isLoading } = trpc.getQuizWithQuestions.useQuery(quizId as string);
  const resultMutation = trpc.submitQuizResult.useMutation();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    if (quiz && currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleFinish = async () => {
    if (!quiz) return;
    
    let score = 0;
    quiz.questions.forEach((q) => {
      if (q.type === 'MCQ' && answers[q.id] === q.correctOption) {
        score += 1;
      }
      // Theoretical and Practical would need more complex validation
    });

    await resultMutation.mutateAsync({
      userId: 'temp',
      quizSetId: quizId as string,
      score,
      total: quiz.questions.length,
    });

    router.push(`/learn/${lang}/quiz`);
  };

  const currentQuestion = quiz?.questions[currentIdx];

  if (showResults) {
    let score = 0;
    quiz?.questions.forEach((q) => {
      if (q.type === 'MCQ' && answers[q.id] === q.correctOption) score += 1;
    });

    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center bg-bg-base">
          <div className="max-w-md w-full bg-bg-surface border border-border-dim rounded-2xl p-8 text-center space-y-6">
            <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text-hi">Quiz Completed!</h2>
              <p className="text-text-lo">You've finished {quiz?.title}</p>
            </div>
            <div className="py-8">
              <div className="text-5xl font-bold text-accent">{score} / {quiz?.questions.length}</div>
              <p className="text-xs text-text-lo uppercase font-bold tracking-widest mt-2">Final Score</p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-accent text-bg-base font-bold py-3 rounded-lg hover:brightness-110 transition-all"
            >
              SAVE & EXIT
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col bg-bg-base overflow-hidden">
        {/* Quiz Header */}
        <div className="h-14 border-b border-border-dim bg-bg-surface flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1 hover:bg-bg-raised rounded text-text-lo">
              <ChevronLeft size={20} />
            </button>
            <div className="h-4 w-px bg-border-dim" />
            <span className="text-xs font-bold text-text-hi uppercase tracking-widest">{quiz?.title}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-text-lo">
              <Timer size={16} />
              <span className="text-sm font-mono">24:59</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-bold text-text-lo uppercase tracking-widest">
                {currentIdx + 1} of {quiz?.questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto space-y-12">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-bg-surface w-3/4 rounded" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-bg-surface w-full rounded" />
                  ))}
                </div>
              </div>
            ) : currentQuestion && (
              <>
                <div className="space-y-6">
                  <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded border border-accent/20">
                    {currentQuestion.type} QUESTION
                  </span>
                  <h2 className="text-2xl font-bold text-text-hi leading-relaxed">{currentQuestion.text}</h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.type === 'MCQ' && JSON.parse(currentQuestion.options || '[]').map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: idx })}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        answers[currentQuestion.id] === idx
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border-dim bg-bg-surface text-text-lo hover:border-text-lo'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        answers[currentQuestion.id] === idx ? 'border-accent bg-accent text-bg-base' : 'border-border-dim'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm font-bold">{option}</span>
                    </button>
                  ))}

                  {currentQuestion.type === 'THEORETICAL' && (
                    <textarea
                      placeholder="Write your explanation here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                      className="w-full bg-bg-surface border border-border-dim rounded-xl p-4 text-text-hi focus:outline-none focus:border-accent transition-colors h-48 resize-none text-sm"
                    />
                  )}
                  
                  {currentQuestion.type === 'PRACTICAL' && (
                    <div className="space-y-4">
                      <div className="bg-bg-surface border border-border-dim rounded-xl p-4 font-mono text-sm text-text-lo italic">
                        // TODO: Implement your solution below
                      </div>
                      <textarea
                        placeholder="Write your code here..."
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                        className="w-full bg-bg-surface border border-border-dim rounded-xl p-4 text-accent font-mono text-sm focus:outline-none focus:border-accent transition-colors h-64 resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-12 border-t border-border-dim flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-2 text-sm font-bold text-text-lo hover:text-text-hi uppercase tracking-widest transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-accent text-bg-base font-bold px-8 py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    {currentIdx === (quiz?.questions.length || 0) - 1 ? 'FINISH QUIZ' : 'NEXT QUESTION'}
                    <ChevronRight size={18} />
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
