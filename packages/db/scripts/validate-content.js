const path = require('path');
const { validateAllContent } = require('./content-validator');

function main() {
  const rootDir = path.resolve(__dirname, '..', '..', '..');
  const results = validateAllContent(rootDir);

  for (const result of results) {
    console.log(
      `${result.language}: ${result.snippets} snippets, ${result.notes} notes, lessons=${result.hasLessons}, quizzes=${result.hasQuizzes}`,
    );
  }

  console.log(`Validated ${results.length} languages.`);
}

main();
