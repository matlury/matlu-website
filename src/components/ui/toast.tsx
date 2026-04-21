"use client";

import { createPortal } from "react-dom";
import { Box, Text, CloseButton } from "@chakra-ui/react";

type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  title: string;
  description: string;
  onClose: () => void;
  closeAriaLabel?: string;
}

export function Toast({
  type,
  title,
  description,
  onClose,
  closeAriaLabel = "Close notification",
}: ToastProps): ReturnType<typeof createPortal> | null {
  return createPortal(
    <Box
      position="fixed"
      right="1rem"
      top="1rem"
      zIndex="120"
      width="min(360px, calc(100vw - 1.5rem))"
      borderRadius="12px"
      padding="0.75rem 1rem"
      color="#fff"
      boxShadow="0 10px 25px rgba(0,0,0,0.2)"
      background={type === "success" ? "#059669" : "#dc2626"}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap="0.5rem">
        <Box>
          <Text fontSize="0.875rem" fontWeight="600" lineHeight="var(--line-height-h3)" margin="0">
            {title}
          </Text>
          <Text marginTop="0.25rem" fontSize="0.875rem" lineHeight="var(--line-height-body)" opacity="0.95">
            {description}
          </Text>
        </Box>
        <CloseButton
          aria-label={closeAriaLabel}
          onClick={onClose}
        />
      </Box>
    </Box>,
    document.body,
  );
}
