import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Fonts chosen to match https://www.cotality.com/our-data's measured type
// system: a geometric display/UI sans (their real site uses a licensed
// commercial face, "TWK Everett" — not something to embed here) and IBM
// Plex Mono for small eyebrow/label text, which is what their site actually
// uses too, so it's used verbatim (an open font, not a proprietary asset).
const displaySans = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const labelMono = IBM_Plex_Mono({
  variable: "--font-label-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parcel Intelligence Console",
  description:
    "AI agent dashboard for property valuation, climate risk, title, and underwriting workflows.",
};

// Blocking script, not a useEffect: it has to run before first paint so a
// returning dark-mode visitor doesn't see a flash of the light default.
// Light with no stored preference is deliberate — this app's default theme
// no longer follows prefers-color-scheme.
const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displaySans.variable} ${labelMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
