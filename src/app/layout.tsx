import React from "react";
import "../style.scss"; // Global styles
import { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import ExternalStyles from "@/components/ExternalStyles";

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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Matlu ry",
    images: [
      {
        url: "/logos/matlu.png",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@matlury",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={openSans.variable}>
      <head>
        {process.env.API_URL && (
          <>
            <link rel="preconnect" href={process.env.API_URL} />
            <link rel="dns-prefetch" href={process.env.API_URL} />
          </>
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      </head>
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
