// app/api/analyze/route.ts
import handler from '../analyze';

export const runtime = 'node'; // keep Node runtime for supabase/openai
export async function POST(request: Request) {
  return handler(request);     // your existing code expects (req: Request)
}
