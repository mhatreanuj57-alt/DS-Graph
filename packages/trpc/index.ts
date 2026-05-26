import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@codeforge/db';

const t = initTRPC.create();

type SnippetTag = {
  name: string;
};

type SnippetWithRelations = {
  title: string;
  description?: string | null;
  category?: string | null;
  code: string;
  views: number;
  createdAt: Date;
  tags: SnippetTag[];
};

type SnippetFacetRow = {
  category?: string | null;
  tags: SnippetTag[];
};

export const appRouter = t.router({
  getLanguages: t.procedure.query(async () => {
    return prisma.language.findMany({
      include: {
        _count: {
          select: { snippets: true },
        },
      },
    });
  }),

  getSnippets: t.procedure
    .input(
      z.object({
        languageSlug: z.string().optional(),
        difficulty: z.number().min(1).max(3).optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      const { languageSlug, difficulty, category, search, tags } = input;
      const searchTerms: string[] = search
        ? search.trim().toLowerCase().split(/\s+/).filter(Boolean)
        : [];

      const snippets = (await prisma.snippet.findMany({
        where: {
          ...(languageSlug && { language: { slug: languageSlug } }),
          ...(difficulty && { difficulty }),
          ...(category && { category }),
          ...(tags && tags.length > 0 && {
            tags: { some: { name: { in: tags } } },
          }),
          ...(searchTerms.length > 0 && {
            AND: searchTerms.map((term: string) => ({
              OR: [
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { code: { contains: term, mode: 'insensitive' } },
                { category: { contains: term, mode: 'insensitive' } },
                { tags: { some: { name: { contains: term, mode: 'insensitive' } } } },
              ],
            })),
          }),
        },
        include: {
          language: true,
          tags: true,
        },
      })) as SnippetWithRelations[];

      if (searchTerms.length === 0) {
        return snippets.sort(
          (a: SnippetWithRelations, b: SnippetWithRelations) =>
            b.createdAt.getTime() - a.createdAt.getTime(),
        );
      }

      const scoreSnippet = (snippet: SnippetWithRelations) => {
        const haystacks = {
          title: snippet.title.toLowerCase(),
          description: snippet.description?.toLowerCase() ?? '',
          category: snippet.category?.toLowerCase() ?? '',
          code: snippet.code.toLowerCase(),
          tags: snippet.tags.map((tag: { name: string }) => tag.name.toLowerCase()),
        };

        return searchTerms.reduce((score: number, term: string) => {
          let next = score;

          if (haystacks.title === term) next += 120;
          if (haystacks.title.startsWith(term)) next += 45;
          if (haystacks.title.includes(term)) next += 30;
          if (haystacks.category === term) next += 20;
          if (haystacks.category.includes(term)) next += 10;
          if (haystacks.tags.some((tag: string) => tag === term)) next += 25;
          if (haystacks.tags.some((tag: string) => tag.includes(term))) next += 12;
          if (haystacks.description.includes(term)) next += 8;
          if (haystacks.code.includes(term)) next += 3;

          return next;
        }, 0);
      };

      return snippets.sort((a: SnippetWithRelations, b: SnippetWithRelations) => {
        const scoreDiff = scoreSnippet(b) - scoreSnippet(a);
        if (scoreDiff !== 0) return scoreDiff;
        if (b.views !== a.views) return b.views - a.views;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    }),

  getSnippetFacets: t.procedure
    .input(
      z.object({
        languageSlug: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const snippets = (await prisma.snippet.findMany({
        where: {
          ...(input.languageSlug && { language: { slug: input.languageSlug } }),
        },
        select: {
          category: true,
          tags: {
            select: { name: true },
          },
        },
      })) as SnippetFacetRow[];

      const categoryValues: string[] = snippets
        .map((snippet: SnippetFacetRow) => snippet.category?.trim())
        .filter((value: string | undefined): value is string => Boolean(value));

      const categories = [...new Set<string>(categoryValues)].sort((a, b) =>
        a.localeCompare(b),
      );

      const tagValues: string[] = snippets.flatMap((snippet: SnippetFacetRow) =>
        snippet.tags
          .map((tag: { name: string }) => tag.name.trim())
          .filter((value: string) => Boolean(value)),
      );

      const tags = [...new Set<string>(tagValues)].sort((a, b) => a.localeCompare(b));

      return { categories, tags };
    }),

  getSnippetById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      const snippet = await prisma.snippet.findUnique({
        where: { id: input },
        include: {
          language: true,
          tags: true,
          author: true,
        },
      });

      if (!snippet) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Snippet not found',
        });
      }

      return snippet;
    }),

  getUserProfile: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { id: input },
        include: {
          _count: {
            select: { snippets: true, bookmarks: true },
          },
        },
      });
    }),

  updateStreak: t.procedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input },
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      const now = new Date();
      const lastActive = new Date(user.lastActive);
      const diffInDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = user.streak;
      if (diffInDays === 1) {
        newStreak += 1;
      } else if (diffInDays > 1) {
        newStreak = 1;
      }

      return prisma.user.update({
        where: { id: input },
        data: {
          streak: newStreak,
          lastActive: now,
        },
      });
    }),

  createSnippet: t.procedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        code: z.string().min(10),
        languageSlug: z.string(),
        difficulty: z.number().min(1).max(3),
        tags: z.array(z.string()),
        createdBy: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { languageSlug, tags, createdBy, ...rest } = input;
      
      const language = await prisma.language.findUnique({
        where: { slug: languageSlug },
      });

      if (!language) throw new TRPCError({ code: 'NOT_FOUND', message: 'Language not found' });

      return prisma.snippet.create({
        data: {
          title: rest.title,
          description: rest.description,
          code: rest.code,
          difficulty: rest.difficulty,
          language: {
            connect: { id: language.id },
          },
          author: {
            connect: { id: createdBy },
          },
          tags: {
            connectOrCreate: tags.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        },
      });
    }),

  getModulesByLanguage: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.module.findMany({
        where: { language: { slug: input } },
        include: { lessons: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      });
    }),

  getLessonById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.lesson.findUnique({
        where: { id: input },
        include: { module: { include: { language: true } } },
      });
    }),

  getNotesByLanguage: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.note.findMany({
        where: { language: { slug: input } },
      });
    }),

  getQuizSetsByLanguage: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.quizSet.findMany({
        where: { language: { slug: input } },
        include: { _count: { select: { questions: true } } },
        orderBy: [{ type: 'asc' }, { setNumber: 'asc' }],
      });
    }),

  getQuizWithQuestions: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.quizSet.findUnique({
        where: { id: input },
        include: { questions: true },
      });
    }),

  submitQuizResult: t.procedure
    .input(z.object({
      userId: z.string(),
      quizSetId: z.string(),
      score: z.number(),
      total: z.number(),
    }))
    .mutation(async ({ input }) => {
      return prisma.userQuizResult.create({
        data: {
          score: input.score,
          total: input.total,
          user: {
            connect: { id: input.userId },
          },
          quizSet: {
            connect: { id: input.quizSetId },
          },
        },
      });
    }),

  markLessonComplete: t.procedure
    .input(z.object({
      userId: z.string(),
      lessonId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: input.userId,
            lessonId: input.lessonId,
          },
        },
        update: { completed: true },
        create: {
          completed: true,
          user: {
            connect: { id: input.userId },
          },
          lesson: {
            connect: { id: input.lessonId },
          },
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
