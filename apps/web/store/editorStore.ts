import { create } from 'zustand';

interface EditorState {
  code: string;
  languageId: string;
  theme: string;
  fontSize: number;
  vimMode: boolean;
  setCode: (code: string) => void;
  setLanguageId: (languageId: string) => void;
  setFontSize: (size: number) => void;
  setVimMode: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '// Write your code here',
  languageId: 'javascript',
  theme: 'vs-dark',
  fontSize: 14,
  vimMode: false,
  setCode: (code) => set({ code }),
  setLanguageId: (languageId) => set({ languageId }),
  setFontSize: (fontSize) => set({ fontSize }),
  setVimMode: (vimMode) => set({ vimMode }),
}));
