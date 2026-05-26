const fs = require('fs');
const path = require('path');
const {
  LANGUAGES,
  MIN_SNIPPETS_PER_LANGUAGE,
  MIN_NOTES_PER_LANGUAGE,
} = require('./content-config');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureString(value, label) {
  ensure(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
}

function ensureDifficulty(value, label) {
  ensure(Number.isInteger(value) && value >= 1 && value <= 3, `${label} must be 1, 2, or 3`);
}

function validateSnippet(snippet, label) {
  ensure(snippet && typeof snippet === 'object', `${label} must be an object`);
  ensureString(snippet.title, `${label}.title`);
  ensureString(snippet.code, `${label}.code`);
  if (snippet.description != null) ensureString(snippet.description, `${label}.description`);
  if (snippet.category != null) ensureString(snippet.category, `${label}.category`);
  if (snippet.explanation_md != null) ensureString(snippet.explanation_md, `${label}.explanation_md`);
  ensureDifficulty(snippet.difficulty, `${label}.difficulty`);
  ensure(Array.isArray(snippet.tags), `${label}.tags must be an array`);
  snippet.tags.forEach((tag, index) => ensureString(tag, `${label}.tags[${index}]`));
}

function validateNote(note, label) {
  ensure(note && typeof note === 'object', `${label} must be an object`);
  ensureString(note.title, `${label}.title`);
  ensureString(note.content, `${label}.content`);
}

function validateLessonFile(data, label) {
  ensure(data && typeof data === 'object', `${label} must be an object`);
  ensure(Array.isArray(data.modules), `${label}.modules must be an array`);
  data.modules.forEach((moduleItem, moduleIndex) => {
    const moduleLabel = `${label}.modules[${moduleIndex}]`;
    ensureString(moduleItem.title, `${moduleLabel}.title`);
    ensure(Number.isInteger(moduleItem.order), `${moduleLabel}.order must be an integer`);
    ensure(Array.isArray(moduleItem.lessons), `${moduleLabel}.lessons must be an array`);
    moduleItem.lessons.forEach((lesson, lessonIndex) => {
      const lessonLabel = `${moduleLabel}.lessons[${lessonIndex}]`;
      ensureString(lesson.title, `${lessonLabel}.title`);
      ensureString(lesson.content, `${lessonLabel}.content`);
      ensure(Number.isInteger(lesson.order), `${lessonLabel}.order must be an integer`);
    });
  });
}

function validateQuizFile(data, label) {
  ensure(data && typeof data === 'object', `${label} must be an object`);
  ensure(Array.isArray(data.quizSets), `${label}.quizSets must be an array`);
  data.quizSets.forEach((quizSet, setIndex) => {
    const setLabel = `${label}.quizSets[${setIndex}]`;
    ensureString(quizSet.title, `${setLabel}.title`);
    ensure(Number.isInteger(quizSet.setNumber), `${setLabel}.setNumber must be an integer`);
    ensureString(quizSet.type, `${setLabel}.type`);
    ensure(Array.isArray(quizSet.questions), `${setLabel}.questions must be an array`);
    quizSet.questions.forEach((question, questionIndex) => {
      const questionLabel = `${setLabel}.questions[${questionIndex}]`;
      ensureString(question.type, `${questionLabel}.type`);
      ensureString(question.text, `${questionLabel}.text`);
      if (question.options != null) ensure(Array.isArray(question.options), `${questionLabel}.options must be an array when present`);
      if (question.explanation != null) ensureString(question.explanation, `${questionLabel}.explanation`);
      if (question.expectedOut != null) ensureString(question.expectedOut, `${questionLabel}.expectedOut`);
      if (question.correctOption != null) ensure(Number.isInteger(question.correctOption), `${questionLabel}.correctOption must be an integer`);
    });
  });
}

function validateLanguageContent(rootDir, lang) {
  const snippetFile = path.join(rootDir, 'packages', 'snippets-data', lang, 'snippets.json');
  const noteFile = path.join(rootDir, 'packages', 'curriculum-data', 'notes', `${lang}.json`);
  const lessonFile = path.join(rootDir, 'packages', 'curriculum-data', 'lessons', `${lang}.json`);
  const quizFile = path.join(rootDir, 'packages', 'curriculum-data', 'quizzes', `${lang}.json`);

  ensure(fs.existsSync(snippetFile), `Missing snippet file for ${lang}: ${snippetFile}`);
  ensure(fs.existsSync(noteFile), `Missing notes file for ${lang}: ${noteFile}`);

  const snippets = readJson(snippetFile);
  const notes = readJson(noteFile);

  ensure(Array.isArray(snippets), `${lang} snippets file must be an array`);
  ensure(Array.isArray(notes), `${lang} notes file must be an array`);
  ensure(snippets.length >= MIN_SNIPPETS_PER_LANGUAGE, `${lang} must have at least ${MIN_SNIPPETS_PER_LANGUAGE} snippets`);
  ensure(notes.length >= MIN_NOTES_PER_LANGUAGE, `${lang} must have at least ${MIN_NOTES_PER_LANGUAGE} notes`);

  snippets.forEach((snippet, index) => validateSnippet(snippet, `${lang}.snippets[${index}]`));
  notes.forEach((note, index) => validateNote(note, `${lang}.notes[${index}]`));

  if (fs.existsSync(lessonFile)) {
    validateLessonFile(readJson(lessonFile), `${lang}.lessons`);
  }

  if (fs.existsSync(quizFile)) {
    validateQuizFile(readJson(quizFile), `${lang}.quizzes`);
  }

  return {
    snippets: snippets.length,
    notes: notes.length,
    hasLessons: fs.existsSync(lessonFile),
    hasQuizzes: fs.existsSync(quizFile),
  };
}

function validateAllContent(rootDir = path.resolve(__dirname, '..', '..', '..')) {
  return LANGUAGES.map((lang) => ({
    language: lang,
    ...validateLanguageContent(rootDir, lang),
  }));
}

module.exports = {
  readJson,
  validateAllContent,
  validateLanguageContent,
};
