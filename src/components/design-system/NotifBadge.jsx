export default function NotifBadge({ children, variant = 'green' }) {
  return <div className={`notif-badge badge-${variant}`}>{children}</div>
}
