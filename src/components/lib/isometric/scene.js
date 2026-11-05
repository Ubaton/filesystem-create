import { round } from "./iso";
import { centroid, dot, normal } from "./mesh";

/** One painted record: polygons (or open polylines) under one class, or a line of text. */
export class Piece {
  constructor(cls, rings, open = false, pick = false, part, tint, text) {
    this.cls = cls;
    this.rings = rings;
    this.open = open;
    this.pick = pick;
    this.part = part;
    this.tint = tint;
    this.text = text;
  }
  /** The rings as svg path data. */
  get d() {
    return this.rings.map((r) => path(r, !this.open)).join("");
  }
}

/** The world direction toward the camera, for culling and depth. */
export function toCamera(c) {
  const lift = Math.sqrt(1 - c.k * c.k)
  return [Math.sin(c.az), Math.cos(c.az), c.k / lift];
}

/** A label on a plane: see `Label`. */
export const label = (text, at, u, v, size, extra = {}) => ({
  text,
  at,
  u,
  v,
  size,
  ...extra
})

const path = (pts, close = true) => (pts.length ? `M${pts.map((p) => `${round(p[0])} ${round(p[1])}`).join("L")}${close ? "Z" : ""}` : "")

export function inside(p, poly) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i],
      b = poly[j]
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit
  }
  return hit
}

const isStroke = it => "pts" in it
const isLabel = it => "text" in it

const EPS = 1e-4
/** Above this many overlapping items in one layer, the plane test is skipped and depth alone orders them. */
const LIMIT = 2400

/**
 * -1: a paints first; 1: b paints first; 0: no plane splits them, or the
 * planes that do disagree (then their outlines cannot really overlap).
 */
function separate(a, b, toward) {
  let vote = 0
  for (let k = 0; k < toward.length; k++) {
    const e = toward[k]
    if (Math.abs(e) < 1e-6) continue
    let v = 0
    if (a.hi[k] <= b.lo[k] + EPS) v = e > 0 ? -1 : 1
    else if (b.hi[k] <= a.lo[k] + EPS) v = e > 0 ? 1 : -1
    if (!v) continue
    if (vote && v !== vote) return 0
    vote = v
  }
  return vote
}

/** Above this many face × point checks, a pair falls back to depth. */
const PLANE_WORK = 6000

function planesOf(e, eye) {
  if (e.planes) return e.planes
  const m = (e.it).mesh
  e.planes = m.f.map((f) => {
    const n = normal(m, f),
      len = Math.hypot(n[0], n[1], n[2]) || 1
    const u = [n[0] / len, n[1] / len, n[2] / len]
    return [u, dot(u, m.v[f[0]]), dot(u, eye) > 1e-9];
  })
  return e.planes
}

/**
 * When no axis splits a pair: if everything in `o` sits on the outer side of one of mesh `m`'s
 * faces, `o` is in front of that face (when it faces the camera) or behind it (when it faces away).
 * -1: m paints first; 1: o paints first; 0: undecided.
 */
function facing(m, o, eye) {
  if (!m.planes && (!("mesh" in m.it) || m.it.mesh.f.length * o.wp.length > PLANE_WORK)) return 0
  const tol = 1e-3
  for (const [n, d, front] of planesOf(m, eye)) {
    let all = true
    for (const p of o.wp)
      if (dot(n, p) - d < -tol) {
        all = false
        break
      }
    if (all) return front ? -1 : 1
  }
  if (m.face !== undefined) {
    // a single face: whatever lies wholly behind its plane is behind it
    const [n, d] = m.planes[0]
    let all = true
    for (const p of o.wp)
      if (dot(n, p) - d > tol) {
        all = false
        break
      }
    if (all) return 1
  }
  return 0
}

/** Whether `facing(m, o)` can decide anything. */
const planar = (m, o) => !!m.planes || ("mesh" in m.it && m.it.mesh.f.length * o.wp.length <= PLANE_WORK)

/**
 * Screen directions for the overlap test. An outline's reach along each of
 * them bounds it by a 32-gon that is never smaller than its convex hull and at
 * most 0.5% larger, and two such 32-gons overlap exactly when their reaches
 * overlap along all sixteen axes: a separating-axis test in 16 comparisons.
 */
const DIRS = 32
const DX = Float64Array.from({ length: DIRS }, (_, k) => Math.cos((2 * Math.PI * k) / DIRS))
const DY = Float64Array.from({ length: DIRS }, (_, k) => Math.sin((2 * Math.PI * k) / DIRS))

function reach(e) {
  if (e.reach) return e.reach
  const r = new Float64Array(DIRS).fill(-Infinity)
  for (const [x, y] of e.sp)
    for (let k = 0; k < DIRS; k++) {
      const t = x * DX[k] + y * DY[k]
      if (t > r[k]) r[k] = t
    }
  return (e.reach = r)
}

/** Whether two outlines overlap by more than a hair. */
function overlap(a, b) {
  if (a.sp.length < 2 || b.sp.length < 2) return true
  const p = reach(a),
    q = reach(b),
    half = DIRS / 2
  for (let k = 0; k < half; k++) {
    // along direction k, a spans [−p[k + half], p[k]] and b spans [−q[k + half], q[k]]
    if (p[k] + q[k + half] <= 1e-3 || q[k] + p[k + half] <= 1e-3) return false
  }
  return true
}

/** Depth order, corrected wherever a separating plane says otherwise. */
function order(es, toward, eye) {
  es.sort((a, b) => a.depth - b.depth || a.i - b.i)
  const n = es.length
  if (n < 2 || n > LIMIT) return es
  const next = Array.from({ length: n }, () => [])
  const need = new Int32Array(n)
  // sweep across the screen: only items whose boxes share some x are compared
  const byX = Array.from({ length: n }, (_, i) => i).sort((p, q) => es[p].x0 - es[q].x0)
  for (let s = 0; s < n; s++) {
    const xi = byX[s],
      x1 = es[xi].x1
    for (let t = s + 1; t < n; t++) {
      const xj = byX[t]
      if (es[xj].x0 > x1) break
      const i = xi < xj ? xi : xj,
        j = xi < xj ? xj : xi
      const a = es[i],
        b = es[j]
      if (a.y1 < b.y0 || b.y1 < a.y0) continue
      if (a.thin && b.thin) continue
      let r = separate(a, b, toward)
      // with no axis to split them, only a face plane can, and that needs a mesh small enough to test
      if (!r && !planar(a, b) && !planar(b, a)) continue
      if (!overlap(a, b)) continue
      if (!r) r = facing(a, b, eye) || -facing(b, a, eye)
      if (r < 0) {
        next[i].push(j)
        need[j]++
      } else if (r > 0) {
        next[j].push(i)
        need[i]++
      }
    }
  }
  // Kahn's algorithm, always taking the shallowest ready item. A cycle (rare: non-convex parts) is
  // broken at the item waiting on the fewest others, the shallowest of those.
  const heap = []
  const push = (v) => {
    heap.push(v)
    let i = heap.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (heap[p] <= v) break
      heap[i] = heap[p]
      i = p
    }
    heap[i] = v
  }
  const pop = () => {
    const top = heap[0],
      last = heap.pop()
    if (heap.length) {
      heap[0] = last
      for (let i = 0; ;) {
        const l = 2 * i + 1,
          r = l + 1
        let m = i
        if (l < heap.length && heap[l] < heap[m]) m = l
        if (r < heap.length && heap[r] < heap[m]) m = r
        if (m === i) break
        ;[heap[i], heap[m]] = [heap[m], heap[i]]
        i = m
      }
    }
    return top
  }
  const done = new Uint8Array(n)
  for (let i = 0; i < n; i++) if (!need[i]) push(i)
  const out = []
  while (out.length < n) {
    let v = -1
    while (heap.length) {
      const c = pop()
      if (!done[c]) {
        v = c
        break
      }
    }
    if (v < 0) {
      for (let i = 0; i < n; i++) if (!done[i] && (v < 0 || need[i] < need[v])) v = i
    }
    done[v] = 1
    out.push(es[v])
    for (const w of next[v]) if (--need[w] === 0 && !done[w]) push(w)
  }
  return out
}

const key = (a, b) => (a < b ? a * 1048576 + b : b * 1048576 + a)
/** Two visible facets of a curved surface meeting at more than this show the fold as a line. */
const CREASE = Math.cos((50 * Math.PI) / 180)

/** Projects, culls and orders items into flat records. Pure: no DOM, so it is testable. */
export function compose(c, items, opts = {}) {
  const cos = Math.cos(c.az),
    sin = Math.sin(c.az),
    lift = Math.sqrt(1 - c.k * c.k)
  const P = p => [c.ox + c.s * (p[0] * cos - p[1] * sin), c.oy + c.s * ((p[0] * sin + p[1] * cos) * c.k - p[2] * lift)]
  const eye = toCamera(c)
  const depthOf = (p) => dot(p, eye)
  const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1], ...(opts.axes ?? [])]
  const toward = axes.map((a) => dot(a, eye))

  const make = (it, i, pts, mid) => {
    const lo = axes.map(() => Infinity),
      hi = axes.map(() => -Infinity)
    const sp = new Array(pts.length)
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity
    for (let q = 0; q < pts.length; q++) {
      const p = pts[q]
      for (let k = 0; k < axes.length; k++) {
        const t = p[0] * axes[k][0] + p[1] * axes[k][1] + p[2] * axes[k][2]
        if (t < lo[k]) lo[k] = t
        if (t > hi[k]) hi[k] = t
      }
      const s = (sp[q] = P(p))
      if (s[0] < x0) x0 = s[0]
      if (s[0] > x1) x1 = s[0]
      if (s[1] < y0) y0 = s[1]
      if (s[1] > y1) y1 = s[1]
    }
    mid ??= [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2]
    return {
      it,
      i,
      layer: it.layer ?? 0,
      depth: depthOf(mid) + (it.bias ?? 0),
      sp,
      x0,
      y0,
      x1,
      y1,
      thin: isStroke(it) || isLabel(it) || !!it.wire,
      lo,
      hi,
      wp: pts,
    };
  }

  const entries = []
  items.forEach((it, i) => {
    if (!isLabel(it) && !isStroke(it) && it.split && !it.wire) {
      // one entry per visible face, each sorted on its own: a bore with a piston in it, a cutaway
      const m = it.mesh
      const solid = { all: m.f.map((f, k) => ({ f, k, n: normal(m, f) })), front: [] }
      solid.front = solid.all.map(({ n }) => dot(n, eye) > 1e-9)
      for (const { f, k, n } of solid.all) {
        if (!solid.front[k]) continue
        const pts = f.map((q) => m.v[q])
        const e = make(it, i, pts, centroid(m, f))
        const u = unit(n)
        e.planes = [[u, dot(u, pts[0]), true]]
        e.face = k
        e.solid = solid
        entries.push(e)
      }
      return
    }
    let pts
    let mid = null
    if (isLabel(it)) {
      const w = it.text.length * 0.62 * it.size,
        shift = it.anchor === "middle" ? -w / 2 : it.anchor === "end" ? -w : 0
      const a = [it.at[0] + it.u[0] * shift, it.at[1] + it.u[1] * shift, it.at[2] + it.u[2] * shift]
      const b = [a[0] + it.u[0] * w, a[1] + it.u[1] * w, a[2] + it.u[2] * w]
      pts = [
        a,
        b,
        [a[0] + it.v[0] * it.size, a[1] + it.v[1] * it.size, a[2] + it.v[2] * it.size],
        [b[0] + it.v[0] * it.size, b[1] + it.v[1] * it.size, b[2] + it.v[2] * it.size],
      ]
      mid = it.at
    } else if (isStroke(it)) {
      pts = it.pts
      const n = pts.length || 1
      mid = pts.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n, s[2] + p[2] / n], [0, 0, 0])
    } else {
      pts = it.mesh.v
    }
    entries.push(make(it, i, pts, mid))
  })

  // group by layer, then order each group
  entries.sort((a, b) => a.layer - b.layer || a.i - b.i)
  const ordered = []
  for (let s = 0; s < entries.length;) {
    let e = s
    while (e < entries.length && entries[e].layer === entries[s].layer) e++
    ordered.push(...order(entries.slice(s, e), toward, eye))
    s = e
  }

  const out = []
  const dbg = { normals: [], marks: [] }
  ordered.forEach((en, rank) => {
    const it = en.it
    if (opts.debug) dbg.marks.push([[(en.x0 + en.x1) / 2, (en.y0 + en.y1) / 2], rank])
    if (isStroke(it)) {
      out.push(
        new Piece(`line ${it.cls ?? ""}`.trim(), [en.sp], !it.closed, false, it.part)
      )
      return
    }
    if (isLabel(it)) {
      // em units: x along u, y down (against v); the cap height of a 1em font is about 0.72em
      const em = it.size / 0.72
      const o = P(it.at),
        ux = P(
          [it.at[0] + it.u[0] * em, it.at[1] + it.u[1] * em, it.at[2] + it.u[2] * em]
        )
      const vy = P(
        [it.at[0] - it.v[0] * em, it.at[1] - it.v[1] * em, it.at[2] - it.v[2] * em]
      )
      const m = [ux[0] - o[0], ux[1] - o[1], vy[0] - o[0], vy[1] - o[1], o[0], o[1]]
      // text seen from behind its plane reads mirrored, so a mirrored (or edge-on) matrix means hidden
      if (m[0] * m[3] - m[1] * m[2] <= 1e-9) return
      out.push(new Piece(
        `label ${it.cls ?? ""}`.trim(),
        [],
        false,
        false,
        it.part,
        undefined,
        { s: it.text, m, anchor: it.anchor ?? "start" }
      ))
      return
    }
    const m = it.mesh
    const base = it.cls ?? ""
    const all = en.solid?.all ?? m.f.map((f, k) => ({ f, k, n: normal(m, f) }))
    const front = en.solid?.front ?? all.map(({ n }) => dot(n, eye) > 1e-9)
    const softAt = (k) => {
      if (!it.smooth) return false
      if (m.soft) return !!m.soft[k]
      const n = all[k].n
      return Math.abs(n[2] / (Math.hypot(n[0], n[1], n[2]) || 1)) < 0.2;
    }
    const shadeOf = (n) => {
      const up = n[2] / (Math.hypot(n[0], n[1], n[2]) || 1)
      return up > 0.5 ? " tone-top" : n[0] * cos - n[1] * sin < 0 ? " tone-left" : " tone-right"
    }

    if (en.face !== undefined) {
      // one face of a split solid, with the outline edges it owns
      const k = en.face,
        f = all[k].f,
        poly = en.sp,
        soft = softAt(k)
      const pick = !it.inert
      const tint = it.tint ? " tint" : ""
      out.push(new Piece(
        `face ${soft ? "facet " : ""}${base}${!soft && it.shade ? shadeOf(all[k].n) : ""}${tint}`.trim(),
        [poly],
        false,
        pick,
        it.part,
        it.tint
      ))
      if (soft) {
        const across = edges(m),
          lines = []
        for (let j = 0; j < f.length; j++) {
          const fs = across.get(key(f[j], f[(j + 1) % f.length]))
          const other = fs?.faces.find((x) => x !== k)
          if (other !== undefined && front[other] && softAt(other) && !folds(all[k].n, all[other].n)) continue
          lines.push([poly[j], poly[(j + 1) % f.length]])
        }
        if (lines.length) out.push(new Piece(`line edge ${base}`.trim(), lines, true, false, it.part))
      }
      if (opts.debug) {
        const q = centroid(m, f),
          n = unit(all[k].n),
          s = 10 / c.s
        dbg.normals.push([P(q), P([q[0] + n[0] * s, q[1] + n[1] * s, q[2] + n[2] * s])])
      }
      return
    }

    const pts = en.sp

    if (it.wire) {
      const across = edges(m)
      const seen = [],
        hidden = []
      for (const [, fs] of across) {
        const [ea, eb] = fs.edge
        const seg = [pts[ea], pts[eb]]
        if (fs.faces.length < 2) {
          ;(front[fs.faces[0]] ? seen : hidden).push(seg)
          continue
        }
        const [a, b] = fs.faces
        if (softAt(a) && softAt(b)) {
          if (front[a] !== front[b]) seen.push(seg)
          else if (folds(all[a].n, all[b].n)) (front[a] ? seen : hidden).push(seg)
          continue
        }
        if (parallel(all[a].n, all[b].n)) continue
        ;(front[a] || front[b] ? seen : hidden).push(seg)
      }
      if (hidden.length) out.push(new Piece(`line wire hidden ${base}`.trim(), hidden, true, false, it.part))
      if (seen.length) out.push(new Piece(`line wire ${base}`.trim(), seen, true, false, it.part))
      return
    }

    const faces = all
      .filter(({ k }) => front[k])
      .map((x) => ({ ...x, depth: depthOf(centroid(m, x.f)) }))
      .sort((a, b) => a.depth - b.depth)
    // The visible facets of a curved surface are filled as one path, so no seams show between them.
    // They go first: on a solid, visible faces only overlap where a flat face is in front.
    const softSeen = new Set()
    for (const { k } of faces) if (softAt(k)) softSeen.add(k)
    const pick = !it.inert
    if (softSeen.size) {
      const polys = faces.filter(({ k }) => softSeen.has(k)).map(({ f }) => f.map((i) => pts[i]))
      out.push(new Piece(
        `face facet ${base}${it.tint ? " tint" : ""}`.trim(),
        polys,
        false,
        pick,
        it.part,
        it.tint
      ))
    }
    for (const { f, k, n } of faces) {
      if (softSeen.has(k)) continue
      const poly = f.map((i) => pts[i])
      let cls = `face ${base}`
      if (it.shade) cls += shadeOf(n)
      if (it.tint) cls += " tint"
      out.push(new Piece(cls.trim(), [poly], false, pick, it.part, it.tint))
    }
    if (softSeen.size) {
      // an edge of a visible facet is drawn unless the face across is also a visible facet that carries on the curve
      const lines = []
      for (const [, fs] of edges(m)) {
        const inA = fs.faces.filter((k) => softSeen.has(k))
        if (!inA.length) continue
        if (inA.length === 2 && !folds(all[inA[0]].n, all[inA[1]].n)) continue
        lines.push([pts[fs.edge[0]], pts[fs.edge[1]]])
      }
      out.push(new Piece(`line edge ${base}`.trim(), lines, true, false, it.part))
    }
    if (opts.debug) {
      for (const { f, n } of faces) {
        const q = centroid(m, f),
          len = Math.hypot(n[0], n[1], n[2]) || 1,
          s = 10 / c.s
        dbg.normals.push([P(q), P(
          [q[0] + (n[0] / len) * s, q[1] + (n[1] / len) * s, q[2] + (n[2] / len) * s]
        )])
      }
    }
  })

  if (opts.debug) {
    out.push(new Piece("debug pick", out.filter((o) => o.pick).flatMap((o) => o.rings)))
    out.push(new Piece("debug line", dbg.normals, true))
    for (const [p, rank] of dbg.marks)
      out.push(new Piece(
        "debug label",
        [],
        false,
        false,
        undefined,
        undefined,
        { s: String(rank), m: [8, 0, 0, 8, p[0], p[1]], anchor: "middle" }
      ))
  }
  return out
}

/** Every edge of a mesh once, with the faces that share it. Cached by face list, which transforms share. */
const edgeCache = new WeakMap()
function edges(m) {
  let map = edgeCache.get(m.f)
  if (map) return map
  map = new Map()
  m.f.forEach((f, k) =>
    f.forEach((a, i) => {
      const b = f[(i + 1) % f.length],
        id = key(a, b)
      const e = map.get(id)
      if (e) e.faces.push(k)
      else map.set(id, { edge: [a, b], faces: [k] })
    }))
  edgeCache.set(m.f, map)
  return map
}

const unit = (n) => {
  const l = Math.hypot(n[0], n[1], n[2]) || 1
  return [n[0] / l, n[1] / l, n[2] / l];
}
const folds = (a, b) => dot(unit(a), unit(b)) < CREASE
const parallel = (a, b) => dot(unit(a), unit(b)) > 0.9999

/** Hit-testing over painted records, shared by every painter. */
export function picker() {
  let picks = []
  return {
    set(out) {
      picks = []
      for (const o of out) {
        if (!o.pick || !o.part) continue
        for (const poly of o.rings) {
          let x0 = Infinity,
            y0 = Infinity,
            x1 = -Infinity,
            y1 = -Infinity
          for (const p of poly) {
            if (p[0] < x0) x0 = p[0]
            if (p[0] > x1) x1 = p[0]
            if (p[1] < y0) y0 = p[1]
            if (p[1] > y1) y1 = p[1]
          }
          picks.push({ poly, part: o.part, x0, y0, x1, y1 })
        }
      }
    },
    pick(p) {
      for (let i = picks.length - 1; i >= 0; i--) {
        const k = picks[i]
        if (p[0] < k.x0 || p[0] > k.x1 || p[1] < k.y0 || p[1] > k.y1) continue
        if (inside(p, k.poly)) return k.part
      }
      return null
    },
  };
}

/** A scene bound to an svg group: one reused element per record, so an ordinary frame creates nothing. */
export function scene(parent, options = {}) {
  const NS = "http://www.w3.org/2000/svg"
  const pool = []
  const hits = picker()
  let last = []

  function node(i, tag) {
    const had = pool[i]
    if (had && had.localName === tag) return had
    const el = document.createElementNS(NS, tag)
    if (had) parent.replaceChild(el, had)
    else parent.appendChild(el)
    pool[i] = el
    return el
  }

  const painter = {
    options,
    render(c, items) {
      painter.paint(compose(c, items, painter.options))
    },
    paint(out) {
      out.forEach((o, i) => {
        const el = node(i, o.text ? "text" : "path")
        if (el.getAttribute("class") !== o.cls) el.setAttribute("class", o.cls)
        if (o.text) {
          const [a, b, cc, d, e, f] = o.text.m
          el.setAttribute(
            "transform",
            `matrix(${a / 16} ${b / 16} ${cc / 16} ${d / 16} ${round(e)} ${round(f)})`
          )
          el.setAttribute("font-size", "16")
          el.setAttribute("text-anchor", o.text.anchor)
          if (el.textContent !== o.text.s) el.textContent = o.text.s
          return
        }
        const d = o.d
        if (el.getAttribute("d") !== d) el.setAttribute("d", d)
        if (o.tint) el.style.setProperty("--tint", o.tint)
        else el.style.removeProperty("--tint")
      })
      for (let i = out.length; i < pool.length; i++) {
        const el = pool[i]
        if (el.localName === "text") {
          if (el.textContent) el.textContent = ""
        } else if (el.getAttribute("d")) el.setAttribute("d", "")
      }
      hits.set(out)
      last = out
    },
    pick: (p) => hits.pick(p),
    last: () => last,
  }
  return painter
}
