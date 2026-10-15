import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

/**
 * One chapter of copy. Each `.reveal` child carries a `--i` stagger index; the
 * parent's `--reveal` (0..1, set from the rAF scroll update) drives the reveal.
 */
export default function StoryChapter({ chapter, active }) {
  let index = 0;
  const next = () => ({ "--i": index++ });
  return (
    <section
      id={`architecture-${chapter.id}`}
      className="architecture-chapter"
      data-active={active ? "true" : "false"}
      aria-labelledby={`architecture-${chapter.id}-title`}
    >
      <div className="architecture-copy">
        <span className="eyebrow reveal" style={next()}>
          <span className="architecture-index">{chapter.number} /</span>
          {chapter.tag}
        </span>
        <h2
          id={`architecture-${chapter.id}-title`}
          className="reveal"
          style={next()}
        >
          {chapter.title}
        </h2>
        <p className="reveal" style={next()}>
          {chapter.text}
        </p>
        <ul>
          {chapter.items.map((item) => (
            <li key={item} className="reveal" style={next()}>
              <Check size={13} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={chapter.link}
          className="inline-link reveal"
          style={next()}
        >
          {chapter.action}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <div className="architecture-file reveal" style={next()}>
          <span className="status-dot" aria-hidden="true" />
          <code>{chapter.file}</code>
          <span>LAYER {chapter.number}</span>
        </div>
      </div>
    </section>
  );
}
