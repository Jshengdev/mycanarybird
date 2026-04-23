export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span style={{ fontSize: '14px', color: 'var(--icon-grey)' }}>
        Loading...
      </span>
    </div>
  );
}
