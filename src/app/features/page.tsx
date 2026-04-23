import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'Features — Canary',
  description: 'What Canary does, explained feature by feature.',
};

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          padding: '160px 24px 80px',
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
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
          Features
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--text-black)',
            margin: '16px 0 24px',
          }}
        >
          Full feature docs are landing with public launch.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--icon-grey)',
            lineHeight: 1.6,
          }}
        >
          Canary is invite-only early access right now. The docs site is next.
          For now the landing page covers the three things Canary does: replay
          what your agent saw, block what you flagged, and suggest rules at the
          end of every session.{' '}
          <Link
            href="/#early-access"
            style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
          >
            Request access →
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
