import NotifDot from './NotifDot'
import NotifBadge from './NotifBadge'

export default function NotifCard({
  dot = 'green',
  agent,
  action,
  detail,
  badge,
  badgeVariant = 'green',
  theme = 'dark',
}) {
  const cls = `notif-card${theme === 'light' ? ' notif-card--light' : ''}`
  return (
    <div className={cls}>
      <NotifDot color={dot} />
      <div className="notif-body">
        <div className="notif-line1">
          <span className="notif-agent">{agent}</span>
          <span className="notif-arrow">&rarr;</span>
          <span className="notif-action">{action}</span>
        </div>
        {detail && <div className="notif-line2">{detail}</div>}
      </div>
      {badge && <NotifBadge variant={badgeVariant}>[{badge}]</NotifBadge>}
    </div>
  )
}
