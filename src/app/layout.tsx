import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import { CanaryWatchProvider } from "@/components/canary-watch";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  weight: ["400", "500", "700"],
  variable: "--font-mono-alt",
  display: "swap",
});

/** Editorial italic serif for emphasised words inside headlines. Inspired by
 *  wgb.agency's Tiro italic accent. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canary — The trust layer for autonomous agents",
  description:
    "A drop-in SDK that sees every action, blocks every mistake, and learns your agent. Built for Claude Code, Browser Use, openClaw, and Hermes.",
  icons: {
    icon: "/favicon.svg",
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
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <CanaryWatchProvider>{children}</CanaryWatchProvider>
      </body>
    </html>
  );
}
