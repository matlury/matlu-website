import { Field, FieldLabel, Input, Textarea } from "@chakra-ui/react";
import { InputProps, TextareaProps } from "@chakra-ui/react";

export type FormFieldBaseProps = {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
};

export type FormFieldProps = FormFieldBaseProps & 
  (
    | ({ as?: "input" } & InputProps)
    | ({ as: "textarea" } & TextareaProps)
  );

export function FormField({ label, id, required, hint, ...props }: FormFieldProps) {
  const isTextarea = props.as === "textarea";
  const { as: _removed, ...rest } = props; // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <Field.Root style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <FieldLabel
        htmlFor={id}
        style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}
      >
        {label} {required && `(${required ? "Required" : ""})`}
      </FieldLabel>
      {isTextarea ? (
        <Textarea id={id} {...(rest as TextareaProps)} />
      ) : (
        <Input id={id} {...(rest as InputProps)} />
      )}
      {hint && (
        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
          {hint}
        </p>
      )}
    </Field.Root>
  );
}
