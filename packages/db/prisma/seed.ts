import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LANGUAGES } = require('../scripts/content-config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readJson, validateLanguageContent } = require('../scripts/content-validator');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Clear existing curriculum data to ensure clean seed
  await prisma.userProgress.deleteMany({});
  await prisma.userQuizResult.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quizSet.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.note.deleteMany({});
  
  // Clear snippets and tags to avoid duplication
  await prisma.snippet.deleteMany({});
  await prisma.tag.deleteMany({});

  // Create a default user for seeding
  const user = await prisma.user.upsert({
    where: { email: 'admin@codeforge.dev' },
    update: {},
    create: {
      email: 'admin@codeforge.dev',
      handle: 'codeforge',
    },
  });

  for (const langSlug of LANGUAGES) {
    const langName = langSlug.charAt(0).toUpperCase() + langSlug.slice(1);
    validateLanguageContent(path.join(__dirname, '../../..'), langSlug);
    
    // Upsert language
    const language = await prisma.language.upsert({
      where: { slug: langSlug },
      update: {},
      create: {
        name: langName,
        slug: langSlug,
      },
    });

    const snippetsPath = path.join(__dirname, `../../snippets-data/${langSlug}/snippets.json`);
    
    if (fs.existsSync(snippetsPath)) {
      const snippetsData = readJson(snippetsPath);
      
      for (const s of snippetsData) {
        await prisma.snippet.create({
          data: {
            title: s.title,
            description: s.description,
            code: s.code,
            difficulty: s.difficulty,
            category: s.category,
            explanationMd: s.explanation_md,
            languageId: language.id,
            createdBy: user.id,
            isVerified: true,
            tags: {
              connectOrCreate: s.tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            },
          },
        });
      }
      console.log(`Seeded ${snippetsData.length} snippets for ${langName}`);
    }

    // Seed Lessons & Modules
    const lessonsPath = path.join(__dirname, `../../curriculum-data/lessons/${langSlug}.json`);
    if (fs.existsSync(lessonsPath)) {
      const { modules } = readJson(lessonsPath);
      for (const m of modules) {
        const module = await prisma.module.create({
          data: {
            title: m.title,
            order: m.order,
            languageId: language.id,
          },
        });
        for (const l of m.lessons) {
          await prisma.lesson.create({
            data: {
              title: l.title,
              content: l.content,
              order: l.order,
              moduleId: module.id,
            },
          });
        }
      }
      console.log(`Seeded modules and lessons for ${langName}`);
    }

    // Seed Notes
    const notesPath = path.join(__dirname, `../../curriculum-data/notes/${langSlug}.json`);
    if (fs.existsSync(notesPath)) {
      const notesData = readJson(notesPath);
      for (const n of notesData) {
        await prisma.note.create({
          data: {
            title: n.title,
            content: n.content,
            languageId: language.id,
          },
        });
      }
      console.log(`Seeded ${notesData.length} notes for ${langName}`);
    }

    // Seed Quizzes
    const quizzesPath = path.join(__dirname, `../../curriculum-data/quizzes/${langSlug}.json`);
    if (fs.existsSync(quizzesPath)) {
      const { quizSets } = readJson(quizzesPath);
      for (const qs of quizSets) {
        const quizSet = await prisma.quizSet.create({
          data: {
            title: qs.title,
            setNumber: qs.setNumber,
            type: qs.type,
            languageId: language.id,
          },
        });
        for (const q of qs.questions) {
          await prisma.question.create({
            data: {
              type: q.type,
              text: q.text,
              options: q.options ? JSON.stringify(q.options) : null,
              correctOption: q.correctOption,
              expectedOut: q.expectedOut,
              explanation: q.explanation,
              quizSetId: quizSet.id,
            },
          });
        }
      }
      console.log(`Seeded quiz sets for ${langName}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
