"use client";

import React, { TextareaHTMLAttributes } from "react";
import styled from "styled-components";
import { Textarea } from "./textarea";

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  requiredText?: string;
}

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label<{ $hasError?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$hasError ? "#ef4444" : "#0f172a"};
`;

const Hint = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
`;

export const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, hint, error, required, requiredText, id, ...props }, ref) => {
    return (
      <FieldContainer>
        <Label htmlFor={id} $hasError={!!error}>
          {label} {required && requiredText && `(${requiredText})`}
        </Label>
        <Textarea id={id} ref={ref} {...props} />
        {hint && !error && <Hint>{hint}</Hint>}
        {error && <ErrorText>{error}</ErrorText>}
      </FieldContainer>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
