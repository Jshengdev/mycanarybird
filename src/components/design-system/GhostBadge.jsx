export default function GhostBadge({ position = 1 }) {
  return <div className={`ghost-badge ghost-${position}`}>[UNOBSERVED]</div>
}
