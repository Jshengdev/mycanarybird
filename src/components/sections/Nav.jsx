export default function Nav() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        <div className="nav-dot" />
        <span className="nav-wordmark">CANARY</span>
      </a>
      <ul className="nav-links">
        <li><a href="#problem">[PROBLEM]</a></li>
        <li><a href="#solution">{'{SOLUTION}'}</a></li>
        <li><a href="#how">[HOW IT WORKS]</a></li>
        <li><a href="#live">[DASHBOARD]</a></li>
        <li><a href="#early-access" className="nav-cta">REQUEST ACCESS &rarr;</a></li>
      </ul>
    </nav>
  )
}
