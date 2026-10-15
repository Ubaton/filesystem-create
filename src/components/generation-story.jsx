"use client";

import { useEffect, useRef } from "react";
import {
  Braces,
  Check,
  FileCode2,
  FolderOpen,
  PackageCheck,
} from "lucide-react";
import "./generation-story.css";

const chapters = [
  {
    label: "an idea",
    detail: "project/",
    Icon: Braces,
    position: "idea",
    at: 0.02,
  },
  {
    label: "a place for everything",
    detail: "src/components/",
    Icon: FolderOpen,
    position: "folders",
    at: 0.25,
  },
  {
    label: "the pieces fall into place",
    detail: "App.tsx",
    Icon: FileCode2,
    position: "files",
    at: 0.6,
  },
  {
    label: "ready for what’s next",
    detail: "my-project.zip",
    Icon: PackageCheck,
    position: "ready",
    at: 0.86,
  },
];

// Decoration only: scroll never changes the editor, focus, or document layout.
export default function GenerationStory() {
  const scene = useRef(null);

  useEffect(() => {
    const element = scene.current;
    const home = element.parentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const drawn = element.querySelector(".story-route-drawn");
    const cursor = element.querySelector(".story-cursor");
    const markers = [...element.querySelectorAll(".story-chapter")];
    const route = element.querySelector(".story-route-base");
    const svg = element.querySelector(".story-routes");
    let length = route.getTotalLength();
    let frame = 0;
    let end = 1;

    const measure = () => {
      const process = home.querySelector(".process-section");
      const terminal = home.querySelector(".terminal-banner");
      const width = home.clientWidth;
      const gutter = Math.max(
        10,
        Math.min(
          80,
          (width - home.querySelector(".fg-container").clientWidth) / 4,
        ),
      );
      end = terminal
        ? terminal.offsetTop + terminal.offsetHeight - 25
        : home.offsetHeight - 25;
      const path = `M ${gutter + 64} 45 V 145 Q ${gutter + 64} 185 ${gutter + 30} 185 H ${gutter + 18} Q ${gutter} 185 ${gutter} 215 V ${end}`;
      svg.setAttribute("viewBox", `0 0 ${width} ${home.offsetHeight}`);
      route.setAttribute("d", path);
      drawn.setAttribute("d", path);
      length = route.getTotalLength();
      // Keep the later chapters in section breathing room, clear of all copy.
      if (process)
        markers[2].style.top = `${process.offsetTop + process.offsetHeight - 65}px`;
      if (terminal)
        markers[3].style.top = `${terminal.offsetTop + terminal.offsetHeight - 45}px`;
    };
    const paint = () => {
      frame = 0;
      // Map document scroll to vertical position, not SVG arc length. Corners
      // must not make the leading point race beyond the viewport.
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const scrollProgress = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll),
      );
      const targetY = 45 + (end - 45) * scrollProgress;
      let low = 0,
        high = length;
      for (let i = 0; i < 18; i++) {
        const middle = (low + high) / 2;
        if (route.getPointAtLength(middle).y < targetY) low = middle;
        else high = middle;
      }
      const progress =
        media.matches || scrollProgress === 1 ? 1 : (low + high) / 2 / length;
      // A normalized dash reveals the route without changing its geometry.
      drawn.style.strokeDashoffset = String(1 - progress);
      const point = route.getPointAtLength(progress * length);
      cursor.setAttribute("transform", `translate(${point.x} ${point.y})`);
      markers.forEach((marker, index) => {
        const amount = media.matches
          ? 1
          : Math.min(1, Math.max(0, (progress - chapters[index].at) / 0.09));
        marker.style.opacity = String(0.24 + amount * 0.76);
        marker.style.transform = media.matches
          ? "none"
          : `translateY(${(1 - amount) * 8}px)`;
        marker.dataset.reached = amount > 0.85 ? "true" : "false";
      });
      element.dataset.reduced = String(media.matches);
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(home);
    measure();
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    const onResize = () => {
      measure();
      schedule();
    };
    window.addEventListener("resize", onResize, { passive: true });
    media.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return (
    <div ref={scene} className="generation-story" aria-hidden="true">
      <div className="story-grid" />
      <svg
        className="story-routes"
        viewBox="0 0 1200 2000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter
            id="story-grain-filter"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.76"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <path
          className="story-route-base"
          d="M 120 50 V 150 Q 120 185 85 185 H 44 Q 24 185 24 220 V 1160 Q 24 1220 84 1220 H 240 Q 280 1220 280 1260 V 1420 Q 280 1460 340 1460 H 1120 Q 1176 1460 1176 1510 V 1680 Q 1176 1730 1120 1730 H 990 Q 950 1730 950 1770 V 1910"
        />
        <path
          className="story-route-drawn"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          d="M 120 50 V 150 Q 120 185 85 185 H 44 Q 24 185 24 220 V 1160 Q 24 1220 84 1220 H 240 Q 280 1220 280 1260 V 1420 Q 280 1460 340 1460 H 1120 Q 1176 1460 1176 1510 V 1680 Q 1176 1730 1120 1730 H 990 Q 950 1730 950 1770 V 1910"
        />
        <g className="story-cursor">
          <circle r="11" className="story-cursor-halo" />
          <circle r="3" />
        </g>
      </svg>
      {chapters.map(({ label, detail, Icon, position, at }, index) => (
        <div
          className={`story-chapter story-chapter-${position}`}
          key={position}
          data-reached="false"
        >
          <div className="story-chapter-symbol">
            <Icon size={16} strokeWidth={1.4} />
            <span className="story-chapter-check">
              <Check size={8} />
            </span>
          </div>
          <div>
            <span className="story-chapter-number">
              0{index + 1} / {label}
            </span>
            <span className="story-chapter-file">{detail}</span>
          </div>
        </div>
      ))}
      <svg className="story-grain-texture" width="100%" height="100%">
        <rect width="100%" height="100%" filter="url(#story-grain-filter)" />
      </svg>
    </div>
  );
}
