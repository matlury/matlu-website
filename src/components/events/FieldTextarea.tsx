"use client";

import { TextareaInput } from "@/components/ui/TextareaInput";

interface FieldTextareaProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  rows?: number;
}

export function FieldTextarea({
  form,
  name,
  label,
  rows = 4,
}: FieldTextareaProps) {
  return (
    <form.Field name={name}>
      {(field: { name: string; state: { value: string }; handleBlur: () => void; handleChange: (v: string) => void }) => (
        <TextareaInput
          id={field.name}
          name={field.name}
          label={label}
          rows={rows}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      )}
    </form.Field>
  );
}
