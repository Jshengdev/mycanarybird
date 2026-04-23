# mycanarybird

Marketing landing page for **Canary** — a QA/observability SDK for computer-use AI agents.

Live: https://mycanarybird.com

## Stack

Next.js 16 (App Router) · React 18 · Framer Motion · GSAP · CSS Modules · next/font

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npx tsc --noEmit     # type check
```

## Layout

```
src/
  app/                # routes + globals.css (design tokens)
  components/
    landing/          # Hero, Reel, UseCases, Closer, etc.
    canary-watch/     # mascot system (the bird)
    nav/ ui/          # nav + shared primitives
public/
  demo/               # static export of the /demo dashboard
docs/
  design-system.md    # Figma-extracted tokens & components
  polish/             # track briefs (ui, copy, bird)
```

## Deploy

Hosted on Vercel (project `mycanarybird`). Push to `main` → preview; promote manually or `vercel --prod`.

## Conventions

See `CLAUDE.md` for design tokens, mascot behavior, polish track boundaries, and guardrails.
