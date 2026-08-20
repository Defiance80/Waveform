# Social platforms: getting real API access

You asked to reach fans on Twitter/X, Instagram, Facebook and more. This
document covers what is actually possible, what it costs, how long approval
takes, and — importantly — what will get your app permanently banned.

---

## Read this first: what is and is not allowed

SLAPBOX is built to do the first column. It deliberately does not do the second.

| Supported — and durable | Not built — and why |
|---|---|
| Posting to **your own** connected accounts via official APIs | Auto-tagging users who have not opted in. Meta and X both class this as spam; it is the single fastest route to a permanent app ban. |
| Scheduling posts across platforms from one console | Bot-posting into Facebook Groups. The Groups API was closed to this in 2020 and no replacement exists. |
| Replying to comments on your own posts | Unsolicited bulk DMs. Explicitly prohibited by every platform here. |
| Fan discovery through **opt-in**: signup, referral codes, campaign links, QR at shows | Scraping follower lists to build a contact database. Breaches platform terms and, in the EU/UK/California, data protection law. |
| Retargeting people who already engage with you, through the platforms' own ad tools | Buying or renting fan lists. |

This is not caution for its own sake. Automated tagging and group-posting are
the two behaviours that get music-marketing tools killed, and losing API access
takes the whole publishing feature with it. The opt-in path is slower for the
first hundred fans and dramatically better after that, because the fans you
collect are yours — in your database, reachable without a platform's
permission.

**The fan side of SLAPBOX already is your discovery engine.** A fan who signs
up, follows an artist, and plays trivia has given you an email address, a
verified interest and an engagement history. That is worth more than a tagged
stranger who never opted in.

---

## X (Twitter)

**Cost:** Free tier cannot post. **Basic is $100/month** for 3,000 posts/month.
**Time to access:** minutes once you pay.

1. [developer.x.com](https://developer.x.com) → sign up with the account that
   will own the app.
2. Create a Project and an App.
3. **User authentication settings** → enable OAuth 2.0, type **Web App**,
   callback `https://yourdomain.com/api/social/callback/x`.
4. Scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`.
5. Copy Client ID and Client Secret into `X_CLIENT_ID` / `X_CLIENT_SECRET`.

---

## Meta (Instagram + Facebook)

**Cost:** Free. **Time to access:** 1–4 weeks for App Review — start this first.

Requirements before you begin:
- A Facebook Page for the artist/brand.
- An Instagram **Business or Creator** account, linked to that Page. Personal
  Instagram accounts cannot post via API, full stop.

1. [developers.facebook.com](https://developers.facebook.com) → **My Apps** →
   **Create App** → type **Business**.
2. Add the **Instagram Graph API** and **Facebook Login** products.
3. OAuth redirect: `https://yourdomain.com/api/social/callback/meta`.
4. Permissions to request in App Review:
   `instagram_basic`, `instagram_content_publish`,
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
5. App Review needs a screencast of the real flow and a written explanation of
   each permission. Record it against your deployed app, not localhost.
6. Copy App ID and App Secret into `META_APP_ID` / `META_APP_SECRET`.

**Instagram limits worth knowing:** 25 API posts per account per 24 hours;
images must be public URLs (not uploads); Stories and Reels have separate
endpoints with their own rules.

---

## TikTok

**Cost:** Free. **Time to access:** 1–2 weeks.

1. [developers.tiktok.com](https://developers.tiktok.com) → register.
2. Create an app, add **Content Posting API** and **Login Kit**.
3. Redirect: `https://yourdomain.com/api/social/callback/tiktok`.
4. Scopes: `user.info.basic`, `video.publish`.
5. Copy into `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET`.

Note: unaudited TikTok apps can only post **private** videos. Public posting
requires passing their content review.

---

## YouTube

**Cost:** Free. **Time to access:** immediate for testing, ~2–4 weeks for
verification.

1. [console.cloud.google.com](https://console.cloud.google.com) → new project.
2. Enable **YouTube Data API v3**.
3. **Credentials** → OAuth client ID → Web application.
4. Redirect: `https://yourdomain.com/api/social/callback/youtube`.
5. Scope: `https://www.googleapis.com/auth/youtube.upload`.
6. Copy into `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET`.

The default quota of 10,000 units/day allows roughly **6 uploads per day**
(1,600 units each). Request more via the quota extension form.

---

## Recommended order

Approval time, not effort, should drive your sequence:

1. **Meta today** — longest review, and Instagram is where music fans are.
2. **X when you are ready to pay** — instant, but $100/month is real money for
   a pre-revenue product. It can wait until you have subscribers.
3. **TikTok next** — moderate review, strong discovery for new artists.
4. **YouTube last** — easiest, lowest urgency for short-form promotion.

---

## Where this plugs in

The schema is already in place:

- `social_accounts` — one row per (artist, platform). Holds the OAuth tokens.
  **RLS grants no client SELECT at all**, so access tokens can never be read
  from a browser. The artist console reads connection status through the
  `social_connections` view, which excludes token columns.
- `social_posts` — the post queue: `draft` → `scheduled` → `posted` / `failed`,
  with the remote post ID and URL written back on success.

The existing `app/api/contentlab/publish-post/route.ts` already tailors caption
copy per platform with Claude, and marks exactly where the real platform call
goes. Once credentials exist, that stub becomes a live dispatch.

Callback routes to add when you have credentials:

```
app/api/social/connect/[platform]/route.ts    -- start OAuth
app/api/social/callback/[platform]/route.ts   -- exchange code, store tokens
app/api/social/publish/route.ts               -- dispatch to platform APIs
```
