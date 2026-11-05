import { camera, fit, project, unproject } from "./iso";
import { scene } from "./scene";
import { bag, el, loop, pointer } from "./stage";

/** Moves drawables by an offset: how a world places an entity. */
export function offset(items, d) {
  const t = p => [p[0] + d[0], p[1] + d[1], p[2] + d[2]]
  return items.map((it) =>
    "pts" in it ? { ...it, pts: it.pts.map(t) } : "text" in it ? { ...it, at: t(it.at) } : { ...it, mesh: { ...it.mesh, v: it.mesh.v.map(t) } });
}

/** A camera that fits `pts` inside the 400 × 320 box with a margin. */
export function frame(view) {
  const c = camera(view.az ?? 45, view.k ?? 0.5, 1)
  const P = project(c)
  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity
  for (const p of view.fit) {
    const [x, y] = P(p[0], p[1], p[2])
    x0 = Math.min(x0, x)
    x1 = Math.max(x1, x)
    y0 = Math.min(y0, y)
    y1 = Math.max(y1, y)
  }
  c.s = Math.min(340 / (x1 - x0 || 1), 264 / (y1 - y0 || 1)) * (view.zoom ?? 1)
  fit(c, view.fit, view.at?.[0] ?? 200, view.at?.[1] ?? 162)
  return c
}

/** Hosts one entity as a figure: the mount `createFigure` takes. */
export function entityMount(entity) {
  return ({ stage, svg, read, activated, debug }, value, props) => {
    const b = bag()
    const s = entity.init(props)
    const cam = frame(entity.view)
    const order = Object.keys(entity.parts)
    const sc = scene(el("g", null, svg), { debug })
    let hover = null
    let focus = -1
    const ctx = {
      value,
      hover: null,
      camera: cam,
      read: (t) => {
        read.textContent = t
      },
    }

    function render() {
      const out = []
      ctx.hover = hover
      entity.draw(s, out, ctx)
      if (hover) for (const it of out) if (it.part === hover) it.cls = `${it.cls ?? ""} accent`
      sc.render(cam, out)
    }

    const L = loop(stage, (dt, now) => {
      const moving = entity.step?.(s, dt, ctx, now) ?? false
      render()
      return moving
    })
    b.add(L.stop)
    read.textContent = entity.rest(s)

    function point(part) {
      if (part === hover) return
      hover = part
      read.textContent = part ? (entity.parts[part] ?? part) : entity.rest(s)
      stage.style.cursor = part && entity.activate ? "pointer" : ""
      L.wake()
    }
    function activate(part) {
      const caption = entity.activate?.(s, part, ctx)
      read.textContent = caption ?? entity.parts[part] ?? part
      activated?.(part)
      L.wake()
    }

    let from = null,
      dragged = false
    const info = (p, down) => ({
      p,
      ground: unproject(cam, p[0], p[1], 0),
      part: sc.pick(p),
      down,
      from
    })
    b.add(pointer(stage, {
      move: (p) => {
        const e = info(p, from !== null)
        if (from && Math.hypot(p[0] - from[0], p[1] - from[1]) > 6) dragged = true
        if (entity.pointer?.(s, e, ctx)) dragged = true
        point(e.part)
        L.wake()
      },
      down: (p) => {
        from = p
        dragged = false
        const e = info(p, true)
        if (entity.pointer?.(s, e, ctx)) dragged = true
        point(e.part)
        L.wake()
      },
      up: (p) => {
        const e = info(p, false)
        const wasDrag = dragged
        from = null
        dragged = false
        entity.pointer?.(s, e, ctx)
        if (!wasDrag && e.part) activate(e.part)
        L.wake()
      },
      leave: () => {
        from = null
        dragged = false
        entity.pointer?.(s, null, ctx)
        point(null)
      },
    }))

    // the keyboard walks the parts: arrows move, Enter or Space activates, Escape lets go
    const onKey = (e) => {
      if (!order.length) return
      if (e.key === "ArrowRight" || e.key === "ArrowDown") focus = (focus + 1) % order.length
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") focus = (focus - 1 + order.length) % order.length
      else if ((e.key === "Enter" || e.key === " ") && focus >= 0) {
        e.preventDefault()
        activate(order[focus])
        return
      } else if (e.key === "Escape") {
        focus = -1
        point(null)
        return
      } else return
      e.preventDefault()
      point(order[focus])
    }
    const onBlur = () => {
      focus = -1
      point(null)
    }
    stage.addEventListener("keydown", onKey)
    stage.addEventListener("blur", onBlur)
    b.add(() => {
      stage.removeEventListener("keydown", onKey)
      stage.removeEventListener("blur", onBlur)
    })
    b.add(() => svg.replaceChildren())

    return {
      set: (v) => {
        ctx.value = v
        L.wake()
      },
      props: (next) => {
        entity.update?.(s, next)
        L.wake()
      },
      debug: (on) => {
        sc.options.debug = on
        L.wake()
      },
      destroy: b.dispose,
    };
  };
}
