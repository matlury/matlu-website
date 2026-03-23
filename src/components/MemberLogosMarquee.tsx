"use client";

import { Marquee } from "@chakra-ui/react";

export interface FooterLogo {
  id: string;
  name: string;
  href: string;
  src: string;
  alt: string;
}

interface MemberLogosMarqueeProps {
  logos?: FooterLogo[];
}

export default function MemberLogosMarquee({ logos = [] }: MemberLogosMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  return (
    <Marquee.Root
      pauseOnInteraction
      spacing="28px"
      css={{
        "--marquee-duration": "28s",
        "--marquee-edge-color": "#0149bc",
        "--marquee-edge-size": "64px",
        bg: "#0149bc",
      }}
    >
      <Marquee.Edge side="start" />
      <Marquee.Viewport>
        <Marquee.Content>
          {logos.map((logo) => (
            <Marquee.Item key={logo.id}>
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={logo.name}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  style={{ width: "auto", height: "46px", maxWidth: "180px", objectFit: "contain" }}
                />
              </a>
            </Marquee.Item>
          ))}
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="end" />
    </Marquee.Root>
  );
}
