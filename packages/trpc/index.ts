import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@codeforge/db';

const t = initTRPC.create();

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
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      const { languageSlug, difficulty, search, tags } = input;

      return prisma.snippet.findMany({
        where: {
          ...(languageSlug && { language: { slug: languageSlug } }),
          ...(difficulty && { difficulty }),
          ...(tags && tags.length > 0 && {
            tags: { some: { name: { in: tags } } },
          }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          language: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      });
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
      const { languageSlug, tags, ...rest } = input;
      
      const language = await prisma.language.findUnique({
        where: { slug: languageSlug },
      });

      if (!language) throw new TRPCError({ code: 'NOT_FOUND', message: 'Language not found' });

      return prisma.snippet.create({
        data: {
          ...rest,
          languageId: language.id,
          tags: {
            connectOrCreate: tags.map((name) => ({
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
        data: input,
      });
    }),

  markLessonComplete: t.procedure
    .input(z.object({
      userId: z.string(),
      lessonId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return prisma.userProgress.upsert({
        where: { userId_lessonId: input },
        update: { completed: true },
        create: { ...input, completed: true },
      });
    }),
});

export type AppRouter = typeof appRouter;
