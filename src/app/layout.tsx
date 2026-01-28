import React from "react";
import "../style.scss"; // Global styles
import { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";

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
        <link key="all-css" href="/css/all.css" rel="stylesheet" />
      </head>
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
