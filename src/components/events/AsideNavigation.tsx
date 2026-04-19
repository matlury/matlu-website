"use client";

import styled from "styled-components";

interface SectionItem {
  id: string;
  label: string;
}

interface AsideNavigationProps {
  sectionItems: SectionItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  navigationLabel: string;
}

const AsideContainer = styled.aside`
  position: absolute;
  left: 100%;
  top: 92px;
  margin-left: 1.5rem;
  width: 220px;
  display: none;

  @media (min-width: 1280px) {
    display: block;
  }
`;

const NavButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  border: 0;
  background: transparent;
  padding: 0.35rem 0;
  text-align: left;
  font-size: 0.875rem;
  line-height: var(--line-height-h3);
  color: ${(props) => (props.$active ? "#0f172a" : "#64748b")};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: currentColor;
    display: ${(props) => (props.$active ? "block" : "none")};
  }
`;

export function AsideNavigation({
  sectionItems,
  activeSection,
  onNavigate,
  navigationLabel,
}: AsideNavigationProps) {
  return (
    <AsideContainer>
      <div style={{ padding: "0.25rem" }}>
        <p style={{ marginBottom: "1rem", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8" }}>
          {navigationLabel}
        </p>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {sectionItems.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <NavButton
                key={section.id}
                type="button"
                $active={isActive}
                onClick={() => onNavigate(section.id)}
                aria-current={isActive ? "true" : undefined}
              >
                {section.label}
              </NavButton>
            );
          })}
        </nav>
      </div>
    </AsideContainer>
  );
}
