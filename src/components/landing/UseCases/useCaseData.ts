export interface UseCaseRule {
  /** Human-readable rule ("no rm -rf outside /tmp"). */
  text: string;
  /** Enforcement posture. */
  kind: 'block' | 'flag' | 'allow';
}

export interface UseCaseMetric {
  value: string;
  caption: string;
}

export interface UseCase {
  id: string;
  tab: string;
  /** 1-line eyebrow that shows in the active-tab header. */
  tagline: string;
  /** The pain, 2 sentences, specific enough to make a practitioner wince. */
  problem: string;
  /** How Canary intervenes, 1–2 sentences, concrete. */
  save: string;
  /** Real example rules the reader can picture enforcing. */
  rules: UseCaseRule[];
  /** One hard number the reader can evaluate on. */
  metric: UseCaseMetric;
  /** Describes the visual asset — used for accessibility + a11y label. */
  visualHint: string;
}

export const USE_CASES: UseCase[] = [
  {
    id: 'gtm',
    tab: 'GTM agents',
    tagline: 'Outbound, BDR, prospecting, recycled-lead follow-up',
    problem:
      "Your outbound agent emails the wrong contact, double-sends after a retry, or fires a sequence at a closed-lost account. One flagged domain costs weeks of deliverability warm-up — and a real relationship with a real buyer.",
    save:
      "Canary inspects every outbound send against your policy before it leaves your MTA. Block sends to suppression lists, enforce per-account frequency caps, require human approval above a tone-score threshold.",
    rules: [
      { kind: 'block', text: "Don't email domains on the suppression list" },
      { kind: 'block', text: 'No more than 2 emails per lead per 14 days' },
      { kind: 'flag',  text: 'Pause if tone_score > 0.7 — require approval' },
      { kind: 'allow', text: 'Auto-approve replies to inbound threads' },
    ],
    metric: {
      value: '0 → 13',
      caption: 'wrong-lead sends caught in a 1-week production pilot',
    },
    visualHint: 'Blocked outbound email with BLOCKED banner and policy match',
  },
  {
    id: 'coding',
    tab: 'Coding agents',
    tagline: 'Claude Code, Cursor, Devin, Aider, custom coding loops',
    problem:
      'Coding agents run shell commands, edit files, push branches — in a fully autonomous loop. One recursive delete, one force-push to main, one `terraform destroy` against prod, and the week is gone along with the audit trail.',
    save:
      'Canary hooks into the tool-call layer. Write rules in plain English — Canary compiles them into policy and checks every exec, write, or push against them before the action runs.',
    rules: [
      { kind: 'block', text: 'No rm -rf outside /tmp or the agent workspace' },
      { kind: 'block', text: 'No force pushes to main, master, or release/*' },
      { kind: 'block', text: 'No terraform destroy after 18:00 local time' },
      { kind: 'flag',  text: 'Require approval for any DROP TABLE in prod' },
    ],
    metric: {
      value: '13 / 13',
      caption: 'violations blocked on the ClaimDesk agent benchmark',
    },
    visualHint: 'Terminal showing a blocked rm -rf command with policy match',
  },
  {
    id: 'long-running',
    tab: 'Long-running tasks',
    tagline: 'Overnight runs, research agents, autonomous infra operators',
    problem:
      "Your overnight agent racks up $400 in API spend chasing a bad hypothesis, silently skips a review gate, or gets stuck in a 6-hour retry loop. By morning the damage is irreversible and the logs are too long to read.",
    save:
      'Scroll 8 hours of agent work in 30 seconds. Find the exact moment it went off. Write one rule. Tomorrow night, Canary blocks it before it happens. The boring minutes get deduplicated so you only see decisions.',
    rules: [
      { kind: 'flag',  text: 'Cost budget · alert at $50, pause at $200' },
      { kind: 'block', text: 'No more than 3 consecutive failed retries' },
      { kind: 'flag',  text: 'Require human gate before external API purchases' },
      { kind: 'allow', text: 'Auto-continue routine reads of cached data' },
    ],
    metric: {
      value: '8h → 30s',
      caption: 'overnight session reviewed in the time it takes to read a tweet',
    },
    visualHint: 'Session replay scrubber compressing an 8-hour run into 30 seconds',
  },
  {
    id: 'custom',
    tab: 'Custom / any framework',
    tagline: 'Hermes, openClaw, in-house loops, framework-agnostic stacks',
    problem:
      "You built on top of Hermes, openClaw, or a hand-rolled loop you wrote on a Sunday. You own every agent decision end-to-end. You also own every blind spot, every silent failure, and every post-incident log dive.",
    save:
      "Emit a POST to the Canary webhook with your action payload — type, target, context. Any stack that can make an HTTP call gets the full Canary pipeline: policy, recording, rule suggestions. Typed SDKs for Node, Python, and Go. Self-hosted for air-gap environments.",
    rules: [
      { kind: 'allow', text: 'One endpoint: POST https://canary.dev/v1/events' },
      { kind: 'allow', text: 'Typed SDKs · @canary/node · canary-py · canary-go' },
      { kind: 'allow', text: 'Self-hosted image — runs on your VPC' },
      { kind: 'allow', text: 'Zero config beyond an API key' },
    ],
    metric: {
      value: '1 endpoint',
      caption: 'to integrate — no vendor SDK required if you already ship HTTP',
    },
    visualHint: 'Code snippet showing the Canary webhook call',
  },
];
