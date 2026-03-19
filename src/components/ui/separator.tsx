"use client"

import * as React from "react"

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      data-slot="separator"
      role={decorative ? "presentation" : "separator"}
      aria-hidden={decorative}
      className={className}
      style={
        orientation === "vertical"
          ? { width: "1px", alignSelf: "stretch", backgroundColor: "#e2e8f0" }
          : { height: "1px", width: "100%", backgroundColor: "#e2e8f0" }
      }
      {...props}
    />
  )
}

export { Separator }
