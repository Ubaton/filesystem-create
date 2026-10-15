import { chapters } from "./chapters";

function scrollToChapter(event, id) {
  const target = document.getElementById(`architecture-${id}`);
  if (!target) return;
  event.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#architecture-${id}`);
}

/** Vertical (desktop) / horizontal (mobile) chapter timeline. Fill is CSS-driven. */
export default function StoryRail() {
  return (
    <nav className="story-rail" aria-label="Project anatomy chapters">
      <span className="story-rail-track" aria-hidden="true">
        <span className="story-rail-fill" />
      </span>
      <ol>
        {chapters.map((chapter, i) => (
          <li key={chapter.id} style={{ "--tick": i }}>
            <a
              href={`#architecture-${chapter.id}`}
              className="story-rail-tick"
              data-index={i}
              onClick={(event) => scrollToChapter(event, chapter.id)}
            >
              <span className="story-rail-dot" aria-hidden="true" />
              <span className="story-rail-label">
                <span aria-hidden="true">{chapter.number}</span>
                <span className="story-rail-name">{chapter.layer}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
