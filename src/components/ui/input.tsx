import * as React from "react";
import { Input as ChakraInput } from "@chakra-ui/react";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <ChakraInput
        type={type}
        className={className}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
