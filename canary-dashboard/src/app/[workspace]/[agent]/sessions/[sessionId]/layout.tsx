export function generateStaticParams() {
  return [
    { sessionId: 'ses_20260404_a3f9' },
    { sessionId: 'ses_20260403_b7c2' },
    { sessionId: 'ses_20260403_a1d4' },
    { sessionId: 'ses_20260402_f8e1' },
    { sessionId: 'ses_20260402_c3a7' },
    { sessionId: 'ses_20260401_d9b3' },
    { sessionId: 'ses_20260401_a2f5' },
    { sessionId: 'ses_20260331_e6c8' },
    { sessionId: 'ses_20260331_b4d1' },
    { sessionId: 'ses_20260330_a7e2' },
    { sessionId: 'ses_file_001' },
    { sessionId: 'ses_file_002' },
    { sessionId: 'ses_file_003' },
    { sessionId: 'ses_browser_001' },
    { sessionId: 'ses_browser_002' },
    { sessionId: 'ses_browser_003' },
    { sessionId: 'ses_calendar_001' },
    { sessionId: 'ses_calendar_002' },
  ];
}

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
