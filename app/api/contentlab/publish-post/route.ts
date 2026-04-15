import { NextRequest, NextResponse } from 'next/server';

// POST /api/contentlab/publish-post
// Body: { imageUrl: string, rawCaption: string, platforms: string[], scheduleTime?: string, industry?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, rawCaption, platforms, scheduleTime, industry = 'Music' } = body;

    if (!imageUrl || !rawCaption || !platforms?.length) {
      return NextResponse.json({ error: 'imageUrl, rawCaption, and platforms are required' }, { status: 400 });
    }

    // ── Tailor captions per platform via Claude ──────────────────────────────
    const tailoredCaptions: Record<string, string> = {};

    if (process.env.ANTHROPIC_API_KEY) {
      const captionPrompt = `Rewrite this caption for each social media platform listed below.
Raw caption: "${rawCaption}"
Industry context: ${industry}

Platform-specific rules:
- instagram: 150 words max, culturally authentic, add 5 relevant hashtags, 2-3 emojis, line breaks
- twitter: 240 chars max, 2 hashtags, punchy hook first, street-authentic voice
- linkedin: professional but not corporate, 100 words max, remove slang, end with a call to action
- facebook: conversational, 200 words max, personal and relatable
- tiktok: energetic, open with a hook question, 3 trending hashtags, feel authentic not branded
- youtube: community post style, warm and grateful, no hashtags needed

Return JSON only:
{
  "instagram": "...",
  "twitter": "...",
  "linkedin": "...",
  "facebook": "...",
  "tiktok": "...",
  "youtube": "..."
}`;

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
          max_tokens: 2048,
          system: [
            {
              type: 'text',
              text: 'You are a cultural content strategist. Tailor captions to sound authentic and platform-native. Return only valid JSON.',
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: captionPrompt }],
        }),
      });

      if (claudeRes.ok) {
        const data = await claudeRes.json();
        const text = data.content?.[0]?.text ?? '{}';
        try {
          Object.assign(tailoredCaptions, JSON.parse(text));
        } catch {
          // fall through to platform defaults
        }
      }
    }

    // Fallback captions if Claude unavailable
    platforms.forEach((p: string) => {
      if (!tailoredCaptions[p]) tailoredCaptions[p] = rawCaption;
    });

    // ── Dispatch to platforms ────────────────────────────────────────────────
    const results: { platform: string; status: 'live' | 'scheduled' | 'failed'; postUrl?: string; error?: string }[] = [];

    for (const platform of platforms) {
      try {
        if (scheduleTime) {
          // Queue for scheduled delivery — in production: save to DB, run via cron
          results.push({ platform, status: 'scheduled' });
        } else {
          // Production: call real platform API here using stored OAuth tokens
          // await publishToPlatform(platform, imageUrl, tailoredCaptions[platform], tokens[platform]);
          results.push({ platform, status: 'live', postUrl: `https://${platform}.com/mock` });
        }
      } catch (platformErr) {
        results.push({ platform, status: 'failed', error: String(platformErr) });
      }
    }

    return NextResponse.json({ results, tailoredCaptions });
  } catch (err) {
    console.error('[publish-post]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
