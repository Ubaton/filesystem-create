export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t
export const deg = (d) => (d * Math.PI) / 180
/** Two decimals keep a thin stroke exact at any zoom and keep path strings short. */
export const round = (n) => Math.round(n * 100) / 100

const pt = (p) => `${round(p[0])} ${round(p[1])}`

/** A closed polygon. */
export const closed = (pts) => (pts.length ? `M${pts.map(pt).join("L")}Z` : "")
/** An open polyline; empty when there is nothing to draw. */
export const polyline = (pts) => (pts.length < 2 ? "" : `M${pts.map(pt).join("L")}`)
/** One segment as its own subpath, so several can share a `d`. */
export const line = (a, b) => `M${pt(a)}L${pt(b)}`

/* ---------- camera ---------- */

export const camera = (azDeg, k, s) => ({
  az: deg(azDeg),
  k,
  s,
  ox: 0,
  oy: 0
})

/** The projector for the camera as it is now. Call again if the camera moves. */
export function project(c) {
  const cos = Math.cos(c.az),
    sin = Math.sin(c.az),
    lift = Math.sqrt(1 - c.k * c.k)
  return (x, y, z) => {
    const X = x * cos - y * sin
    const Y = x * sin + y * cos
    return [c.ox + c.s * X, c.oy + c.s * (Y * c.k - z * lift)]
  }
}

/**
 * An SVG `matrix(…)` that lays 16px text on a world plane: x runs along `u`, up along `v`, and the
 * cap height is `size` world units. Null when the plane is seen from behind (the text would mirror).
 */
export function planeMatrix(P, at, u, v, size) {
  const em = size / 0.72
  const o = P(at[0], at[1], at[2])
  const a = P(at[0] + u[0] * em, at[1] + u[1] * em, at[2] + u[2] * em)
  const b = P(at[0] - v[0] * em, at[1] - v[1] * em, at[2] - v[2] * em)
  const m = [a[0] - o[0], a[1] - o[1], b[0] - o[0], b[1] - o[1]]
  if (m[0] * m[3] - m[1] * m[2] <= 1e-9) return null
  const f = (n) => Math.round((n / 16) * 1e4) / 1e4
  return `matrix(${f(m[0])} ${f(m[1])} ${f(m[2])} ${f(m[3])} ${round(o[0])} ${round(o[1])})`;
}

/** The ground point under a screen point, on the plane at height z. Pointer hits are tested in world units. */
export function unproject(c, sx, sy, z = 0) {
  const cos = Math.cos(c.az),
    sin = Math.sin(c.az),
    lift = Math.sqrt(1 - c.k * c.k)
  const X = (sx - c.ox) / c.s
  const Y = ((sy - c.oy) / c.s + z * lift) / c.k
  return [X * cos + Y * sin, -X * sin + Y * cos]
}

/** Moves the camera so the screen bounds of `pts` are centred on (cx, cy). */
export function fit(c, pts, cx = 200, cy = 160) {
  c.ox = 0
  c.oy = 0
  const P = project(c)
  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity
  for (const p of pts) {
    const [x, y] = P(p[0], p[1], p[2])
    x0 = Math.min(x0, x)
    x1 = Math.max(x1, x)
    y0 = Math.min(y0, y)
    y1 = Math.max(y1, y)
  }
  c.ox = cx - (x0 + x1) / 2
  c.oy = cy - (y0 + y1) / 2
}

/** The corners of a box, for `fit`. */
export const corners = (x0, y0, x1, y1, z0, z1) => [
  [x0, y0, z0],
  [x1, y0, z0],
  [x0, y1, z0],
  [x1, y1, z0],
  [x0, y0, z1],
  [x1, y0, z1],
  [x0, y1, z1],
  [x1, y1, z1],
]

/* ---------- outlines on the ground ---------- */

/** A rounded rectangle, sampled with outward normals; `n` samples per corner. */
export function roundRect(u0, v0, u1, v1, r, n = 4) {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2))
  const out = []
  const arcs = [
    [u1 - r, v1 - r, 0],
    [u0 + r, v1 - r, 90],
    [u0 + r, v0 + r, 180],
    [u1 - r, v0 + r, 270],
  ]
  for (const [cu, cv, a0] of arcs) {
    for (let i = 0; i <= n; i++) {
      const a = deg(a0 + (90 * i) / n),
        ca = Math.cos(a),
        sa = Math.sin(a)
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa })
    }
  }
  return out
}

/** A circle of radius r about (cu, cv). */
export function circle(r, cu = 0, cv = 0, n = 64) {
  const out = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2,
      ca = Math.cos(a),
      sa = Math.sin(a)
    out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa })
  }
  return out
}

/** A rounded footprint and the same footprint inset by `b`, for its bevel line. */
export const footprint = (x0, y0, x1, y1, r, b) => [
  roundRect(x0, y0, x1, y1, r),
  roundRect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
]

/** Projects a ground ring at height z. */
export const lift = (P, ring, z) => ring.map((q) => P(q.u, q.v, z))

/** Convex hull (monotone chain). */
export function hull(input) {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (pts.length < 3) return pts
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = [],
    upper = []
  for (const p of pts) {
    while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper);
}

/** Whether a sample's normal faces the camera: screen-down on the ground is (sin az, cos az). */
export const facing = (c) => {
  const s = Math.sin(c.az),
    co = Math.cos(c.az)
  return (q) => q.nu * s + q.nv * co >= -1e-6;
}

/** The single cyclic run of samples that pass `keep`, in ring order. */
export function run(ring, keep) {
  const n = ring.length
  let start = -1
  for (let i = 0; i < n; i++)
    if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      start = i
      break
    }
  if (start < 0) return keep(ring[0]) ? ring.slice() : [];
  const out = []
  for (let i = 0; i < n && keep(ring[(start + i) % n]); i++) out.push(ring[(start + i) % n])
  return out
}

/* ---------- solids ---------- */

/**
 * A rounded prism standing from z0 to z1. The outline is the hull of its top
 * and bottom rings, so vertical edges are never drawn; the one inner line is
 * the front run of an inset ring on the lid, which reads as a bevel. Works
 * for circles too, which makes it a cylinder.
 */
export function prism(P, front, ring, bevel, z0, z1) {
  return {
    outline: closed(hull(lift(P, ring, z1).concat(lift(P, ring, z0)))),
    inner: bevel ? polyline(lift(P, run(bevel, front), z1)) : "",
  };
}

/**
 * A sharp box from (x0, y0, z0) to (x1, y1, z1): the classic three-face cube.
 * The outline is its hull; the inner lines are the two lid edges and the one
 * vertical edge that meet at the corner nearest the camera.
 */
export function block(P, x0, y0, x1, y1, z0, z1) {
  const foot = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ]
  const bottom = foot.map(([x, y]) => P(x, y, z0))
  const top = foot.map(([x, y]) => P(x, y, z1))
  let near = 0
  for (let i = 1; i < 4; i++) if (bottom[i][1] > bottom[near][1]) near = i
  const prev = (near + 3) % 4,
    next = (near + 1) % 4
  return {
    outline: closed(hull(top.concat(bottom))),
    inner: line(top[prev], top[near]) + line(top[near], top[next]) + (z1 - z0 > 0.01 ? line(top[near], bottom[near]) : ""),
  };
}

/** Any planar polygon given by world points: a wall, a lid, a sheet of paper. */
export const face = (P, pts) => closed(pts.map((p) => P(p[0], p[1], p[2])))

/** World segments as one path. */
export const segments = (P, pairs) => pairs.map(([a, b]) => line(P(a[0], a[1], a[2]), P(b[0], b[1], b[2]))).join("")

/** A ring turned by `a` radians about (cu, cv); normals turn with it. */
export function turn(ring, a, cu, cv) {
  const c = Math.cos(a),
    s = Math.sin(a)
  return ring.map((q) => {
    const du = q.u - cu,
      dv = q.v - cv
    return { u: cu + du * c - dv * s, v: cv + du * s + dv * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }
  });
}

/** A flat quad lying on the plane z: a tile, a screen, a label. */
export const tile = (P, x0, y0, x1, y1, z) =>
  closed([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)])

/** A rounded flat panel standing on a plane; `pts` are its world corners, each rounded by r. */
export function smooth(pts, r, n = 4) {
  const m = pts.length,
    out = []
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m],
      p = pts[i],
      b = pts[(i + 1) % m]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]),
      lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const t = Math.min(r, la / 2, lb / 2)
    const p1 = [p[0] + ((a[0] - p[0]) / la) * t, p[1] + ((a[1] - p[1]) / la) * t]
    const p2 = [p[0] + ((b[0] - p[0]) / lb) * t, p[1] + ((b[1] - p[1]) / lb) * t]
    for (let k = 0; k <= n; k++) {
      const s = k / n,
        w = 1 - s
      out.push(
        [w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]
      )
    }
  }
  return out
}

/** Maps intensity 0…1 through [at 0, at 0.5, at 1], two straight lines meeting at the middle. */
export function scale(intensity, [lo, mid, hi]) {
  const n = typeof intensity === "string" && intensity.trim() !== "" ? Number(intensity) : intensity
  const i = typeof n === "number" && Number.isFinite(n) ? clamp(n, 0, 1) : 0.5
  const v = i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid)
  return Math.round(v * 1000) / 1000;
}
