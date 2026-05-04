import React from "react";
import "../style.scss"; // Global styles
import "./globals.css";
import { Metadata, Viewport } from "next";
import { Open_Sans, Geist } from "next/font/google";
import ExternalStyles from "@/components/ExternalStyles";
import ChakraProvider from "@/components/ChakraProvider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://www.matlu.fi"),
  title: {
    default: "Matlu ry | Matemaattis-luonnontieteelliset opiskelijajärjestöt",
    template: "%s | Matlu ry",
  },
  description: "Matlu ry on Helsingin yliopiston matemaattis-luonnontieteellisen tiedekunnan opiskelijajärjestöjen edunvalvonta- ja yhteistyöjärjestö.",
  applicationName: "Matlu ry",
  authors: [{ name: "Matlu ry", url: "https://www.matlu.fi" }],
  generator: "Next.js",
  keywords: [
    "Matlu",
    "Helsingin yliopisto",
    "Matemaattis-luonnontieteellinen tiedekunta",
    "tiedekuntajärjestö",
    "Kumpula",
    "matemaattiset",
    "luonnontieteelliset",
    "edunvalvonta",
    "ainejärjestöt",
    "Onkalo"
  ],
  category: "organization",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logos/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/logos/favicon.svg", type: "image/svg+xml" },
      { url: "/logos/favicon.ico" }
    ],
    shortcut: "/logos/favicon.ico",
    apple: { url: "/logos/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/logos/site.webmanifest",
  appleWebApp: {
    title: "Matlu",
  },
  openGraph: {
    type: "website",
    siteName: "Matlu ry",
    images: [
      {
        url: "/logos/matlu-optimized.png",
        width: 375,
        height: 187,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@matlury",
  },
};

import EmotionRegistry from "@/lib/emotion-registry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Matlu ry",
    url: "https://www.matlu.fi",
    logo: "https://www.matlu.fi/logos/matlu-optimized.png",
    sameAs: [
      "https://www.facebook.com/Matlury/",
      "https://www.instagram.com/matlury/",
    ],
  };

  return (
    <html
      lang="fi"
      className={`${geist.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/webfonts/fa-solid-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/webfonts/fa-brands-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <ExternalStyles />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={openSans.className}>
        <EmotionRegistry>
          <ChakraProvider>{children}</ChakraProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
