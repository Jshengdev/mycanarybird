export default function StepItem({ num, title, desc, code }) {
  return (
    <div className="step">
      <div className="step-num">{num}</div>
      <div className="step-title">{title}</div>
      <div className="step-desc">{desc}</div>
      {code && <div className="step-code">{code}</div>}
    </div>
  )
}
