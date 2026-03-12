export default function Button({ href, variant = 'primary', className = '', children }) {
  const cls = [variant === 'ghost' ? 'btn-ghost' : 'btn-primary', className].filter(Boolean).join(' ')
  return <a href={href} className={cls}>{children}</a>
}
