import { create } from 'zustand';

interface EditorState {
  code: string;
  languageId: string;
  theme: string;
  fontSize: number;
  setCode: (code: string) => void;
  setLanguageId: (languageId: string) => void;
  setFontSize: (size: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '// Write your code here',
  languageId: 'javascript',
  theme: 'vs-dark',
  fontSize: 14,
  setCode: (code) => set({ code }),
  setLanguageId: (languageId) => set({ languageId }),
  setFontSize: (fontSize) => set({ fontSize }),
}));
