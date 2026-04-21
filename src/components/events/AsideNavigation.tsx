"use client";

import { Box, Text, Button } from "@chakra-ui/react";

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

export function AsideNavigation({
  sectionItems,
  activeSection,
  onNavigate,
  navigationLabel,
}: AsideNavigationProps) {
  return (
    <Box
      as="aside"
      position="absolute"
      left="100%"
      top="92px"
      marginLeft="1.5rem"
      width="220px"
      display="none"
      css={{ "@media (min-width: 1280px)": { display: "block" } }}
    >
      <Box padding="0.25rem">
        <Text marginBottom="1rem" fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.15em" color="muted">
          {navigationLabel}
        </Text>
        <Box as="nav" display="flex" flexDirection="column" gap="0.25rem">
          {sectionItems.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <Button
                key={section.id}
                type="button"
                onClick={() => onNavigate(section.id)}
                aria-current={isActive ? "true" : undefined}
                variant="ghost"
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  alignItems: "center",
                  border: "0",
                  background: "transparent",
                  padding: "0.35rem 0",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  lineHeight: "var(--line-height-h3)",
                  color: isActive ? "#0f172a" : "#64748b",
                  cursor: "pointer",
                  position: "relative",
                  transition: "color 0.2s",
                }}
              >
                {section.label}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
