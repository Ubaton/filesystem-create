import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { IsoDepth, isoDepth, isoFace } from "@/components/ui/isometric/iso-depth"

const badgeVariants = cva(
  "inline-flex h-5 items-center gap-1 px-2 text-[11px] font-medium whitespace-nowrap [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        solid: "border-primary bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/** A small slab for status and counts. */
function IsoBadge({
  className,
  variant,
  depth = 2,
  style,
  children,
  ...props
}) {
  return (
    <span
      data-slot="iso-badge"
      className="group/iso relative mr-(--iso-d) mb-(--iso-d) inline-flex align-middle"
      style={isoDepth(depth, style)}
      {...props}>
      <IsoDepth
        sink={[]}
        side={variant === "solid" ? "color-mix(in oklab, var(--primary) 78%, var(--background))" : undefined} />
      <span className={cn(isoFace, badgeVariants({ variant }), className)}>{children}</span>
    </span>
  );
}

export { IsoBadge, badgeVariants as isoBadgeVariants };
