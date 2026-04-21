"use client";

import React from "react";
import { ChakraProvider as Provider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: { value: "#0149bc" },
        surface: { value: "#0f172a" },
        muted: { value: "#475569" },
        border: { value: "#e2e8f0" },
        bgSubtle: { value: "#f8fafc" },
        bgSkeleton: { value: "#f1f5f9" },
        success: { value: "#059669" },
        danger: { value: "#dc2626" },
      },
      radii: {
        card: { value: "1rem" },
        input: { value: "6px" },
        popover: { value: "12px" },
      },
      shadows: {
        dialog: { value: "0 25px 50px -12px rgba(0,0,0,0.25)" },
        popover: { value: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" },
      },
    },
    semanticTokens: {
      colors: {
        text: {
          primary: { value: "{colors.surface}" },
          secondary: { value: "{colors.muted}" },
        },
      },
    },
    recipes: {
      button: {
        base: {
          fontWeight: "700",
          transition: "all 0.2s ease-in-out",
        },
        variants: {
          primary: {
            backgroundColor: "var(--main-color)",
            color: "white",
            borderRadius: "6px",
            height: "48px",
            padding: "0 2.5rem",
            fontSize: "var(--font-size-body)",
            _hover: {
              filter: "brightness(0.9)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(1, 73, 188, 0.2)",
            },
            _active: {
              transform: "translateY(0)",
            },
          },
          secondary: {
            backgroundColor: "transparent",
            color: "var(--main-color)",
            border: "2px solid var(--main-color)",
            borderRadius: "6px",
            height: "48px",
            padding: "0 2rem",
            fontSize: "var(--font-size-body)",
            _hover: {
              backgroundColor: "var(--main-color)",
              color: "white",
            },
          },
          nav: {
            display: "inline-flex",
            width: "fit-content",
            alignItems: "center",
            border: "0",
            background: "transparent",
            padding: "0.35rem 0",
            textAlign: "left",
            fontSize: "0.875rem",
            lineHeight: "var(--line-height-h3)",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s",
            _hover: {
              color: "{colors.surface}",
            },
          },
        },
        sizes: {
          sm: {
            height: "36px",
            padding: "0 1.5rem",
            fontSize: "0.875rem",
          },
          md: {
            height: "48px",
            padding: "0 2.5rem",
            fontSize: "var(--font-size-body)",
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

interface ChakraProviderProps {
  children: React.ReactNode;
}

export default function ChakraProvider({ children }: ChakraProviderProps) {
  return <Provider value={system}>{children}</Provider>;
}
