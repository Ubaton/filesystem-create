"use client";

import { useEffect, useRef } from "react";
import BlueprintFallback from "./architecture-story/blueprint-fallback";
import StoryChapter from "./architecture-story/story-chapter";
import StoryRail from "./architecture-story/story-rail";
import { chapters, interpolate } from "./architecture-story/chapters";
import "./architecture-story.css";

const MAX_PROGRESS = chapters.length - 1;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** How far a chapter's copy has entered the viewport, 0..1. */
function revealAmount(rect, viewport) {
  return clamp((viewport * 0.9 - rect.top) / (viewport * 0.45), 0, 1);
}

function setText(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

/** Writes all scroll-derived visuals straight to the DOM (no React renders). */
function paint(section, nodes, progress, reduced) {
  const viewport = window.innerHeight;
  const step = Math.round(progress);
  section.style.setProperty("--story-progress", progress.toFixed(4));
  section.style.setProperty("--story-fill", (progress / MAX_PROGRESS).toFixed(4));
  section.dataset.step = String(step);
  if (progress > 0.04) section.dataset.scrolled = "true";

  let activeReveal = 1;
  nodes.chapters.forEach((chapter, i) => {
    const reveal = reduced ? 1 : revealAmount(chapter.getBoundingClientRect(), viewport);
    chapter.style.setProperty("--reveal", reveal.toFixed(3));
    chapter.dataset.active = String(i === step);
    if (i === step) activeReveal = reveal;
  });
  nodes.ticks.forEach((tick, i) => {
    tick.dataset.reached = String(progress >= i - 0.02);
    if (i === step) tick.setAttribute("aria-current", "step");
    else tick.removeAttribute("aria-current");
  });

  const file = chapters[step].file;
  const typed = Math.ceil(file.length * clamp(activeReveal * 1.4, 0, 1));
  setText(nodes.path, file.slice(0, Math.max(1, typed)));
  setText(nodes.files, String(Math.round(interpolate("files", progress))).padStart(2, "0"));
  setText(nodes.folders, String(Math.round(interpolate("folders", progress))).padStart(2, "0"));
}

export default function ArchitectureStory() {
  const root = useRef(null),
    canvas = useRef(null);

  useEffect(() => {
    const section = root.current,
      mount = canvas.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scene,
      cancelled = false,
      loading = false,
      frame = 0,
      visible = false;
    const sections = [...section.querySelectorAll(".architecture-chapter")];
    const nodes = {
      chapters: sections,
      ticks: [...section.querySelectorAll(".story-rail-tick")],
      path: section.querySelector("[data-readout='path']"),
      files: section.querySelector("[data-readout='files']"),
      folders: section.querySelector("[data-readout='folders']"),
    };
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const first = sections[0].getBoundingClientRect();
      const progress = clamp(
        (window.innerHeight * 0.5 - first.top) / first.height - 0.5,
        0,
        MAX_PROGRESS,
      );
      paint(section, nodes, progress, media.matches);
      scene?.update(progress, media.matches);
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(update);
    };
    const initialize = async () => {
      if (loading || scene) return;
      loading = true;
      try {
        const { createBlueprintScene } = await import("@/lib/blueprint-scene");
        if (cancelled) return;
        scene = createBlueprintScene(mount);
        mount.dataset.ready = "true";
        schedule();
      } catch {
        mount.dataset.ready = "false";
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          initialize();
          schedule();
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(section);
    const resize = new ResizeObserver(() => {
      scene?.resize();
      schedule();
    });
    resize.observe(mount);
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      theme.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", schedule);
      scene?.dispose();
    };
  }, []);

  return (
    <div
      ref={root}
      className="architecture-story"
      data-step="0"
      role="region"
      aria-label="From outline to architecture"
    >
      <div className="architecture-stage">
        <div className="architecture-stage-inner fg-container">
          <div className="blueprint-visual">
            <StoryRail />
            <div className="blueprint-topline" aria-hidden="true">
              <span>
                FIG. 0
                <span className="figure-roll">
                  <span className="figure-roll-strip">
                    {chapters.map((c, i) => (
                      <span key={c.id}>{i + 1}</span>
                    ))}
                  </span>
                </span>{" "}
                / PROJECT ANATOMY
              </span>
              <span>ISOMETRIC VIEW</span>
            </div>
            <div ref={canvas} className="blueprint-canvas" aria-hidden="true">
              <BlueprintFallback />
              <span className="blueprint-corner blueprint-corner-tl" />
              <span className="blueprint-corner blueprint-corner-br" />
            </div>
            <div className="blueprint-readout" aria-hidden="true">
              <div className="blueprint-layer-labels">
                {chapters.map((c) => (
                  <span key={c.id}>
                    {c.number} — {c.layer}
                  </span>
                ))}
              </div>
              <dl className="blueprint-counters">
                <div>
                  <dt>FILES</dt>
                  <dd data-readout="files">01</dd>
                </div>
                <div>
                  <dt>FOLDERS</dt>
                  <dd data-readout="folders">00</dd>
                </div>
              </dl>
            </div>
            <div className="blueprint-path" aria-hidden="true">
              <span className="blueprint-path-prompt">$ touch</span>
              <code data-readout="path">{chapters[0].file}</code>
              <span className="blueprint-caret" />
            </div>
            <div className="blueprint-scroll-cue" aria-hidden="true">
              <span />
              SCROLL TO EXPLORE THE LAYERS
            </div>
          </div>
        </div>
      </div>
      <div className="architecture-chapters fg-container">
        {chapters.map((chapter, i) => (
          <StoryChapter key={chapter.id} chapter={chapter} active={i === 0} />
        ))}
      </div>
    </div>
  );
}
