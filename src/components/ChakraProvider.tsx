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
  },
});

const system = createSystem(defaultConfig, config);

interface ChakraProviderProps {
  children: React.ReactNode;
}

export default function ChakraProvider({ children }: ChakraProviderProps) {
  return <Provider value={system}>{children}</Provider>;
}
