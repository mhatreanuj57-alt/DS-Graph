import { Router } from 'express';
import axios from 'axios';
import { z } from 'zod';

const router = Router();

const executeSchema = z.object({
  language_id: z.number(),
  source_code: z.string(),
  stdin: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const { language_id, source_code, stdin } = executeSchema.parse(req.body);

    const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.sulu.sh';
    const JUDGE0_API_TOKEN = process.env.JUDGE0_API_TOKEN;

    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions?wait=true`,
      {
        language_id,
        source_code: Buffer.from(source_code).toString('base64'),
        stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Judge0-Token': JUDGE0_API_TOKEN,
        },
      }
    );

    const result = response.data;
    
    // Decode base64 outputs
    if (result.stdout) result.stdout = Buffer.from(result.stdout, 'base64').toString();
    if (result.stderr) result.stderr = Buffer.from(result.stderr, 'base64').toString();
    if (result.compile_output) result.compile_output = Buffer.from(result.compile_output, 'base64').toString();

    res.json(result);
  } catch (error: any) {
    console.error('Execution error:', error.message);
    res.status(500).json({ error: 'Code execution failed', details: error.message });
  }
});

export default router;
