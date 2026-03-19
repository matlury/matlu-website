"use client";

import React from "react";
import { ChakraProvider as Provider, defaultSystem } from "@chakra-ui/react";

interface ChakraProviderProps {
  children: React.ReactNode;
}

export default function ChakraProvider({ children }: ChakraProviderProps) {
  return <Provider value={defaultSystem}>{children}</Provider>;
}
