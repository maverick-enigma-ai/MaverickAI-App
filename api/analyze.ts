// api/analyze.ts
import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { prompt, attachments } = body as {
      prompt?: string;
      attachments?: Array<{ name: string; text: string }>;
    };

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const client = new OpenAI({ apiKey });

    const merged = [
      prompt.trim(),
      ...(Array.isArray(attachments)
        ? attachments.map(a => `\n\n[ATTACHMENT: ${a.name}]\n${a.text ?? ''}`)
        : []),
    ].join('');

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are MaverickAI Enigma Radar. Be concise and precise.' },
        { role: 'user', content: merged },
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ ok: true, text });
  } catch (err: any) {
    console.error('API /analyze error:', err);
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
