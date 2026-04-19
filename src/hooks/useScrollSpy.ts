import { useCallback, useEffect, useState } from "react";

interface SectionItem {
  id: string;
}

export function useScrollSpy(
  sectionItems: SectionItem[],
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  fallbackId: string,
): { activeSection: string; setActiveSection: (id: string) => void } {
  const [activeSection, setActiveSection] = useState(fallbackId);

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const root = scrollContainerRef.current;
    const elements = sectionItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [sectionItems, scrollContainerRef]);

  const setActiveSectionCallback = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return { activeSection, setActiveSection: setActiveSectionCallback };
}
