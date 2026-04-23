# Canary — Logo

## Source file

The canonical logo lives at:
  canary-design-system/canarylogo.svg

This is the single source of truth for the Canary logo.
Never recreate the logo in code, never use text or Unicode
characters (like ◆ or the word CANARY) as a substitute
where the actual SVG logo is called for.

## Usage rule

Whenever a logo is needed in the dashboard, use the SVG directly:

```tsx
import CanaryLogo from '@/canary-design-system/canarylogo.svg'

// As an img tag (recommended for Next.js):
<img src="/canarylogo.svg" alt="Canary" />

// Or as an inline SVG component if the file is exported as a React component
```

Place canarylogo.svg in the Next.js public/ directory so it is
accessible at /canarylogo.svg from anywhere in the app.
Copy it: cp canary-design-system/canarylogo.svg public/canarylogo.svg

## Where the logo appears

Use the SVG logo in every location where a Canary logo or
wordmark is meant to appear:

| Location | Component file | What to render |
|---|---|---|
| Sidebar top | src/components/layout/Sidebar.tsx | Logo SVG, height 20px |
| Sign-in page | src/app/sign-in/page.tsx | Logo SVG, height 24px |
| Overlay HUD | src/components/overlay/CanaryOverlay.tsx | Logo SVG, height 14px |
| Browser tab | src/app/layout.tsx | Favicon reference only |
| Marketing site | mycanarybird.com | Separate codebase |

## Do not substitute

These patterns are NOT acceptable substitutes for the logo SVG:
- ◆ CANARY (diamond mark + text in monospace)
- The word "Canary" in any font
- Any programmatically drawn shape

The text fallback "◆ CANARY" in IBM Plex Mono may only be used
in contexts where an SVG cannot render — e.g. terminal output,
CLI welcome screen, ASCII animation panels.

## Sizing

The logo SVG should be sized by height only — never distort by
setting both width and height independently. Let the SVG
aspect ratio determine the width.

Recommended heights:
- Sidebar: 20px
- Sign-in page left panel: 24px
- Overlay HUD: 14px
- Marketing site hero: 40px+

## Color

The SVG contains its own color. Do not override fill or stroke
values on the SVG unless specifically building an inverted or
monochrome variant.

If a white version is needed (e.g. on the blue sign-in right
panel background), apply: filter: brightness(0) invert(1)
via inline style or CSS class. Do not edit the SVG file itself.
