import * as React from "react"

import { cn } from "@/lib/utils"
import { IsoDepth, isoDepth, isoFace } from "@/components/ui/isometric/iso-depth"

/** A slab: a card standing on its own depth. Compose it like shadcn's Card. */
function IsoCard({
  className,
  depth = 8,
  style,
  children,
  ...props
}) {
  return (
    <div
      data-slot="iso-card"
      className={cn("group/iso relative", className)}
      style={isoDepth(depth, style)}
      {...props}>
      <IsoDepth sink={[]} />
      <div
        className={cn(isoFace, "flex h-full flex-col gap-5 bg-card py-5 text-card-foreground")}>{children}</div>
    </div>
  );
}

function IsoCardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="iso-card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 px-5 has-data-[slot=iso-card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props} />
  );
}

function IsoCardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="iso-card-title"
      className={cn("leading-none font-semibold tracking-tight", className)}
      {...props} />
  );
}

function IsoCardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="iso-card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props} />
  );
}

function IsoCardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="iso-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

function IsoCardContent({
  className,
  ...props
}) {
  return <div data-slot="iso-card-content" className={cn("px-5", className)} {...props} />;
}

function IsoCardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="iso-card-footer"
      className={cn(
        "flex items-center gap-2 border-t border-dashed border-[color:var(--iso-line,var(--border))] px-5 pt-4",
        className
      )}
      {...props} />
  );
}

export { IsoCard, IsoCardHeader, IsoCardTitle, IsoCardDescription, IsoCardAction, IsoCardContent, IsoCardFooter };
