"use client"

import { createFigure } from "@/components/lib/isometric/figure"
import { block, camera, clamp, corners, facing, fit, footprint, planeMatrix, prism, project, segments, tile } from "@/components/lib/isometric/iso"
import { spring, stepAll } from "@/components/lib/isometric/motion"
import { draw, el, path, solid } from "@/components/lib/isometric/stage"
import { cycle, outBack, seg } from "@/components/lib/isometric/timeline"

/**
 * TemplateRack: FileGen's starters. Cartridges sit in a rack and take turns
 * sliding out; the live one shows its outline and raises its first files. The
 * pointer's height picks a cartridge.
 */

const W = 104,
  D = 72,
  H = 9,
  GAP = 24,
  OUT = 44,
  TURN = 3.2
const NAMES = ["REACT", "NEXT", "NODE", "PYTHON"]

const mount = (ctx, speed) => {
  const c = camera(45, 0.5, 1.28)
  fit(c, corners(0, 0, W + OUT, D, 0, GAP * NAMES.length + 12), 200, 160)
  const P = project(c),
    front = facing(c)
  const root = el("g", null, ctx.svg)
  const posts = path(root, "line dash lo")
  posts.setAttribute("d", segments(P, [[3, 3], [3, D - 3], [W - 3, 3]].map(([x, y]) => [[x, y, 0], [x, y, GAP * NAMES.length]])))
  const [ring, bevel] = footprint(0, 0, W, D, 5, 1.6)

  const carts = NAMES.map((name, i) => {
    const g = el("g", null, root)
    const s = solid(g)
    const lines = path(g, "line lo")
    const label = el("text", { "font-size": 16 }, g)
    label.textContent = name
    const files = [0, 1, 2].map(() => solid(g, "accent"))
    return { i, g, s, lines, label, files, slide: spring(0, 130, 17, 0.02) }
  })
  let picked = -1

  const render = (t, dt) => {
    const auto = Math.floor(t / TURN) % NAMES.length
    const active = picked >= 0 ? picked : auto
    const local = picked >= 0 ? 1 : seg(t % TURN, 0.45, 1.05)
    const closing = picked >= 0 ? 0 : seg(t % TURN, 2.7, 3.05)
    for (const k of carts) {
      k.slide.to = k.i === active && closing < 0.5 ? OUT : 0
      const z = 4 + k.i * GAP
      const x = k.slide.x
      const ringAt = ring.map((q) => ({ ...q, u: q.u + x }))
      const bevelAt = bevel.map((q) => ({ ...q, u: q.u + x }))
      draw(k.s, prism(P, front, ringAt, bevelAt, z, z + H))
      k.g.classList.toggle("hi", k.i === active)
      const top = z + H
      k.lines.setAttribute("d", tile(P, x + 8, 8, x + 56, 26, top) + segments(P, [18, 26, 34].map((n, j) => [
        [x + 66, n + 18, top],
        [x + 94 - j * 8, n + 18, top],
      ])))
      const m = planeMatrix(P, [x + 11, 21, top], [1, 0, 0], [0, -1, 0], 6.5)
      if (m) k.label.setAttribute("transform", m)
      k.label.setAttribute("class", k.i === active ? "accent" : "")
      k.files.forEach((f, j) => {
        const pop = k.i === active ? outBack(seg(local, 0.25 + j * 0.2, 0.65 + j * 0.2)) * (1 - closing) : 0
        const fx = x + 66 + j * 11
        draw(f, pop > 0.03
          ? block(P, fx, 40, fx + 8, 52, top, top + pop * (10 + j * 5))
          : { outline: "", inner: "" })
      })
    }
    stepAll(carts.map((k) => k.slide), dt ?? 0)
    ctx.read.textContent = NAMES[active].toLowerCase()
  }

  return cycle(ctx, speed, {
    duration: TURN * NAMES.length,
    hold: 1.6,
    root,
    render,
    onPointer: (p) => {
      picked = p ? clamp(Math.floor((270 - p[1]) / (210 / NAMES.length)), 0, NAMES.length - 1) : -1
    },
  })
}

export const TemplateRack = createFigure("TemplateRack", {
  id: "template-rack",
  label: "A rack of project starters; one slides out at a time and raises its first files.",
  rest: "react",
  range: [0.6, 1, 1.5],
  defaults: {},
  mount,
})
