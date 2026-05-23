'use client';

import { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.post('/api/execute', {
        language_id: LANGUAGE_MAP[languageId] || 93,
        source_code: sourceCode,
      });

      setResult(response.data);
    } catch (error: any) {
      setResult({
        stderr: error.response?.data?.error || error.message,
        status: { id: 0, description: 'Internal Error' },
      });
    } finally {
      setIsRunning(false);
    }
  };

  return { executeCode, isRunning, result };
}
