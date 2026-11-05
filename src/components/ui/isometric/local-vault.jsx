"use client"

import { createFigure } from "@/components/lib/isometric/figure"
import { block, camera, corners, face, fit, project, segments } from "@/components/lib/isometric/iso"
import { dot, draw, el, path, place, solid } from "@/components/lib/isometric/stage"
import { cycle, seg } from "@/components/lib/isometric/timeline"

/**
 * LocalVault: FileGen's privacy promise. A project sits inside a glass case
 * with its files circling it. Packets that try to leave strike the glass,
 * ripple, and fall back in.
 */

const S = 100,
  H = 54,
  MID = S / 2,
  ORBIT = 35,
  SHEET = 20,
  DURATION = 8
const PACKETS = [
  { at: 0.6, dir: [1, 0] },
  { at: 2.9, dir: [0, 1] },
  { at: 5.2, dir: [1, 0] },
]

const mount = (ctx, speed) => {
  const c = camera(45, 0.5, 1.45)
  fit(c, corners(-12, -12, S + 12, S + 12, 0, H), 200, 160)
  const P = project(c)
  const root = el("g", null, ctx.svg)
  draw(solid(root), block(P, -8, -8, S + 8, S + 8, -5, 0))
  const backGlass = path(root, "glass")
  backGlass.setAttribute("d", face(P, [[0, 0, 0], [S, 0, 0], [S, 0, H], [0, 0, H]]) + face(P, [[0, 0, 0], [0, S, 0], [0, S, H], [0, 0, H]]))
  const orbitLine = path(root, "line dash lo")
  const steps = 48
  orbitLine.setAttribute("d", segments(P, Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2,
      z = ((i + 1) / steps) * Math.PI * 2
    return [[MID + Math.cos(a) * ORBIT, MID + Math.sin(a) * ORBIT, 1], [MID + Math.cos(z) * ORBIT, MID + Math.sin(z) * ORBIT, 1]]
  })))

  const stack = el("g", null, root)
  const core = solid(stack, "accent")
  core.outline.classList.add("glow")
  draw(core, block(P, MID - 11, MID - 11, MID + 11, MID + 11, 0, 20))
  const orbiters = [0, 1, 2, 3].map((i) => {
    const g = el("g", null, stack)
    return { i, g, paper: path(g, "edge"), text: path(g, "line lo"), depth: 0 }
  })
  const packets = PACKETS.map((p) => ({ ...p, node: dot(root, c, 2.2, "dot accent"), ripple: path(root, "line accent") }))

  const frontGlass = path(root, "glass")
  frontGlass.setAttribute("d", face(P, [[S, 0, 0], [S, S, 0], [S, S, H], [S, 0, H]]) + face(P, [[0, S, 0], [S, S, 0], [S, S, H], [0, S, H]]) + face(P, [[0, 0, H], [S, 0, H], [S, S, H], [0, S, H]]))

  const render = (t) => {
    const items = [{ depth: MID + MID, node: core.g }]
    for (const o of orbiters) {
      const a = (t / DURATION) * Math.PI * 2 + (o.i * Math.PI) / 2
      const x = MID + Math.cos(a) * ORBIT,
        y = MID + Math.sin(a) * ORBIT
      const z = 7 + Math.sin(a * 2 + o.i) * 3
      // the sheet keeps facing the viewer's left wall so it never turns edge-on
      const w = SHEET / 2
      o.paper.setAttribute("d", face(P, [[x - w, y, z], [x + w, y, z], [x + w, y, z + 19], [x - w, y, z + 19]]))
      o.text.setAttribute("d", segments(P, [13, 9, 5].map((r) => [[x - w + 2, y, z + r], [x + w - 2, y, z + r]])))
      items.push({ depth: x + y, node: o.g })
    }
    items.sort((a, b) => a.depth - b.depth)
    const current = Array.from(stack.children)
    if (items.some((it, i) => current[i] !== it.node)) items.forEach((it) => stack.appendChild(it.node))

    for (const p of packets) {
      const go = seg(t, p.at, p.at + 0.7)
      const back = seg(t, p.at + 0.7, p.at + 1.5)
      const active = go > 0 && back < 1
      p.node.setAttribute("visibility", active ? "visible" : "hidden")
      const reach = (go * go - back * back * (2 - back) * 1) * (MID - 1)
      const dist = 14 + Math.max(0, reach) * 0.96
      const z = 26 + Math.sin(go * Math.PI) * 10
      place(p.node, P(MID + p.dir[0] * dist, MID + p.dir[1] * dist, z))
      const r = seg(t, p.at + 0.7, p.at + 1.4)
      if (r > 0 && r < 1) {
        const size = 3 + r * 13
        const wall = p.dir[0] ? [[S, MID - size, z - size], [S, MID + size, z - size], [S, MID + size, z + size], [S, MID - size, z + size]]
          : [[MID - size, S, z - size], [MID + size, S, z - size], [MID + size, S, z + size], [MID - size, S, z + size]]
        p.ripple.setAttribute("d", face(P, wall))
        p.ripple.style.opacity = String(1 - r)
      } else p.ripple.setAttribute("d", "")
    }
  }

  return cycle(ctx, speed, { duration: DURATION, hold: 1.2, root, render })
}

export const LocalVault = createFigure("LocalVault", {
  id: "local-vault",
  label: "A project in a glass case; files circle inside and outgoing packets bounce back.",
  rest: "local",
  range: [0.6, 1, 1.5],
  defaults: {},
  mount,
})
