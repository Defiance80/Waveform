import { notFound } from 'next/navigation';
import { GamePlayer } from '@/components/fan/GamePlayer';
import { GAME_MODES } from '@/lib/game/progression';
import type { GameKind } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function PlayPage({ params }: { params: { slug: string; kind: string } }) {
  if (!GAME_MODES.some((m) => m.kind === params.kind)) notFound();
  return <GamePlayer slug={params.slug} kind={params.kind as GameKind} />;
}
