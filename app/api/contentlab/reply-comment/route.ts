import { NextRequest, NextResponse } from 'next/server';

// POST /api/contentlab/reply-comment
// Body: { commentId: string, commentText: string, platform: string, postContext: string, autoSend?: boolean }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { commentId, commentText, platform, postContext, autoSend = false } = body;

    if (!commentId || !commentText || !platform) {
      return NextResponse.json({ error: 'commentId, commentText, and platform are required' }, { status: 400 });
    }

    // ── Generate reply via Claude ────────────────────────────────────────────
    let replyText = '';

    if (process.env.ANTHROPIC_API_KEY) {
      const replyPrompt = `You are replying on behalf of Kendrick Cole, a Hip-Hop artist from Los Angeles, CA.

The original post was about: "${postContext ?? 'new music release'}"

A fan/follower commented: "${commentText}"

Write a genuine, conversational reply (1–3 sentences max).
Rules:
- Sound like a real person, not a brand or PR team
- Be warm, specific to what they said, and authentic
- Do NOT use generic phrases like "Thanks for the love!" or "Really appreciate it!"
- Match the energy and tone of the comment
- No hashtags in the reply
- Street-authentic but approachable

Return only the reply text — nothing else.`;

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
          max_tokens: 256,
          system: [
            {
              type: 'text',
              text: 'You are a culturally-aware community manager. Write authentic, human replies — never corporate or generic.',
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: replyPrompt }],
        }),
      });

      if (claudeRes.ok) {
        const data = await claudeRes.json();
        replyText = data.content?.[0]?.text?.trim() ?? '';
      }
    }

    if (!replyText) {
      return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
    }

    // ── Post reply to platform (production) ──────────────────────────────────
    let postStatus: 'draft' | 'sent' = 'draft';

    if (autoSend) {
      // Production: call platform API to post reply
      // await postReplyToPlatform(platform, commentId, replyText, tokens[platform]);
      postStatus = 'sent';
    }

    // Log to comment_log table (production: save to DB)
    // await db.comment_log.create({ ... })

    return NextResponse.json({
      commentId,
      replyText,
      status: postStatus,
    });
  } catch (err) {
    console.error('[reply-comment]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
