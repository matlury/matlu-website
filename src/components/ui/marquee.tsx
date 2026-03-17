import { type ComponentPropsWithoutRef } from "react";

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
  const marqueeStyle = {
    "--duration": `${duration}s`,
    "--gap": `${gap}px`,
  } as React.CSSProperties;

  const rootClassName = [
    "group flex gap-[var(--gap)] overflow-hidden p-2",
    vertical ? "flex-col" : "flex-row",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const itemClassName = [
    "flex shrink-0 justify-around gap-[var(--gap)]",
    vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
    pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
    reverse ? "[animation-direction:reverse]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={rootClassName} style={marqueeStyle}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={itemClassName}>
            {children}
          </div>
        ))}
    </div>
  );
}
