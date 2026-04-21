import * as React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "ghost" | "nav";
type ButtonSize = "default" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getVariantClass(variant: ButtonVariant): "outline" | "ghost" | "solid" | undefined {
  if (variant === "outline") {
    return "outline";
  }

  if (variant === "ghost") {
    return "ghost";
  }

  return "solid";
}

function getSizeClass(size: ButtonSize): "sm" | "md" | "lg" {
  if (size === "sm") {
    return "sm";
  }

  if (size === "lg") {
    return "lg";
  }

  return "md";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={getVariantClass(variant)}
        size={getSizeClass(size)}
        className={className}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
