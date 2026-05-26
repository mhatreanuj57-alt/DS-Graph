'use client';

import { useState } from 'react';
import { ExecutionResult } from '@codeforge/types';

const LANGUAGE_MAP: Record<string, number> = {
  javascript: 93,
  typescript: 94,
  python: 92,
  rust: 91,
  java: 91, // Adjust as per Judge0 version
};

export function useExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const executeCode = async (languageId: string, sourceCode: string) => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_id: LANGUAGE_MAP[languageId] || 93,
          source_code: sourceCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      setResult(data);
    } catch (error: any) {
      setResult({
        stderr: error.message,
        status: { id: 0, description: 'Internal Error' },
      });
    } finally {
      setIsRunning(false);
    }
  };

  return { executeCode, isRunning, result };
}
