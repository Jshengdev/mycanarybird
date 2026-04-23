# Track: Copy Polish

> First, read `CLAUDE.md` at the project root. It has the shared context, product voice, and guardrails.

## Mission

Make every word on the page accurately reflect what a thoughtful reader is already thinking. Canary is a safety net for computer-use agents. The audience is engineers shipping autonomous software that takes real actions on real screens — they are wary, technical, and allergic to marketing slop. Your job is to cut anything that sounds like it came from a landing-page generator and sharpen the parts that do real work.

## Files you own

- Any `.tsx` file with user-visible strings. Examples of where copy lives:
  - `src/components/landing/Hero.tsx` — headline, subtitle, CTAs, `LiveIndicator label`
  - `src/components/landing/EcosystemBar.tsx` — label text
  - `src/components/landing/Reel/Frame{Observe,Control,Improve}.tsx` — frame label, headline, body, stat caption, code snippet text, log rows, suggested rule names/reasons/confidences
  - `src/components/landing/UseCases/useCaseData.ts` — tab names, problem/save/quote/visualHint for each of the 4 use cases
  - `src/components/landing/Closer.tsx` — "agents in the mine" headline
  - `src/components/landing/EarlyAccessForm.tsx` — labels, placeholders, success/error messages, footnote
  - `src/components/canary-watch/SessionLog.tsx` — title, subheadline, stats labels ("Events observed", "Attention score", etc.)
  - `src/components/canary-watch/useInputTracker.ts` — event log strings (`CLICK target=...`, `KEY Tab`, `RIGHT-CLICK target=... · unusual`, etc.)
  - `src/app/layout.tsx` — `metadata` title + description
  - `src/app/about/page.tsx`, `blog/`, `features/` — placeholder page copy
- Site-wide metadata and `<title>` strings

## Files you do NOT touch

- Any `.module.css` — `ui` track
- `src/components/canary-watch/CanaryMascot.tsx`, `context.tsx`, `useCanarySection.ts` — `bird` track
- Structural JSX (components, props, logic) — leave structure alone; only change the text the reader sees

## Voice anchors

- **Direct.** A single declarative sentence is better than a balanced-clause sentence.
- **Concrete.** Name the thing. "Agent sent 12 emails in 3 minutes" beats "prevent anomalous send patterns."
- **Specific numbers over round ones.** `47.2%` is more alive than `50%`. `14:23:18` is alive; `14:23` is dead. If a stat is rounded, it should be a real benchmark with a citation, not marketing inflation.
- **Zero filler.** Banned words: *Elevate, Seamless, Unleash, Revolutionize, Empower, Next-gen, Enterprise-grade, Cutting-edge, State-of-the-art, Game-changing, Robust.*
- **Zero hedging.** "We believe" / "we aim to" / "designed to" — cut them. State what the product does.
- **Tone**: a security-minded senior engineer explaining to another. Dry, a little wry, never cutesy. The "canary in the mine" metaphor runs through the whole page — respect it; don't overuse it.
- **No emoji.** No exclamation points except where genuinely earned by the punchline.

## Audit passes to run

1. **The "who cares" pass**: every sentence should either (a) earn a reader's belief, (b) tell them what the product does, or (c) tell them what to do next. If it does none, cut it.
2. **The "what do they already know" pass**: don't explain things a computer-use engineer already understands (what an LLM is, why agents are risky in general). Assume expertise.
3. **The consistency pass**: Do we call them "agents," "autonomous agents," or "computer-use agents"? Pick one primary term per section and stick to it.
4. **The callout pass**: stats. Each stat needs a real source or feels like it does. `88% of organizations report agent security incidents` needs to read like a cited fact, not a made-up number. Propose citations or swap to a number we can defend.
5. **The punchline pass**: the last line of each section should give the reader a reason to move to the next one. Scan the last sentences top-to-bottom.
6. **The mascot log pass**: the `SessionLog` event strings are a joke — they need to read like a real Canary dashboard output while landing the "we're watching you right now" bit. Audit `useInputTracker.ts` formatters.

## Concrete candidates to consider (you decide which are wins)

- Hero subtitle: "A drop-in SDK that sees every action, blocks every mistake, and learns your agent" — "blocks every mistake" is an overpromise. Something like "blocks the dangerous ones" or "blocks the ones you tell it to." You pick.
- Reel Observe body: "Canary sees the screen" line is already good, don't weaken it. The rest of the paragraph might be trimmable.
- Reel Control stat: `88% of organizations report agent security incidents` — sourced? If Anthropic State of AI or similar, cite inline. If not, replace with a stat we can stand behind.
- Reel Improve stat: `90% lower visual processing cost than text-only QA tools` — who measured? What baseline? Either cite or replace.
- UseCases quotes: check each `quote.attribution` — realistic, specific, believable name + role + company pattern. No "John Doe, CTO, Acme" vibes.
- Closer: "The agents are already in the mine. We are the canary." — very good. Don't mess with it.
- EarlyAccessForm success body: "Meanwhile, the mine is full of agents — stay careful out there." — good, keep the metaphor.
- Session log `sub`: "Same action log we'd show you for a real agent session. Except the agent is you, and what you clicked was this page." — very good.
- About / Blog / Features placeholder pages — decide if they should go live with real copy or stay as stubs.

## Technical constraints

- Most strings are inline JSX — keep the JSX structure (wrappers, `<br/>`, `<em>`, etc.) unless the wrapper is purely there to style a specific span that copy changes no longer need.
- TypeScript strict — text changes rarely break types, but if you remove a prop consumer (e.g., `stat` becomes optional somewhere), propagate through.
- A11y: don't break `aria-label`, `aria-labelledby`, or `alt` text while you're in there.

## Test loop

1. Dev server at `localhost:3000` (shared). HMR reflects changes instantly.
2. Read the page top to bottom. Out loud, once. If a sentence trips you, it's wrong.
3. Before commit: `npx tsc --noEmit`.
4. Commit small. Convention: `polish(copy): <concern>`. Example: `polish(copy): sharpen Hero subtitle and cut "every mistake" overpromise`.
5. Push to `feat/landing-redesign`.

## Rules of engagement

- **Do not** touch CSS or styling.
- **Do not** touch mascot behavior.
- **Do not** add new words without removing two. Brevity wins.
- **Do not** introduce emoji.
- **Do not** rewrite the "agents in the mine" metaphor — it's the page's emotional spine.
- When you change a stat, leave a `TODO(source):` comment next to it so engineering can back it with a real number/link before the next prod push.

## Initial prompt to paste in your Claude session

```
I'm running the copy-writing polish track for the Canary landing page.

Read CLAUDE.md at the project root and docs/polish/copy.md for my full brief.

First task: walk the page (localhost:3000) section by section and give me a punch-list of copy issues — marketing slop, weak verbs, unsubstantiated stats, overpromises, voice inconsistencies, and anything that sounds generic. Rank them high/medium/low impact with a one-line reason each. Also flag the event-log strings in useInputTracker.ts and SessionLog.tsx. Do not start editing yet — I want to review the punch-list and pick the top 5-8 before any changes land.

Don't touch CSS or the canary-watch mascot behavior.
```
