import * as React from "react";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getVariantClass(variant: ButtonVariant): string {
  if (variant === "outline") {
    return "border border-slate-300 bg-white hover:bg-slate-50";
  }

  if (variant === "ghost") {
    return "hover:bg-slate-100";
  }

  return "bg-brand-600 text-white hover:bg-brand-500";
}

function getSizeClass(size: ButtonSize): string {
  if (size === "sm") {
    return "h-9 rounded-md px-3";
  }

  if (size === "lg") {
    return "h-11 rounded-md px-8";
  }

  return "h-10 px-4 py-2";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClassName =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const mergedClassName = [
      baseClassName,
      getVariantClass(variant),
      getSizeClass(size),
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={mergedClassName} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button };
