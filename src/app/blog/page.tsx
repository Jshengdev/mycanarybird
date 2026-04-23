import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'Blog — Canary',
  description: 'Notes from building Canary, the trust layer for autonomous agents.',
};

export default function BlogPage() {
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
          Blog
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
          First post lands with public launch.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--icon-grey)',
            lineHeight: 1.6,
          }}
        >
          We&apos;re building in public. Expect honest posts about shipping an agent-QA
          product. In the meantime,{' '}
          <Link
            href="/#early-access"
            style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
          >
            get early access →
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
