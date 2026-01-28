import React from "react";
import "../style.scss"; // Global styles
import { Metadata, Viewport } from "next";

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
    <html lang="fi">
      <head>
        <link
          key="google-fonts"
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap"
          rel="stylesheet"
        />
        <link key="all-css" href="/css/all.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}