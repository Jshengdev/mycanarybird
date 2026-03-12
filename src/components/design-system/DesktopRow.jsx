export default function DesktopRow({ icon, appName, action, statusTag, statusClass = 'tag-silent', error = false }) {
  return (
    <div className={`desktop-row${error ? ' desktop-row-error' : ''}`}>
      <div className="desktop-app-icon">{icon}</div>
      <div className="desktop-app-content">
        <div className="app-name">{appName}</div>
        <div className={error ? 'app-action app-action-mono' : 'app-action'}>{action}</div>
      </div>
      <div className={`app-status-tag ${statusClass}`}>{statusTag}</div>
    </div>
  )
}
