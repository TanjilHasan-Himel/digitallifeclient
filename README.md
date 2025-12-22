# Digital Life Lessons — Client (React + Vite)

Live Site: https://your-live-site-url.example.com

Digital Life Lessons is a platform to capture, organize, and share meaningful life lessons. Users can create lessons (Public/Private), mark favorites, and browse community wisdom. Premium users unlock premium lessons and extra features.

## Highlights

- Clean, reload-safe routing with protected dashboard and details pages
- Free vs Premium model with live Stripe Checkout (test mode) integration
- Public lessons with search, filter (category/tone), sort, and pagination
- Premium gating: blurred/locked cards with clear Upgrade CTA for free users
- Full dashboard suite: My Lessons, Favorites, Profile, Admin tools (MVP)

## Core Pages

- Home (Hero slider, Featured Lessons, Top Contributors, Most Saved)
- Public Lessons (search, filter, sort, pagination)
- Pricing/Upgrade (comparison + Stripe checkout)
- Dashboard (Add Lesson, My Lessons, Favorites, Profile)
- Lesson Details (comments, favorites, like, report, share)

## Getting Started

1. Copy `.env.example` to `.env` and set `VITE_API_BASE` to your server URL
2. Install deps and run dev server

```bash
npm install
npm run dev
```

For production, ensure your domain is authorized in Firebase and CORS.
