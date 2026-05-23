import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const languages = [
  'javascript', 'python', 'typescript', 'rust', 'go', 
  'java', 'html', 'css', 'sql', 'shell',
  'c', 'cpp', 'react', 'nextjs', 'node',
  'php', 'firebase', 'supabase', 'threejs', 'wordpress'
];

async function main() {
  console.log('Starting seeding...');

  // Create a default user for seeding
  const user = await prisma.user.upsert({
    where: { email: 'admin@codeforge.dev' },
    update: {},
    create: {
      email: 'admin@codeforge.dev',
      handle: 'codeforge',
    },
  });

  for (const langSlug of languages) {
    const langName = langSlug.charAt(0).toUpperCase() + langSlug.slice(1);
    
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
      const snippetsData = JSON.parse(fs.readFileSync(snippetsPath, 'utf-8'));
      
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
