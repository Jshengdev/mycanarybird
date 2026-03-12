import DesktopTitlebar from './DesktopTitlebar'

export default function DesktopWindow({ label, children }) {
  return (
    <div className="desktop-window">
      <DesktopTitlebar label={label} />
      <div className="desktop-body">{children}</div>
    </div>
  )
}
