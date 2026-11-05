import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LocalVault } from "@/components/ui/isometric/local-vault";
import { OutlineForge } from "@/components/ui/isometric/outline-forge";
import { TemplateRack } from "@/components/ui/isometric/template-rack";
import { ZipPress } from "@/components/ui/isometric/zip-press";

const CAPABILITIES = [
  {
    figure: OutlineForge,
    tag: "OUTLINE → TREE",
    title: "Type it. Watch it stand up.",
    text: "Every indented line becomes a real folder or file, previewed as you write and checked before you export.",
    href: "/generate-file",
    cta: "Open the workspace",
    wide: true,
  },
  {
    figure: TemplateRack,
    tag: "STARTERS",
    title: "Pull a head start off the rack.",
    text: "Choose a framework outline, then make it yours.",
    href: "/project-file",
    cta: "Browse templates",
  },
  {
    figure: ZipPress,
    tag: "ONE-CLICK EXPORT",
    title: "Packed, zipped, ready.",
    text: "Download your structure and starter content as one ZIP.",
    href: "/generate-file",
    cta: "Build a ZIP",
  },
  {
    figure: LocalVault,
    tag: "PRIVATE BY DEFAULT",
    title: "Your files stay in your browser.",
    text: "Manual generation and export run on your device, with no account needed.",
    href: "/learn-more",
    cta: "How it works",
    wide: true,
  },
];

export default function CapabilityBento() {
  return (
    <section className="fg-container capability-section" aria-labelledby="capability-heading">
      <div className="capability-head">
        <span className="eyebrow">WHAT FILEGEN DOES</span>
        <h2 id="capability-heading">The boring part, beautifully handled.</h2>
      </div>
      <div className="capability-grid">
        {CAPABILITIES.map(({ figure: Figure, tag, title, text, href, cta, wide }) => (
          <article className={wide ? "capability-card wide" : "capability-card"} key={tag}>
            <div className="capability-stage">
              <Figure aria-hidden="true" />
            </div>
            <div className="capability-copy">
              <span className="capability-tag">{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={href} className="inline-link">
                {cta} <ArrowUpRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
