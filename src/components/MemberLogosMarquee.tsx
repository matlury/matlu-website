"use client";

import { useEffect, useRef } from "react";
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

function disableLinksInClones(container: HTMLElement) {
  const clones = container.querySelectorAll('[data-clone=""] a, [aria-hidden="true"] a');
  clones.forEach((el) => {
    el.setAttribute("tabindex", "-1");
    el.setAttribute("aria-hidden", "true");
  });
}

export default function MemberLogosMarquee({ logos = [] }: MemberLogosMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    disableLinksInClones(root);

    let ticking = false;

    const observer = new MutationObserver(() => {
      if (!ticking) {
        requestAnimationFrame(() => {
          disableLinksInClones(root);
          ticking = false;
        });
        ticking = true;
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (logos.length === 0) {
    return null;
  }

  return (
    <Marquee.Root
      ref={rootRef}
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
                  width="180"
                  height="46"
                  loading="lazy"
                  decoding="async"
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
