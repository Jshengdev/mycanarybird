import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'About — Canary',
  description: 'Who is building Canary and why.',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          padding: '160px 24px 80px',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'var(--icon-grey)',
            textTransform: 'uppercase',
          }}
        >
          About
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--text-black)',
            margin: '16px 0 32px',
          }}
        >
          Canary is built by engineers who got tired of watching their own agents run unattended.
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.0625rem',
            color: 'var(--text-black)',
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <p>
            Johnny built his own full-time agentic GTM hire — a computer-use agent running 24/7
            doing outreach, research, and follow-ups. Except he couldn&apos;t leave it alone 24/7,
            because the failure modes (spam, wrong leads, bad sources) weren&apos;t visible until
            after the damage.
          </p>
          <p>
            Teri is a 3× founding product designer who has shipped at Riot, NatGeo, and several
            early-stage consumer and tooling startups. She also codes.
          </p>
          <p>
            Canary is the QA tool they wanted for their own agents. One that sees the screen
            instead of reading the logs.{' '}
            <Link
              href="/#early-access"
              style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
            >
              Join the early access list →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
