import { NextRequest, NextResponse } from 'next/server';

// POST /api/contentlab/generate-seo-image
// Body: { industry: string, topic: string, selectedKeywords?: string[], selectedPhrase?: string, style?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, topic, selectedKeywords, selectedPhrase, style } = body;

    if (!industry || !topic) {
      return NextResponse.json({ error: 'industry and topic are required' }, { status: 400 });
    }

    // ── Step 1: Generate SEO + AEO keywords via Claude ──────────────────────
    const keywordPrompt = `You are a cultural SEO and AEO (Answer Engine Optimization) strategist for the ${industry} industry targeting urban and culturally-engaged audiences.

Generate for the topic: "${topic}"
- 10 high-impact SEO keywords (mix of street-level and search-optimized)
- 3 unique punchy cultural phrases that feel authentic, not corporate
- 3 AEO phrases formatted as direct answers (for AI search engines like Perplexity, ChatGPT, Google SGE)
- 5 hashtags sorted by cultural relevance

Return JSON only:
{
  "keywords": ["...", ...],
  "phrases": ["...", ...],
  "aeoAnswers": ["...", ...],
  "hashtags": ["...", ...]
}`;

    let keywords: string[] = [];
    let phrases: string[] = [];
    let aeoAnswers: string[] = [];
    let hashtags: string[] = [];

    if (process.env.ANTHROPIC_API_KEY) {
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: [
            {
              type: 'text',
              text: 'You are a cultural intelligence and SEO/AEO expert. Return only valid JSON — no markdown, no explanation.',
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: keywordPrompt }],
        }),
      });

      if (claudeRes.ok) {
        const data = await claudeRes.json();
        const text = data.content?.[0]?.text ?? '{}';
        try {
          const parsed = JSON.parse(text);
          keywords = parsed.keywords ?? [];
          phrases = parsed.phrases ?? [];
          aeoAnswers = parsed.aeoAnswers ?? [];
          hashtags = parsed.hashtags ?? [];
        } catch {
          // fallback to empty — handled below
        }
      }
    }

    // ── Step 2: Build image prompt from selected keywords ───────────────────
    const kws = selectedKeywords?.length ? selectedKeywords : keywords.slice(0, 3);
    const phrase = selectedPhrase ?? phrases[0] ?? topic;

    const imagePrompt = `Create a ${style ?? 'cinematic'} style promotional image for a ${industry} brand.
Prominently feature these keywords as styled text overlays: ${kws.join(', ')}.
Main phrase: "${phrase}".
The image must feel authentic, culturally resonant, and street-credible — not corporate.
Visually striking, high-contrast, social-media ready. 16:9 aspect ratio.`;

    let imageUrl: string | null = null;

    if (process.env.OPENAI_API_KEY) {
      const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1792x1024',
          quality: 'hd',
        }),
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        imageUrl = imgData.data?.[0]?.url ?? null;
      }
    }

    return NextResponse.json({
      keywords,
      phrases,
      aeoAnswers,
      hashtags,
      imageUrl,
      promptUsed: imagePrompt,
    });
  } catch (err) {
    console.error('[generate-seo-image]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
