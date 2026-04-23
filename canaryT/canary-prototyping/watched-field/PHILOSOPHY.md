# The Watched Field

An algorithmic philosophy for Canary's background layer.

---

The canary sees what the agent actually does.

A field of invisible currents, driven by Perlin noise, shapes the motion
of silent wanderers. They drift, they turn, they explore. Most of the time
they follow the flow. Sometimes one strays — its heading diverges from the
field beneath it.

When that happens, a ring catches its trail in electric blue — not to stop
it, but to notice it. The agents do not know they are watched. The flow
does not know which are off-path.

Only the observer sees the rule being tested.

Every few seconds, a breath of recognition: SEEN. Then darkness again.

Somewhere in the drift there is a single constant: the canary itself.
Smaller. Slower. Always visible. The bird does not panic. It remembers.

In the mine, not every wandering step is a mistake. Some are discoveries.
Canary does not block the wander. Canary remembers it.

---

## Reference stack

- **Flow field**: 2D Perlin noise, Nature of Code Ch0
- **Agent behavior**: Reynolds wander + flow-field-follow (weighted), Ch5.05 + 5.07
- **Local coherence**: soft separation between nearby neighbors, Ch5.11
- **Divergence detection**: dot product of agent velocity and local field vector —
  low dot = straying; triggers a fading observation ring
- **Scroll reactivity**: `scrollY / scrollHeight` drives agent count, field turbulence,
  and observation ring frequency. Three implicit phases mirror the landing sections:
  hero (calm), reel (observed), closer (converged).

## Color discipline

Every value references Canary's design tokens (mirrored from the dashboard):

| Element | Token | Use |
|---|---|---|
| Canvas bg (transparent over page) | — | Page `--bg` #F5F5F8 shows through |
| Agent dots + trails | `--icon-grey` #5A5A7A | Base layer, alpha 0.25 |
| Observation ring | `--accent-color` #0B0DC4 | Pulses at detected divergence, fades in 40f |
| Canary sentinel | `--safe` #2D7A55 | One constant agent, 2s pulse |
| Critical zone (optional) | `--critical` #B84040 | Reserved for rule-boundary flashes |

## Non-negotiables

1. `pointer-events: none` on the canvas — page copy and buttons stay clickable.
2. `prefers-reduced-motion: reduce` renders a single static frame.
3. All animation runs in `requestAnimationFrame` — no setInterval.
4. Agent count hard-capped at 160 to keep 60fps on mid-tier laptops.
5. No gradient overlays that bleed the field color onto copy. Alpha only.
6. Background must disappear into the page when the viewer is reading text,
   and feel alive when the viewer stops to watch. Never demanding.
