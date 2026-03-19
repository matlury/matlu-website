"use client";

import { Box } from "@chakra-ui/react";
import { Marquee } from "@/components/ui/marquee";

export interface FooterLogo {
  id: string;
  name: string;
  href: string;
  src: string;
}

interface MemberLogosMarqueeProps {
  logos?: FooterLogo[];
}

export default function MemberLogosMarquee({ logos = [] }: MemberLogosMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  return (
    <Box position="relative" overflow="hidden">
      <Box
        pointerEvents="none"
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        zIndex={10}
        width="64px"
        bgGradient="linear(to-r, #0149bc, transparent)"
      />
      <Marquee pauseOnHover duration={28} gap={28}>
        {logos.map((logo) => (
          <a
            key={logo.id}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={logo.name}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              style={{ width: "auto", height: "46px", maxWidth: "180px", objectFit: "contain" }}
            />
          </a>
        ))}
      </Marquee>
      <Box
        pointerEvents="none"
        position="absolute"
        top={0}
        bottom={0}
        right={0}
        zIndex={10}
        width="64px"
        bgGradient="linear(to-l, #0149bc, transparent)"
      />
    </Box>
  );
}
