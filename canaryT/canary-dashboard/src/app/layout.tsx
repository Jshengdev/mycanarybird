import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DevOverlay } from "@/components/dev/DevOverlay";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-alt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canary Dashboard",
  description: "QA and observability for computer-use AI agents",
  icons: {
    icon: "/canarylogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${ibmPlexMono.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <OnboardingProvider>
          {children}
          <DevOverlay />
        </OnboardingProvider>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </body>
    </html>
  );
}
