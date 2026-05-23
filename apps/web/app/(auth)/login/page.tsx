'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Terminal, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { loginWithGoogle, loginWithGithub } = useAuth();

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface border border-border-dim rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent p-2 rounded-lg mb-4">
            <Terminal size={32} className="text-bg-base" />
          </div>
          <h1 className="text-2xl font-bold text-text-hi tracking-tight">Welcome back</h1>
          <p className="text-text-lo text-sm mt-2">Continue your coding journey</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-bg-raised hover:bg-bg-raised/80 text-text-hi border border-border-dim py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-semibold">Continue with Google</span>
          </button>

          <button
            onClick={() => loginWithGithub()}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white py-3 rounded-lg transition-all active:scale-[0.98]"
          >
            <Github size={20} />
            <span className="font-semibold">Continue with GitHub</span>
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-dim"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg-surface px-2 text-text-lo tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-lo uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-bg-base border border-border-dim rounded-lg px-4 py-2.5 text-text-hi focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button className="w-full bg-accent text-bg-base font-bold py-3 rounded-lg hover:brightness-110 transition-all active:scale-[0.98]">
            Sign In with Email
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-text-lo">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
