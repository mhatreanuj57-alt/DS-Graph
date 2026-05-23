import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const explainCode = async (code: string, language: string) => {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Explain the following ${language} code line-by-line in plain English:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
  });
  return response.content[0];
};

export const fixCode = async (code: string, error: string, language: string) => {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `I have the following ${language} code that is producing this error:\n\nError: ${error}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nPlease provide a fixed version of the code and a brief explanation of what was wrong.`,
      },
    ],
  });
  return response.content[0];
};
