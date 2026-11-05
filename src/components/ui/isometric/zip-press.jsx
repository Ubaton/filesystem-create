"use client"

import { createFigure } from "@/components/lib/isometric/figure"
import { block, camera, corners, deg, face, fit, planeMatrix, project, segments } from "@/components/lib/isometric/iso"
import { dot as ellipse, draw, el, path, place, solid } from "@/components/lib/isometric/stage"
import { cycle, inOut, outBack, outCubic, seg } from "@/components/lib/isometric/timeline"

/**
 * ZipPress: FileGen's export. Files arc down into an open box, the flaps fold
 * shut, a slider zips the seam, the box is stamped .ZIP, and it hops as it
 * becomes a download.
 */

const S = 72,
  H = 42,
  SHEET_W = 24,
  SHEET_H = 30
const DROPS = [
  { x: -26, y: 26, at: 0.2, tx: 14 },
  { x: 26, y: -24, at: 0.75, tx: 24 },
  { x: 66, y: 8, at: 1.3, tx: 34 },
  { x: 8, y: 66, at: 1.85, tx: 18 },
  { x: 44, y: 44, at: 2.4, tx: 28 },
]

const mount = (ctx, speed) => {
  const c = camera(45, 0.5, 1.45)
  fit(c, corners(-22, -22, S + 22, S + 22, 0, H + 62), 200, 160)
  const P = project(c)
  const root = el("g", null, ctx.svg)
  const shadow = path(root, "line dash lo")
  const behind = el("g", null, root)
  const body = solid(root)
  const seam = path(root, "line")
  const closedTeeth = path(root, "line accent")
  const stamp = el("text", { "font-size": 16, class: "accent" }, root)
  stamp.textContent = ".ZIP"
  const sheets = DROPS.map(() => {
    const g = el("g", null, root)
    return { g, paper: path(g, "edge"), text: path(g, "line lo") }
  })
  const above = el("g", null, root)
  const slider = solid(root, "accent")
  slider.outline.classList.add("glow")
  const spark = ellipse(root, c, 2.4, "dot accent")

  const len = S / 2 - 0.5
  const flaps = [
    { n: [0, 1], a: [0, 0], b: [S, 0], far: true, at: 3.55 },
    { n: [0, -1], a: [0, S], b: [S, S], far: false, at: 3.75 },
    { n: [1, 0], a: [0, 0], b: [0, S], far: true, at: 3.3 },
    { n: [-1, 0], a: [S, 0], b: [S, S], far: false, at: 3.1 },
  ].map((f) => ({ ...f, node: path(above, "edge") }))

  const render = (t) => {
    const hop = Math.sin(Math.PI * seg(t, 6.1, 6.7)) * 16
    const base = hop
    const top = H + base
    shadow.setAttribute("d", hop > 0.5 ? segments(P, [[[S / 2, S + 8, 0], [S / 2, S + 8 - hop, 0]]]) : "")
    draw(body, block(P, 0, 0, S, S, base, top))

    const reopen = inOut(seg(t, 8, 8.7))
    for (const f of flaps) {
      const shut = inOut(seg(t, f.at, f.at + 0.55)) * (1 - reopen)
      const angleDeg = 130 * (1 - shut)
      const a = deg(angleDeg)
      const dx = f.n[0] * Math.cos(a) * len,
        dy = f.n[1] * Math.cos(a) * len,
        dz = Math.sin(a) * len
      f.node.setAttribute("d", face(P, [
        [f.a[0], f.a[1], top],
        [f.b[0], f.b[1], top],
        [f.b[0] + dx, f.b[1] + dy, top + dz],
        [f.a[0] + dx, f.a[1] + dy, top + dz],
      ]))
      const parent = f.far && angleDeg > 90 ? behind : above
      if (f.node.parentNode !== parent) parent.appendChild(f.node)
    }

    DROPS.forEach((d, i) => {
      const p = seg(t, d.at, d.at + 0.85)
      const s = sheets[i]
      if (p <= 0 || p >= 1) {
        s.g.setAttribute("visibility", "hidden")
        return
      }
      s.g.setAttribute("visibility", "visible")
      const e = outCubic(p)
      const x = d.x + (d.tx - d.x) * e
      const y = d.y + (S / 2 - d.y) * e
      const z = top + 66 * (1 - p * p) - 22 * p
      const z0 = Math.max(top, z)
      const z1 = Math.max(top, z + SHEET_H)
      s.paper.setAttribute("d", face(P, [
        [x, y, z0],
        [x + SHEET_W, y, z0],
        [x + SHEET_W, y, z1],
        [x, y, z1],
      ]))
      const rows = [8, 14, 20].filter((r) => z + SHEET_H - r > z0 + 1)
      s.text.setAttribute("d", segments(P, rows.map((r) => [
        [x + 4, y, z + SHEET_H - r],
        [x + SHEET_W - 5, y, z + SHEET_H - r],
      ])))
    })

    const closedTop = seg(t, 4.3, 4.45) * (1 - seg(t, 8, 8.1))
    const zip = seg(t, 4.5, 5.5) * (1 - seg(t, 8, 8.1))
    const my = S / 2
    seam.setAttribute("d", closedTop > 0.5 ? segments(P, [[[0, my, top], [S, my, top]]]) : "")
    const ticks = []
    for (let x = 3; x < S * zip; x += 4.5) ticks.push([[x, my - 2.2, top], [x, my + 2.2, top]])
    closedTeeth.setAttribute("d", closedTop > 0.5 ? segments(P, ticks) : "")
    const sx = S * zip
    draw(slider, closedTop > 0.5 && zip < 1
      ? block(P, sx - 3, my - 4, sx + 5, my + 4, top, top + 3.5)
      : { outline: "", inner: "" })

    const pop = outBack(seg(t, 5.5, 6))
    const stamped = pop > 0.02 && reopen === 0
    const m = stamped ? planeMatrix(P, [S / 2 - 16 * pop, S / 2 + 22, top], [1, 0, 0], [0, -1, 0], 8 * pop) : null
    if (m) stamp.setAttribute("transform", m)
    stamp.setAttribute("visibility", m ? "visible" : "hidden")

    const sp = seg(t, 6.7, 7.5)
    spark.setAttribute("visibility", sp > 0 && sp < 1 ? "visible" : "hidden")
    place(spark, P(S / 2, S + 8 + sp * 16, 0))
    ctx.read.textContent = zip >= 1 ? "project.zip" : "packing"
  }

  return cycle(ctx, speed, { duration: 9, hold: 5.9, root, render })
}

export const ZipPress = createFigure("ZipPress", {
  id: "zip-press",
  label: "Files fall into a box, which folds shut, zips along its seam and is stamped .ZIP.",
  rest: "packing",
  range: [0.6, 1, 1.5],
  defaults: {},
  mount,
})
