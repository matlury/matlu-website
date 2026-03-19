import { type ComponentPropsWithoutRef } from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * Animation duration in seconds
   * @default 40
   */
  duration?: number;
  /**
   * Gap between items in pixels
   * @default 16
   */
  gap?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = 16,
  ...props
}: MarqueeProps) {
  const marqueeHorizontal = keyframes`
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - var(--gap))); }
  `;

  const marqueeVertical = keyframes`
    from { transform: translateY(0); }
    to { transform: translateY(calc(-100% - var(--gap))); }
  `;

  const marqueeStyle = {
    "--duration": `${duration}s`,
    "--gap": `${gap}px`,
  } as React.CSSProperties;

  return (
    <Box
      {...props}
      className={className}
      style={marqueeStyle}
      display="flex"
      flexDirection={vertical ? "column" : "row"}
      gap="var(--gap)"
      overflow="hidden"
      p={2}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <Box
            key={i}
            display="flex"
            flexDirection={vertical ? "column" : "row"}
            flexShrink={0}
            justifyContent="space-around"
            gap="var(--gap)"
            animation={`${vertical ? marqueeVertical : marqueeHorizontal} var(--duration, 40s) linear infinite`}
            animationDirection={reverse ? "reverse" : "normal"}
            _hover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
          >
            {children}
          </Box>
        ))}
    </Box>
  );
}
