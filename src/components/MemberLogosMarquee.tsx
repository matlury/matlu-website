"use client";

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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-600 to-transparent" />
      <Marquee pauseOnHover duration={28} gap={28}>
        {logos.map((logo) => (
          <a
            key={logo.id}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={logo.name}
            className="inline-flex items-center"
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
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-600 to-transparent" />
    </div>
  );
}
