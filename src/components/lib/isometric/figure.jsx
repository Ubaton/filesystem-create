"use client";
import * as React from "react"

import { scale } from "./iso"
import { inject } from "./styles"

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const report = (err) => {
  if (typeof reportError === "function") reportError(err)
  else
    setTimeout(() => {
      throw err
    })
}

export function createFigure(name, spec) {
  const keys = Object.keys(spec.defaults)

  function Figure({
    ref,
    intensity,
    theme = "auto",
    label,
    onRead,
    onActivate,
    debug = false,
    style,
    ...rest
  }) {
    const own = {}
    const attrs = {}
    for (const [k, v] of Object.entries(rest)) {
      if ((keys).includes(k)) (own)[k] = v
      else attrs[k] = v
    }
    const props = {
      ...spec.defaults,
      ...own
    }
    const named = label ?? (attrs["aria-label"]) ?? spec.label

    const node = React.useRef(null)
    const engine = React.useRef(null)
    const read = React.useRef(onRead)
    const act = React.useRef(onActivate)
    const live = React.useRef(null)

    useIsoLayoutEffect(() => {
      read.current = onRead
      act.current = onActivate
    })

    useIsoLayoutEffect(() => {
      const host = node.current
      const root = host.getRootNode()
      inject(root.nodeType === 9 || "host" in root ? (root) : document)
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 400 320")
      svg.setAttribute("aria-hidden", "true")
      host.prepend(svg)

      let text = null
      const readout = {
        get textContent() {
          return text
        },
        set textContent(value) {
          const next = value ?? ""
          if (next === text) return
          text = next
          if (live.current) live.current.textContent = next
          try {
            read.current?.(next)
          } catch (err) {
            report(err)
          }
        },
      }
      const activated = (part) => {
        try {
          act.current?.(part)
        } catch (err) {
          report(err)
        }
      }
      const e = spec.mount(
        { stage: host, svg, read: readout, activated, debug },
        scale(intensity, spec.range),
        props
      )
      if (text === null) readout.textContent = spec.rest
      engine.current = e
      return () => {
        e.destroy()
        svg.remove()
        engine.current = null
      };
      // mounts once; changes arrive through the effects below
    }, [])

    useIsoLayoutEffect(() => {
      engine.current?.set(scale(intensity, spec.range))
    }, [intensity])
    useIsoLayoutEffect(() => {
      engine.current?.debug?.(debug)
    }, [debug])

    const signature = JSON.stringify(own)
    useIsoLayoutEffect(() => {
      engine.current?.props?.(props)
    }, [signature])

    const setRef = React.useCallback((el) => {
      node.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) (ref).current = el
    }, [ref])

    return (
      <div
        {...(attrs)}
        ref={setRef}
        data-iso={spec.id}
        data-iso-theme={theme === "auto" ? undefined : theme}
        role={spec.focusable ? "group" : "img"}
        tabIndex={spec.focusable ? 0 : undefined}
        aria-label={named}
        style={{ aspectRatio: "5 / 4", ...style }}>
        {spec.focusable ? <span data-iso-live="" aria-live="polite" ref={live} /> : null}
      </div>
    );
  }
  Figure.displayName = name
  return Figure
}
