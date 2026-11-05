import { clamp } from "./iso"
import { reducedMotion, spring, stepAll } from "./motion"
import { bag, loop, pointer } from "./stage"

/** Progress of `t` through the window [a, b], from 0 to 1. */
export const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1)
export const outCubic = (p) => 1 - Math.pow(1 - p, 3)
export const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
/** Eases out past the target, then settles: for parts that land with weight. */
export const outBack = (p) => {
  const c = 1.70158
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
}

/**
 * Runs a repeating timeline for a figure. It stops offscreen through the shared
 * loop, speeds up under the pointer, and shifts `root` slightly for parallax.
 * With reduced motion it draws the single frame at `hold` and stops.
 */
export function cycle({ stage, svg }, speed, { duration, hold, root, render, onPointer }) {
  const b = bag()
  const rate = spring(1, 60, 14, 0.005)
  const px = spring(0, 70, 14, 0.02)
  const py = spring(0, 70, 14, 0.02)
  let base = speed
  let t = 0

  const L = loop(stage, (dt) => {
    if (reducedMotion()) {
      render(hold, dt)
      return false
    }
    stepAll([rate, px, py], dt)
    t = (t + dt * base * rate.x) % duration
    root.setAttribute("transform", `translate(${px.x.toFixed(2)} ${py.x.toFixed(2)})`)
    render(t, dt)
    return true
  })
  b.add(L.stop)

  b.add(pointer(stage, {
    move: (p) => {
      rate.to = 1.5
      px.to = ((p[0] - 200) / 200) * 7
      py.to = ((p[1] - 160) / 160) * 5
      onPointer?.(p)
      L.wake()
    },
    leave: () => {
      rate.to = 1
      px.to = 0
      py.to = 0
      onPointer?.(null)
      L.wake()
    },
  }))
  b.add(() => svg.replaceChildren())

  return {
    set: (v) => {
      base = v
    },
    destroy: b.dispose,
  }
}

/** The first `p` (0 to 1) of a world polyline, as segment pairs for `segments`. */
export function partial(pts, p) {
  const lengths = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1], q[2] - pts[i][2]))
  let left = lengths.reduce((a, l) => a + l, 0) * clamp(p, 0, 1)
  const out = []
  for (let i = 0; i < lengths.length && left > 0; i++) {
    const f = Math.min(1, left / (lengths[i] || 1))
    const a = pts[i],
      z = pts[i + 1]
    out.push([a, [a[0] + (z[0] - a[0]) * f, a[1] + (z[1] - a[1]) * f, a[2] + (z[2] - a[2]) * f]])
    left -= lengths[i]
  }
  return out
}

/** The point `p` (0 to 1) along a world polyline. */
export function along(pts, p) {
  const pairs = partial(pts, p)
  return pairs.length ? pairs[pairs.length - 1][1] : pts[0]
}
