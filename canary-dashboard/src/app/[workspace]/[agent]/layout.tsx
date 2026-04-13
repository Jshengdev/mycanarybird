export function generateStaticParams() {
  return [
    { agent: 'email-agent' },
    { agent: 'file-agent' },
    { agent: 'browser-agent' },
    { agent: 'calendar-agent' },
  ];
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
