"use client";

import React, { TextareaHTMLAttributes } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Textarea } from "./textarea";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  hasError?: boolean;
}

const Label = ({ htmlFor, children, hasError }: LabelProps) => (
  <label htmlFor={htmlFor} style={{ fontSize: "0.875rem", fontWeight: 600, color: hasError ? "#ef4444" : "#0f172a" }}>
    {children}
  </label>
);

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  requiredText?: string;
}

export const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, hint, error, required, requiredText, id, ...props }, ref) => {
    return (
      <Box display="flex" flexDirection="column" gap="0.5rem" width="100%">
        <Label htmlFor={id} hasError={!!error}>
          {label} {required && requiredText && `(${requiredText})`}
        </Label>
        <Textarea id={id} ref={ref} {...props} />
        {hint && !error && <Text fontSize="0.75rem" color="#64748b" margin="0">{hint}</Text>}
        {error && <Text fontSize="0.75rem" color="#ef4444" margin="0">{error}</Text>}
      </Box>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
