# Getting SLAPBOX live

Start to finish this is about 30 minutes, most of it waiting on Supabase to
provision. Nothing here needs a credit card except the optional Stripe step.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. **New project** → name it `slapbox`, pick a region near your fans, and set a
   database password (save it somewhere; you will rarely need it).
3. Wait for provisioning (~2 minutes).

## 2. Run the migrations

In the Supabase dashboard, open **SQL Editor** → **New query**. Paste and run
each file **in order**, one at a time:

| Order | File | What it does |
|---|---|---|
| 1 | `supabase/migrations/0001_slapbox_core.sql` | Tables, enums, indexes |
| 2 | `supabase/migrations/0002_slapbox_rls.sql` | Row level security + column grants |
| 3 | `supabase/migrations/0003_slapbox_engine.sql` | Game engine functions |

Each should report `Success. No rows returned`. If you have the Supabase CLI
installed you can instead run `supabase db push` from the project root.

> **Why three files:** the second one is the security boundary. It revokes
> Supabase's default "authenticated can do anything" grants and re-grants
> column by column, so a fan cannot inflate their own XP or promote themselves
> to admin from the browser console. Since XP is the only thing gating real
> merchandise, forged XP would be forged merchandise.

## 3. Wire up the environment

Copy `.env.example` to `.env.local`, then fill in the Supabase values from
**Project Settings → API**:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` **(secret)** |

⚠️ The service role key bypasses all security rules. It must never appear in
client code, never be prefixed with `NEXT_PUBLIC_`, and never be committed.

## 4. Configure auth

**Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` while developing, your real domain later.
- **Redirect URLs**: add `http://localhost:3000/auth/callback` and
  `https://yourdomain.com/auth/callback`.

**Authentication → Providers → Email**: leave "Confirm email" on for
production. For faster local testing you can turn it off, and signup will drop
you straight into the app.

## 5. Seed the 20 demo artists

```bash
npm install
npm run seed
```

You should see twenty artists listed, each with questions and rewards:

```
Nyla Frost           15 questions  6 rewards
Trey Marlo           15 questions  6 rewards
...
Done. 300 questions, 120 rewards, 20 open draws.
```

`npm run seed` is safe to re-run. Artists upsert on slug, questions and rewards
rebuild — except rewards that already have claims against them, which are left
alone so you never destroy a fan's redemption history.

## 6. Run it

```bash
npm run dev
```

Open <http://localhost:3000>, hit **Become a superfan**, and create an account.
The signup trigger provisions your profile, fan game state and a 7-day trial in
a single transaction. You start at level 1, Listener, with zero XP — rank is
only ever earned.

**Walk the loop end to end:** Discover → pick an artist → Follow → play *Know
Your Artist* → watch XP land and the level bar move → open the artist's shelf →
claim the unreleased demo (unlocked at level 1) → check your Vault for the claim
code.

To see the rank gates work, keep playing. The merch discount opens at level 5
(Supporter), studio footage at 10 (Regular), the tour tee at 20 (Real One). The
round summary calls out anything a level-up just unlocked.

---

## 7. Deploy to Vercel

1. Push to GitHub (the repo is already `Defiance80/Waveform`).
2. At [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Add every variable from `.env.local` under **Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g.
   `https://slapbox.vercel.app`).
5. Deploy.
6. Go back to Supabase → **Authentication → URL Configuration** and add the
   production domain to Site URL and Redirect URLs. Auth emails will link to
   the wrong host until you do.

---

## 8. Turn on billing (optional)

Everything works without this — trials run, fans play, and XP, ranks and reward
claims all function. No card is charged until Stripe is connected.

1. Create a [Stripe](https://stripe.com) account.
2. **Products → Add product**: "SLAPBOX Superfan", recurring, $4.99/month.
   Copy the **price ID** (`price_...`) into `STRIPE_PRICE_ID`.
3. **Developers → API keys**: copy the secret key into `STRIPE_SECRET_KEY`.
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://yourdomain.com/api/billing/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`,
     `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

Test locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

The webhook is the **only** thing that can move a subscription into a paid
state. Clients can read subscriptions but never write them, so a fan cannot
grant themselves subscriber-only rewards.

---

## 9. Monthly operations

Two jobs want to run on a schedule. Both are database functions that only the
service role may execute.

**Split subscription revenue across artists** (run on the 1st):

```sql
select allocate_revenue(date_trunc('month', now() - interval '1 month')::date);
```

Each fan's payment is divided across the artists they actually played,
weighted by affinity; each artist then keeps their `rev_share_pct` of that
slice. Results land in `revenue_splits` and `artist_payouts`.

**Pick draw winners** (run when a draw closes):

```sql
select run_draw(id) from draws
 where drawn_at is null and closes_at < now();
```

This picks a weighted-random winner and writes an approved redemption straight
into the winner's Vault.

Schedule both with Supabase's `pg_cron` extension (**Database → Extensions →
enable `pg_cron`**), or from any external scheduler that can hit the database.

> **Before running public prize draws:** a rank-weighted draw tied to a paid
> subscription is legally a sweepstakes in the US. Every draw is flagged
> `is_sweepstakes = true` and `enter_draw(draw_id, p_free => true)` provides a
> free-entry (AMOE) path that always carries exactly one ticket. Get the rules
> reviewed for the states you operate in before you promote a draw publicly.

---

## Troubleshooting

**"relation does not exist"** — a migration did not run. Re-run them in order.

**Signup succeeds but the app redirects to /login** — the `handle_new_user`
trigger did not fire. Check **Database → Triggers** for `on_auth_user_created`
on `auth.users`, and re-run `0003_slapbox_engine.sql` if it is missing.

**"no questions available for this game yet"** — run `npm run seed`. Not every
artist has questions in every mode; modes without questions render greyed out
on the artist page rather than failing.

**XP does not move after a round** — XP commits on `finish_game`, not per
question. Abandoning a round mid-way forfeits it by design.

**A reward stays locked after levelling up** — the shelf reads
`fan_profiles.level`, which `finish_game` recalculates. Reload the page; the
round summary also lists everything the level-up just opened.

**Fan can see the answer key** — they cannot. `question_answers` has RLS
enabled with zero policies and zero grants, so every client read returns no
rows. The correct index is only revealed in the `submit_answer` response,
after the choice is already recorded.
