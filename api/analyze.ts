// api/analyze.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, attachments } = (req.body ?? {}) as {
      prompt?: string
      attachments?: Array<{ name: string; text: string }>
    }
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' })
    }

    const client = new OpenAI({ apiKey: requireEnv('OPENAI_API_KEY') })

    const merged = [
      prompt.trim(),
      ...(Array.isArray(attachments)
        ? attachments.map(a => `\n\n[ATTACHMENT: ${a.name}]\n${a.text ?? ''}`)
        : []),
    ].join('')

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are MaverickAI Enigma Radar. Be concise and precise.' },
        { role: 'user', content: merged },
      ],
    })

    const text = completion.choices?.[0]?.message?.content ?? ''
    return res.status(200).json({ ok: true, text })
  } catch (err: any) {
    console.error('API /analyze error:', err)
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}
