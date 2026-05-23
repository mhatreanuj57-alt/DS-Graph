export interface User {
  id: string;
  email: string;
  handle?: string;
  avatarUrl?: string;
  streak: number;
}

export interface Language {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  languageId: string;
  difficulty: 1 | 2 | 3;
  tags: string[];
  isVerified: boolean;
  views: number;
  upvotes: number;
}

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}
