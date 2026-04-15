import { NextRequest, NextResponse } from 'next/server';

// POST /api/contentlab/generate-thumbnail
// Body: { videoTitle: string, videoDesc?: string, energyStyle: string, palette: string, hasPhoto?: boolean }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoTitle, videoDesc, energyStyle, palette, hasPhoto } = body;

    if (!videoTitle) {
      return NextResponse.json({ error: 'videoTitle is required' }, { status: 400 });
    }

    const basePrompt = `Create a YouTube thumbnail for a video titled: "${videoTitle}".
Style: ${energyStyle}. Color palette: ${palette}.
Include bold, readable text overlay with the key hook from the title.
${hasPhoto ? 'Incorporate a dynamic pose with an expressive face — high energy.' : ''}
${videoDesc ? `Video context: ${videoDesc}` : ''}
Make it optimized for click-through at small size. 1280x720.
High contrast, professional, visually loud, and culturally authentic.`;

    const variations = [
      `${basePrompt} Composition: text dominance — headline fills 60% of frame, bold and punchy.`,
      `${basePrompt} Composition: imagery dominance — visual impact leads, compact bold title bottom-left.`,
      `${basePrompt} Composition: balanced split — subject left, title right, clean dividing line.`,
    ];

    const imageUrls: (string | null)[] = [null, null, null];

    if (process.env.OPENAI_API_KEY) {
      const results = await Promise.allSettled(
        variations.map(prompt =>
          fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt,
              n: 1,
              size: '1792x1024',
              quality: 'standard',
            }),
          }).then(r => r.json())
        )
      );

      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          imageUrls[i] = result.value?.data?.[0]?.url ?? null;
        }
      });
    }

    return NextResponse.json({
      variations: [
        { id: 1, focus: 'Text Dominant', imageUrl: imageUrls[0] },
        { id: 2, focus: 'Image Dominant', imageUrl: imageUrls[1] },
        { id: 3, focus: 'Balanced', imageUrl: imageUrls[2] },
      ],
    });
  } catch (err) {
    console.error('[generate-thumbnail]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
