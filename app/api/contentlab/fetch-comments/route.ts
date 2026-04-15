import { NextRequest, NextResponse } from 'next/server';

// GET /api/contentlab/fetch-comments?userId=...&platforms=instagram,youtube
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platforms = searchParams.get('platforms')?.split(',') ?? ['instagram', 'youtube', 'twitter'];

    // ── In production: fetch from each platform API using stored OAuth tokens ─
    // const tokens = await getSocialTokens(userId);
    // const comments = await Promise.all(platforms.map(p => fetchCommentsForPlatform(p, tokens[p])));

    // Placeholder: return empty array — real data comes from platform APIs
    const rawComments: { id: string; platform: string; text: string; username: string; postId: string }[] = [];

    if (rawComments.length === 0) {
      return NextResponse.json({ comments: [], message: 'No comments fetched — connect platforms first.' });
    }

    // ── Classify comments via Claude ─────────────────────────────────────────
    let classified = rawComments;

    if (process.env.ANTHROPIC_API_KEY && rawComments.length > 0) {
      const classifyPrompt = `Classify each comment. Return a JSON array with these fields per item:
id, sentiment ("positive"|"neutral"|"negative"), intent ("question"|"admiration"|"connection"|"spam"|"cynical"|"other"), isEligibleForReply (true only if genuinely inquisitive or positively substantive — not spam, not purely cynical).

Comments:
${JSON.stringify(rawComments.map(c => ({ id: c.id, text: c.text })))}

Return only the JSON array.`;

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
              text: 'You are a sentiment and intent classifier. Return only valid JSON arrays.',
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: classifyPrompt }],
        }),
      });

      if (claudeRes.ok) {
        const data = await claudeRes.json();
        const text = data.content?.[0]?.text ?? '[]';
        try {
          const classificationMap = new Map(
            (JSON.parse(text) as { id: string; sentiment: string; intent: string; isEligibleForReply: boolean }[])
              .map(c => [c.id, c])
          );
          classified = rawComments.map(c => ({
            ...c,
            ...(classificationMap.get(c.id) ?? {}),
          }));
        } catch {
          // classification failed — return raw comments
        }
      }
    }

    return NextResponse.json({ comments: classified });
  } catch (err) {
    console.error('[fetch-comments]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
