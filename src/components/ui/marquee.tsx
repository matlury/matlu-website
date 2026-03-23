import { Marquee as ChakraMarquee } from "@chakra-ui/react";
import { type ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  duration?: number;
  gap?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  duration = 40,
  gap = 16,
  ...props
}: MarqueeProps) {
  return (
    <ChakraMarquee.Root
      className={className}
      reverse={reverse}
      pauseOnInteraction={pauseOnHover}
      side={vertical ? "bottom" : "start"}
      spacing={`${gap}px`}
      speed={50}
      css={{ "--marquee-duration": `${duration}s` }}
      {...props}
    >
      <ChakraMarquee.Viewport>
        <ChakraMarquee.Content>
          {children}
        </ChakraMarquee.Content>
      </ChakraMarquee.Viewport>
    </ChakraMarquee.Root>
  );
}
