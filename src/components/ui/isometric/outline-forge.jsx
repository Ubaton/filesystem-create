"use client"

import { createFigure } from "@/components/lib/isometric/figure"
import { block, camera, corners, facing, fit, footprint, prism, project, segments } from "@/components/lib/isometric/iso"
import { draw, dot, el, path, place, solid } from "@/components/lib/isometric/stage"
import { along, cycle, inOut, outBack, partial, seg } from "@/components/lib/isometric/timeline"

/**
 * OutlineForge: FileGen's core job. Outline lines type onto a slab, a scan
 * passes over them, each line rises into a folder or file, the tree's links
 * draw in, and a pulse visits every node.
 */

const W = 136,
  D = 104,
  T = 5,
  ROW = 15,
  INDENT = 16,
  CELL = 10
const ROWS = [
  { depth: 0, w: 42, folder: true, parent: -1 },
  { depth: 1, w: 52, folder: true, parent: 0 },
  { depth: 2, w: 40, parent: 1 },
  { depth: 2, w: 32, parent: 1 },
  { depth: 1, w: 28, parent: 0 },
  { depth: 0, w: 44, parent: -1 },
].map((r, i) => ({ ...r, i, x: 9 + r.depth * INDENT, y: 8 + i * ROW }))

const linkOf = (r) => {
  const p = ROWS[r.parent]
  return [
    [p.x + 4, p.y + CELL, T],
    [p.x + 4, r.y + CELL / 2, T],
    [r.x, r.y + CELL / 2, T],
  ]
}
const LINKED = ROWS.filter((r) => r.parent >= 0)

const mount = (ctx, speed) => {
  const c = camera(45, 0.5, 1.5)
  fit(c, corners(0, 0, W, D, 0, 26), 200, 165)
  const P = project(c),
    front = facing(c)
  const root = el("g", null, ctx.svg)
  const [ring, bevel] = footprint(0, 0, W, D, 7, 2)
  draw(solid(root), prism(P, front, ring, bevel, 0, T))
  const typed = path(root, "line")
  const links = path(root, "line accent")
  const scan = path(root, "line hi")
  const order = ROWS.slice().sort((a, b) => a.x + a.y - (b.x + b.y))
  const parts = order.map((r) => {
    const s = solid(root, r.folder ? "accent" : "")
    if (r.folder) s.outline.classList.add("glow")
    return { r, s }
  })
  const pulse = dot(root, c, 2.6, "dot accent")

  const render = (t) => {
    const out = 1 - inOut(seg(t, 8, 8.8))
    typed.setAttribute("d", segments(P, ROWS.map((r) => {
      const p = seg(t, r.i * 0.22, r.i * 0.22 + 0.5) * (1 - seg(t, 8.5, 8.9))
      const y = r.y + CELL / 2
      return [[r.x, y, T], [r.x + r.w * p, y, T]]
    })))
    const sp = seg(t, 1.5, 2.8)
    const scanY = 2 + sp * (D - 4)
    scan.setAttribute("d", sp > 0 && sp < 1 ? segments(P, [[[3, scanY, T], [W - 3, scanY, T]]]) : "")
    for (const { r, s } of parts) {
      const rise = outBack(seg(t, 1.8 + r.i * 0.2, 2.5 + r.i * 0.2)) * out
      const h = (r.folder ? 12 : 6) * rise
      draw(s, h > 0.2
        ? block(P, r.x, r.y, r.x + r.w, r.y + CELL, T, T + h)
        : { outline: "", inner: "" })
    }
    links.setAttribute("d", segments(P, LINKED.flatMap((r, k) =>
      partial(linkOf(r), seg(t, 3.5 + k * 0.2, 4 + k * 0.2) * out))))
    const pp = seg(t, 4.8, 7.8)
    const running = pp > 0 && pp < 1
    const k = Math.min(LINKED.length - 1, Math.floor(pp * LINKED.length))
    if (running) place(pulse, P(...along(linkOf(LINKED[k]), pp * LINKED.length - k)))
    pulse.setAttribute("visibility", running ? "visible" : "hidden")
    for (const { r, s } of parts) s.g.classList.toggle("hi", running && LINKED[k] === r)
  }

  return cycle(ctx, speed, { duration: 9, hold: 7.9, root, render })
}

export const OutlineForge = createFigure("OutlineForge", {
  id: "outline-forge",
  label: "Outline text rises from a slab into a connected tree of folders and files.",
  rest: "forging",
  range: [0.6, 1, 1.5],
  defaults: {},
  mount,
})
