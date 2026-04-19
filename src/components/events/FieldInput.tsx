"use client";

import type { ComponentProps } from "react";
import { TextInput } from "@/components/ui/TextInput";

interface FieldInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  requiredText?: string;
  hint?: string;
  style?: React.CSSProperties;
  datalist?: string;
  autoComplete?: string;
  onValueChange?: (value: string) => void;
  onBlurExtra?: () => void;
}

export function FieldInput({
  form,
  name,
  label,
  type = "text",
  required,
  requiredText,
  hint,
  style,
  datalist,
  autoComplete,
  onValueChange,
  onBlurExtra,
}: FieldInputProps) {
  return (
    <form.Field name={name}>
      {(field: { name: string; state: { value: string }; handleBlur: () => void; handleChange: (v: string) => void }) => (
        <TextInput
          id={field.name}
          name={field.name}
          type={type}
          label={label}
          requiredText={requiredText}
          hint={hint}
          list={datalist}
          autoComplete={autoComplete}
          value={field.state.value}
          onBlur={() => {
            field.handleBlur();
            onBlurExtra?.();
          }}
          onChange={(e) => {
            const nextValue = e.target.value;
            field.handleChange(nextValue);
            onValueChange?.(nextValue);
          }}
          required={required}
          style={style}
        />
      )}
    </form.Field>
  );
}
