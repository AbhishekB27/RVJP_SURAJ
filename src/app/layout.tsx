import type { Metadata } from "next";
import "./globals.css";

import { Oswald, Plus_Jakarta_Sans } from "next/font/google";

// Display: condensed protest-poster grotesque. Variable 200–700 so headings can
// carry real hierarchy instead of faking it with a second family's black weight.
const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
  variable: "--font-display-face",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

// Body: humanist grotesque — open apertures, tall x-height, comfortable for the
// long-form blog and form copy.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
  variable: "--font-sans-face",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "RVJP — Rape Virodhi Janta Party | Break The Silence",
  description:
    "RVJP is a movement against sexual violence. We stand with survivors, fight for justice and build a safer tomorrow.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "RVJP — Break The Silence",
    description:
      "A voice. A movement. A change. Join RVJP in the fight against sexual violence in India.",
    type: "website",
    locale: "en_IN",
    siteName: "RVJP",
  },
};

/**
 * Only the document shell lives here. The public site's chrome (header, footer,
 * smooth scroll) belongs to the `(site)` group so `/admin` can render its own.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
