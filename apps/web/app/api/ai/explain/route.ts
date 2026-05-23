import { NextResponse } from 'next/server';
import { explainCode } from '@codeforge/ai';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    const result = await explainCode(code, language);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
