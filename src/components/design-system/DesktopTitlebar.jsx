export default function DesktopTitlebar({ label }) {
  return (
    <div className="desktop-titlebar">
      <div className="titlebar-dots">
        <span className="td td-red" />
        <span className="td td-amber" />
        <span className="td td-green" />
      </div>
      <div className="titlebar-label">{label}</div>
      <div className="titlebar-right" />
    </div>
  )
}
