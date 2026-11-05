"use client";
import * as React from "react"

import { cn } from "@/lib/utils"
import { BlockSlot, slotLabel } from "@/components/ui/isometric/block-icon";

/**
 * A row of nine slots. Click a slot, use the arrow keys while it has focus,
 * scroll over it, or press 1–9 anywhere on the page.
 */
function Hotbar({
  items,
  value,
  defaultValue = 0,
  onValueChange,
  hotkeys = true,
  className,
  ...props
}) {
  const slots = React.useMemo(() => Array.from({ length: 9 }, (_, i) => items[i] ?? null), [items])
  const [inner, setInner] = React.useState(defaultValue)
  const current = value ?? inner
  const choose = React.useCallback((i) => {
    const next = ((i % 9) + 9) % 9
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }, [value, onValueChange])

  React.useEffect(() => {
    if (!hotkeys) return
    const onKey = (e) => {
      const t = e.target
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest("input, textarea, select, [contenteditable='true']")) return
      if (e.key >= "1" && e.key <= "9") choose(Number(e.key) - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkeys, choose])

  return (
    <div
      role="listbox"
      aria-orientation="horizontal"
      aria-label={props["aria-label"] ?? "Hotbar"}
      aria-activedescendant={`hotbar-slot-${current}`}
      tabIndex={0}
      data-slot="hotbar"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault()
          choose(current + 1)
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          choose(current - 1)
        }
        if (e.key === "Home") {
          e.preventDefault()
          choose(0)
        }
        if (e.key === "End") {
          e.preventDefault()
          choose(8)
        }
      }}
      onWheel={(e) => {
        if (e.deltaY) choose(current + Math.sign(e.deltaY))
      }}
      className={cn(
        "inline-flex w-fit gap-0 border border-[color:var(--iso-line,color-mix(in_oklab,var(--foreground)_62%,var(--background)))] bg-[color-mix(in_oklab,var(--muted)_60%,var(--background))] p-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}>
      {slots.map((item, i) => (
        <BlockSlot
          key={i}
          id={`hotbar-slot-${i}`}
          role="option"
          aria-selected={i === current}
          aria-label={`${i + 1}: ${slotLabel(item)}`}
          item={item}
          selected={i === current}
          onClick={() => choose(i)}
          className="-ml-px first:ml-0" />
      ))}
    </div>
  );
}

export { Hotbar };
