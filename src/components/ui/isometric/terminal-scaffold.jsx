"use client"

import { createFigure } from "@/components/lib/isometric/figure"
import { block, camera, corners, facing, fit, footprint, planeMatrix, prism, project, segments, tile } from "@/components/lib/isometric/iso"
import { draw, el, path, solid } from "@/components/lib/isometric/stage"
import { cycle, inOut, outBack, partial, seg } from "@/components/lib/isometric/timeline"

/**
 * TerminalScaffold: FileGen's CLI. The command types itself on a terminal
 * slab, the output prints line by line, and each printed line raises its
 * folder or file on the pad beside it.
 */

const W = 112,
  D = 78,
  T = 6,
  PAD_X = W + 20,
  PAD_W = 66
const COMMAND = "$ npx @ubaton/filegen"
const OUTPUT = ["+ src/", "+ src/App.tsx", "+ public/", "+ README.md"]
const BUILT = [
  { x: 6, y: 8, w: 24, d: 24, h: 24, folder: true },
  { x: 36, y: 8, w: 22, d: 24, h: 11 },
  { x: 6, y: 42, w: 24, d: 24, h: 17, folder: true },
  { x: 36, y: 42, w: 22, d: 24, h: 8 },
]

const mount = (ctx, speed) => {
  const c = camera(45, 0.5, 1.28)
  fit(c, corners(0, 0, PAD_X + PAD_W, D, 0, 30), 200, 160)
  const P = project(c),
    front = facing(c)
  const root = el("g", null, ctx.svg)

  const [ring, bevel] = footprint(0, 0, W, D, 6, 2)
  draw(solid(root), prism(P, front, ring, bevel, 0, T))
  const chrome = path(root, "line lo")
  chrome.setAttribute("d", tile(P, 5, 5, W - 5, D - 5, T) + segments(P, [[[5, 14, T], [W - 5, 14, T]]]))

  const write = (y, size) => {
    const node = el("text", { "font-size": 16 }, root)
    const m = planeMatrix(P, [10, y, T], [1, 0, 0], [0, -1, 0], size)
    if (m) node.setAttribute("transform", m)
    return node
  }
  const command = write(26, 4.1)
  command.setAttribute("class", "hi")
  const output = OUTPUT.map((_, i) => write(39 + i * 10, 3.8))
  const caret = path(root, "line accent")

  const route = path(root, "line dash accent")
  const [padRing, padBevel] = footprint(PAD_X, 0, PAD_X + PAD_W, D, 5, 1.6)
  draw(solid(root), prism(P, front, padRing, padBevel, 0, 2))
  const parts = BUILT.map((b, i) => ({ ...b, i })).sort((a, z) => a.x + a.y - (z.x + z.y)).map((b) => {
    const s = solid(root, b.folder ? "accent" : "")
    if (b.folder) s.outline.classList.add("glow")
    return { ...b, s }
  })

  const render = (t) => {
    const n = Math.floor(seg(t, 0.2, 2) * COMMAND.length)
    const wipe = seg(t, 8.2, 8.5)
    command.textContent = wipe > 0.5 ? "" : COMMAND.slice(0, n)
    const blink = t < 2.3 && Math.floor(t * 3) % 2 === 0
    const cx = 10 + n * 2.9
    caret.setAttribute("d", blink ? segments(P, [[[cx, 21.5, T], [cx, 26.5, T]]]) : "")
    OUTPUT.forEach((line, i) => {
      output[i].textContent = t > 2.4 + i * 0.75 && wipe < 0.5 ? line : ""
      output[i].setAttribute("class", i === Math.floor((t - 2.4) / 0.75) ? "accent" : "")
    })
    const out = 1 - inOut(seg(t, 7.9, 8.6))
    route.setAttribute("d", segments(P, partial([[W, D / 2, T], [PAD_X, D / 2, 2]], seg(t, 2.1, 2.6) * out)))
    for (const b of parts) {
      const h = b.h * outBack(seg(t, 2.6 + b.i * 0.75, 3.3 + b.i * 0.75)) * out
      const x = PAD_X + b.x
      draw(b.s, h > 0.2 ? block(P, x, b.y, x + b.w, b.y + b.d, 2, 2 + h) : { outline: "", inner: "" })
    }
  }

  return cycle(ctx, speed, { duration: 9, hold: 6.8, root, render })
}

export const TerminalScaffold = createFigure("TerminalScaffold", {
  id: "terminal-scaffold",
  label: "A terminal types the FileGen command and each printed line raises a folder or file.",
  rest: "npx @ubaton/filegen",
  range: [0.6, 1, 1.5],
  defaults: {},
  mount,
})
