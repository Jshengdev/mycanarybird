export function generateStaticParams() {
  return [{ workspace: 'photon' }];
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
