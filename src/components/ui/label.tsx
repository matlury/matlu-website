"use client"

import * as React from "react"

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      data-slot="label"
      className={className}
      {...props}
    />
  )
}

export { Label }
