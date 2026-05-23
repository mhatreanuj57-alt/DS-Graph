'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';

export default function MonacoEditor() {
  const { code, setCode, languageId, fontSize } = useEditorStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="flex-1 min-h-0 bg-bg-raised">
      <Editor
        height="100%"
        language={languageId}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize,
          fontFamily: 'JetBrains Mono',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 },
          wordWrap: 'on',
        }}
        onMount={(editor) => {
          // Custom theme logic could go here
        }}
      />
    </div>
  );
}
