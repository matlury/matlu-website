"use client";

import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={className} {...props} />;
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend data-slot="field-legend" data-variant={variant} className={className} {...props} />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={className} {...props} />;
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="group" data-slot="field" className={className} {...props} />;
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={className} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={className} {...props} />;
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-label" className={className} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={className} {...props} />;
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div data-slot="field-separator" data-content={!!children} className={className} {...props}>
      <Separator />
      {children}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul>
        {uniqueErrors.map(
          (error, index) => error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div role="alert" data-slot="field-error" className={className} {...props}>
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};