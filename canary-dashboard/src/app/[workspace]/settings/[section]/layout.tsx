export function generateStaticParams() {
  return [
    { section: 'workspace' },
    { section: 'scoring' },
    { section: 'members' },
    { section: 'integrations' },
    { section: 'notifications' },
    { section: 'preferences' },
    { section: 'workspace-actions' },
  ];
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
