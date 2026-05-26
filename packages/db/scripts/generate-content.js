const fs = require('fs');
const path = require('path');
const { LANGUAGES } = require('./content-config');
const { validateLanguageContent } = require('./content-validator');

const OUTPUT_COUNT = 105;
const SNIPPET_VARIANTS_PER_SEED = 20;
const NOTE_VARIANTS_PER_SEED = 20;

const variantSpecs = [
  { label: 'Quick Start', focus: 'the smallest useful version', tag: 'quick-start', difficulty: 1, number: 3, text: 'starter' },
  { label: 'Validation', focus: 'guarding inputs before work begins', tag: 'validation', difficulty: 1, number: 7, text: 'safe-input' },
  { label: 'Practical Example', focus: 'a realistic day-to-day use case', tag: 'practical', difficulty: 2, number: 12, text: 'real-world' },
  { label: 'Reusable Utility', focus: 'extracting logic into a helper', tag: 'utility', difficulty: 2, number: 16, text: 'helper' },
  { label: 'Edge Cases', focus: 'behavior around empty or unexpected values', tag: 'edge-cases', difficulty: 2, number: 21, text: 'fallback' },
  { label: 'Debug Friendly', focus: 'visibility while troubleshooting', tag: 'debugging', difficulty: 1, number: 24, text: 'debug-run' },
  { label: 'Performance Pass', focus: 'reducing extra work and repeated operations', tag: 'performance', difficulty: 3, number: 32, text: 'fast-path' },
  { label: 'Refactor Pass', focus: 'cleaner naming and separation of concerns', tag: 'refactor', difficulty: 2, number: 36, text: 'cleanup' },
  { label: 'Interview Style', focus: 'a compact explanation-friendly version', tag: 'interview', difficulty: 2, number: 42, text: 'whiteboard' },
  { label: 'Production Hint', focus: 'a safer version to build on in production', tag: 'production', difficulty: 3, number: 48, text: 'production' },
  { label: 'Test Ready', focus: 'making the behavior easier to verify', tag: 'testing', difficulty: 2, number: 54, text: 'test-case' },
  { label: 'Data Cleanup', focus: 'normalizing and cleaning source values', tag: 'cleanup', difficulty: 2, number: 60, text: 'normalized' },
  { label: 'Batch Mode', focus: 'handling multiple values in one pass', tag: 'batch', difficulty: 3, number: 66, text: 'batch-run' },
  { label: 'Error Aware', focus: 'failing clearly when assumptions break', tag: 'error-handling', difficulty: 3, number: 72, text: 'guarded' },
  { label: 'Team Style', focus: 'readable code that other developers can extend', tag: 'team-style', difficulty: 1, number: 75, text: 'shared' },
  { label: 'Extended Example', focus: 'one extra step beyond the original sample', tag: 'extended', difficulty: 2, number: 81, text: 'extended' },
  { label: 'Checklist Version', focus: 'the moving parts you should review before shipping', tag: 'checklist', difficulty: 1, number: 88, text: 'review' },
  { label: 'API Friendly', focus: 'shaping output for an endpoint or integration', tag: 'api', difficulty: 3, number: 91, text: 'api-ready' },
  { label: 'Reporting', focus: 'turning output into a concise summary', tag: 'reporting', difficulty: 2, number: 96, text: 'summary' },
  { label: 'Practice Prompt', focus: 'a version that is easy to modify in exercises', tag: 'practice', difficulty: 1, number: 108, text: 'practice' },
];

const aliasByLanguage = {
  javascript: 'JavaScript',
  python: 'Python',
  typescript: 'TypeScript',
  rust: 'Rust',
  go: 'Go',
  java: 'Java',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  shell: 'Shell',
  c: 'C',
  cpp: 'C++',
  react: 'React',
  nextjs: 'Next.js',
  node: 'Node.js',
  php: 'PHP',
  firebase: 'Firebase',
  supabase: 'Supabase',
  threejs: 'Three.js',
  wordpress: 'WordPress',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function uniqueTags(tags) {
  return [...new Set(tags.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean))];
}

function commentPrefix(lang) {
  if (lang === 'html') return 'html';
  if (lang === 'css') return 'css';
  if (lang === 'sql') return 'sql';
  return 'slash';
}

function addHeaderComment(code, lang, text) {
  const mode = commentPrefix(lang);
  if (mode === 'html') return `<!-- ${text} -->\n${code}`;
  if (mode === 'css') return `/* ${text} */\n${code}`;
  if (mode === 'sql') return `-- ${text}\n${code}`;
  if (lang === 'python' || lang === 'shell') return `# ${text}\n${code}`;
  return `// ${text}\n${code}`;
}

function replaceFirst(source, pattern, replacer) {
  let done = false;
  return source.replace(pattern, (...args) => {
    if (done) return args[0];
    done = true;
    return typeof replacer === 'function' ? replacer(...args) : replacer;
  });
}

function transformCode(code, lang, variant, seedIndex, variantIndex) {
  let next = code;

  next = replaceFirst(next, /(["'`])([^"'`\n]{1,40})\1/, (match, quote, content) => {
    return `${quote}${content}-${variant.text}${quote}`;
  });

  next = replaceFirst(next, /\b(\d{1,4})\b/, (match, value) => {
    return String(Number(value) + variant.number + seedIndex + variantIndex);
  });

  const renamePairs = [
    ['result', `result${variantIndex + 1}`],
    ['data', `data${variantIndex + 1}`],
    ['user', `user${variantIndex + 1}`],
    ['item', `item${variantIndex + 1}`],
    ['count', `count${variantIndex + 1}`],
    ['message', `message${variantIndex + 1}`],
    ['list', `list${variantIndex + 1}`],
    ['config', `config${variantIndex + 1}`],
  ];

  for (const [from, to] of renamePairs) {
    const regex = new RegExp(`\\b${from}\\b`);
    next = replaceFirst(next, regex, to);
  }

  return addHeaderComment(
    next,
    lang,
    `${variant.label} focus: ${variant.focus}`,
  );
}

function normalizeTitle(title) {
  return String(title || 'Untitled').replace(/\s+/g, ' ').trim();
}

function buildSnippet(seed, lang, variant, seedIndex, variantIndex) {
  return {
    title: `${normalizeTitle(seed.title)} (${variant.label})`,
    description: `${seed.description || `A ${aliasByLanguage[lang]} example.`} Focus: ${variant.focus}.`,
    code: transformCode(seed.code || '', lang, variant, seedIndex, variantIndex),
    difficulty: variant.difficulty || seed.difficulty || 1,
    category: seed.category || 'Core',
    explanation_md: `${seed.explanation_md || `This ${aliasByLanguage[lang]} snippet demonstrates ${normalizeTitle(seed.title).toLowerCase()}.`}\n\n### Variant focus\nThis version emphasizes ${variant.focus}. Use it as a ${variant.tag.replace(/-/g, ' ')} example and adapt names, values, and structure to your project.\n\n### Review prompt\nCheck whether the input assumptions, output shape, and naming still make sense after you customize the example.`,
    tags: uniqueTags([...(seed.tags || []), variant.tag, `seed-${seedIndex + 1}`, `${lang}-snippet`]),
  };
}

function deriveNotesFromSnippets(snippets, lang) {
  return snippets.slice(0, 5).map((snippet, index) => ({
    title: `${normalizeTitle(snippet.title)} Concepts`,
    content: `# ${normalizeTitle(snippet.title)}\n\nThis note is derived from the ${aliasByLanguage[lang]} snippet set and explains the core idea behind **${normalizeTitle(snippet.title)}**.\n\n## Why it matters\n${snippet.description || `This pattern appears often in ${aliasByLanguage[lang]} codebases.`}\n\n## Example\n\`\`\`${lang === 'nextjs' ? 'tsx' : lang === 'react' ? 'jsx' : lang}\n${snippet.code || ''}\n\`\`\`\n\n## Review checklist\n- Identify the input and output.\n- Decide what should be configurable.\n- Confirm the naming still matches the domain.\n- Add tests or manual checks for failure cases.\n`,
  }));
}

function buildNote(seed, lang, variant, seedIndex) {
  return {
    title: `${normalizeTitle(seed.title)} (${variant.label})`,
    content: `${seed.content || `# ${normalizeTitle(seed.title)}\n\nA practical ${aliasByLanguage[lang]} note.`}\n\n## Focus: ${variant.label}\nThis revision revisits the topic with emphasis on ${variant.focus}. When you reuse the pattern, check how data enters the flow, what the happy path is, and how errors are surfaced.\n\n## Best practices\n- Keep the example small before making it generic.\n- Prefer names that describe domain meaning instead of implementation detail.\n- Decide which assumptions should be validated up front.\n- Capture one test or manual check for the most likely failure mode.\n\n## Practice exercise\nRebuild the sample in ${aliasByLanguage[lang]} with one extra rule: add logging, validation, or summary output without changing the main intent of the original example.\n\n## Seed reference\nThis note expands seed ${seedIndex + 1} for ${aliasByLanguage[lang]}.`,
  };
}

function fillToCount(items, targetCount, fallbackFactory) {
  const next = items.slice(0, targetCount);
  let i = 0;
  while (next.length < targetCount) {
    next.push(fallbackFactory(i));
    i += 1;
  }
  return next;
}

function buildDatasetForLanguage(lang) {
  const snippetsFile = path.join(__dirname, `../../snippets-data/${lang}/snippets.json`);
  const notesFile = path.join(__dirname, `../../curriculum-data/notes/${lang}.json`);

  const snippetSeeds = fs.existsSync(snippetsFile) ? readJson(snippetsFile).slice(0, 5) : [];
  if (snippetSeeds.length === 0) {
    throw new Error(`Missing snippet seed data for ${lang}`);
  }

  const noteSeeds = fs.existsSync(notesFile)
    ? readJson(notesFile).slice(0, 5)
    : deriveNotesFromSnippets(snippetSeeds, lang);

  const snippets = [];
  for (let seedIndex = 0; seedIndex < snippetSeeds.length; seedIndex += 1) {
    const seed = snippetSeeds[seedIndex];
    snippets.push({
      title: normalizeTitle(seed.title),
      description: seed.description || `A ${aliasByLanguage[lang]} example.`,
      code: seed.code || '',
      difficulty: seed.difficulty || 1,
      category: seed.category || 'Core',
      explanation_md: seed.explanation_md || `This ${aliasByLanguage[lang]} snippet demonstrates ${normalizeTitle(seed.title).toLowerCase()}.`,
      tags: uniqueTags([...(seed.tags || []), `${lang}-snippet`, `seed-${seedIndex + 1}`]),
    });

    for (let variantIndex = 0; variantIndex < SNIPPET_VARIANTS_PER_SEED; variantIndex += 1) {
      snippets.push(buildSnippet(seed, lang, variantSpecs[variantIndex], seedIndex, variantIndex));
    }
  }

  const notes = [];
  for (let seedIndex = 0; seedIndex < noteSeeds.length; seedIndex += 1) {
    const seed = noteSeeds[seedIndex];
    notes.push({
      title: normalizeTitle(seed.title),
      content: seed.content || `# ${normalizeTitle(seed.title)}\n\nA practical ${aliasByLanguage[lang]} note.`,
    });

    for (let variantIndex = 0; variantIndex < NOTE_VARIANTS_PER_SEED; variantIndex += 1) {
      notes.push(buildNote(seed, lang, variantSpecs[variantIndex], seedIndex));
    }
  }

  const finalSnippets = fillToCount(snippets, OUTPUT_COUNT, (index) =>
    buildSnippet(snippetSeeds[index % snippetSeeds.length], lang, variantSpecs[index % variantSpecs.length], index % snippetSeeds.length, index),
  );
  const finalNotes = fillToCount(notes, OUTPUT_COUNT, (index) =>
    buildNote(noteSeeds[index % noteSeeds.length], lang, variantSpecs[index % variantSpecs.length], index % noteSeeds.length),
  );

  writeJson(snippetsFile, finalSnippets);
  writeJson(notesFile, finalNotes);

  return {
    snippets: finalSnippets.length,
    notes: finalNotes.length,
  };
}

function main() {
  console.log('Generating local snippet and note datasets...');
  for (const lang of LANGUAGES) {
    const counts = buildDatasetForLanguage(lang);
    validateLanguageContent(path.resolve(__dirname, '..', '..', '..'), lang);
    console.log(`${lang}: ${counts.snippets} snippets, ${counts.notes} notes`);
  }
  console.log('Generation complete.');
}

main();
