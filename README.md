# SLAPBOX

> Anyone can stream them. Prove you know them.

SLAPBOX turns fandom into something measurable and worth having. Fans sign up,
find the artists and brands they care about, play trivia minigames about them,
and climb a ranking system that unlocks rewards which never go public —
unreleased demos, studio footage, tour merch, signed vinyl, private events.

Artists and brands get the other half: a paying, verified audience they own,
with a share of every subscription routed to them by how much fans actually
engage.

**→ [docs/SETUP.md](docs/SETUP.md) to get it live.**

---

## The loop

```
   sign up (7-day trial)
        ↓
   find an artist  ──────────────┐
        ↓                        │
   play a minigame               │  6 modes: trivia, speed round,
        ↓                        │  lyric gap, cover art, deep cut,
   earn XP                       │  daily drop
        ↓                        │
   XP → level → RANK ────────────┤  7 ranks: Listener → Legend
        ↓                        │
   rank UNLOCKS the shelf        │  merch · audio · video · vinyl
        ↓                        │
   rank weights monthly DRAW ────┘  1x → 40x tickets by rank
```

**One currency: XP.** It is only ever earned, never spent. Rewards are not
bought — each one carries a level requirement, and reaching that rank makes it
claimable. Claiming the signed vinyl costs a fan nothing but the standing they
already built, so nobody is ever punished for taking what they earned.

Scarcity comes from `stock` and `per_fan_limit` rather than from a price.

## Two economies

**Fan → platform.** $4.99/month after a 7-day trial, billed through Stripe.

**Platform → artist.** Each fan's payment is split across the artists they
actually play, weighted by *affinity* — a counter that advances every time
they finish a round with that artist. Each artist then keeps their
`rev_share_pct` (default 50%) of the slice allocated to them. A fan who only
plays one artist sends their whole share there; a fan spread across six splits
six ways. Run monthly via `allocate_revenue()`.

## Ranks

| Rank | Level | Draw tickets |
|---|---|---|
| Listener | 1 | 1x |
| Supporter | 5 | 2x |
| Regular | 10 | 4x |
| Real One | 20 | 8x |
| Day One | 35 | 15x |
| Inner Circle | 50 | 25x |
| Legend | 70 | 40x |

XP curve is `50 × (level−1)^1.6`. A five-question round pays roughly 60–90 XP,
so Regular lands around 22 rounds in and Inner Circle is a genuine long haul.

Each artist's shelf ladders across those tiers: an unreleased demo at Listener,
a merch discount at Supporter, studio footage at Regular, the tour tee at Real
One, signed vinyl at Inner Circle.

---

## Security model

Progression is the attack surface: XP is the only thing standing between a fan
and real merchandise, so forged XP is forged merchandise. "Fan grants
themselves 100,000 XP" has to be structurally impossible, not merely
inconvenient.

**Every progression mutation is a `SECURITY DEFINER` Postgres function.** XP,
levels, streaks, claims and draw entries can only change through `start_game`,
`submit_answer`, `finish_game`, `claim_reward` and `enter_draw`. Each
re-derives the caller from `auth.uid()` and never trusts an ID passed in from
the client. `award_xp` is internal, with execute revoked from clients entirely.

**Row level security alone would not be enough.** A policy like
`id = auth.uid()` still permits `UPDATE fan_profiles SET xp = 999999` on your
own row, and `UPDATE profiles SET role = 'admin'` on yours. Postgres RLS cannot
restrict columns, so `0002_slapbox_rls.sql` revokes Supabase's default blanket
grants and re-grants column by column — fans can edit their city and display
name, and nothing else.

**Answer keys are unreachable.** `question_answers` is a separate table with
RLS enabled and *zero* policies and *zero* grants: every client read returns no
rows. The correct index is returned by `submit_answer` only after the fan's
choice has already been written, and the primary key on `session_answers` makes
re-answering impossible.

**Subscriptions are webhook-only.** Clients can read their subscription but
never write it, so subscriber-gated rewards cannot be self-granted.

**XP is append-only.** `award_xp` rejects any non-positive delta, and the
`xp_ledger` is never debited, so the rank ladder cannot be walked backwards.

Known limitation: `ms_taken` for speed-round bonuses is client-reported and
therefore spoofable. The bonus is capped at +50% of a question's base value, so
the ceiling on this exploit is small. Server-side timing would need per-question
issue timestamps.

---

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind
- **Supabase** — Postgres, Auth, RLS
- **Stripe** — subscriptions (optional; the app runs fully without it)
- **Recharts**, **lucide-react**

## Layout

```
app/
  page.tsx                    landing
  login/ join/ auth/callback/ real Supabase auth
  fan/                        the fan product
    page.tsx                  home: level, streak, your artists
    discover/                 browse and search artists
    a/[slug]/                 artist hub: minigames + their shelf
    play/[slug]/[kind]/       the game
    shop/ vault/ draws/       the shelf, claims, and monthly draws
    profile/ subscription/
  dashboard/                  artist console (still demo data)
  api/billing/                Stripe checkout, portal, webhook
components/fan/               game player, reward card, level bar
lib/
  supabase/                   browser, server and service-role clients
  game/progression.ts         XP curve and ranks, mirrored from SQL
supabase/migrations/          schema, RLS, engine — run in order
scripts/seed.mjs              20 demo artists, 300 questions, 120 rewards
docs/                         SETUP.md, SOCIAL-SETUP.md
```

## Demo artists

The 20 seeded accounts are **fictional characters** — invented names, cities and
discographies, mostly hip-hop and R&B with some pop. Putting a real recording
artist's name and likeness on an unclaimed account is impersonation, and the
takedown would land before launch. Each demo account converts to a real signed
artist by setting `artists.owner_id` and clearing `is_demo`; nothing else in
the schema changes.

Trivia is generated from each artist's canon (debut tape, breakout single,
producer, crew, ad-lib, venue), and wrong answers are drawn from *other*
artists' canon — so every distractor is plausible rather than obviously filler.

## Status

**Built and working:** fan signup and auth, artist discovery, all six minigames
with server-side grading, the XP economy with a full append-only audit ledger,
levels and ranks, the rank-gated reward shelf with stock and subscriber gating,
the Vault, rank-weighted monthly draws, trial subscriptions, Stripe checkout
and webhooks, and the revenue-split engine.

**Next:** the artist console still runs on mock data (`data/mockData.ts`) — it
needs wiring to the same tables so artists can author their own trivia, set the
rank gates on their shelf and fulfil claims. Social publishing is scaffolded but
needs platform credentials; see [docs/SOCIAL-SETUP.md](docs/SOCIAL-SETUP.md).

---

Developed by **GoKoncentrate**.
