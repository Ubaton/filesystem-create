import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Command,
  FolderTree,
  LockKeyhole,
  Terminal,
} from "lucide-react";
import Workspace from "@/components/workspace";
export default function Home() {
  return (
    <div className="fg-home">
      <section className="home-intro fg-container">
        <div className="eyebrow">
          <span className="status-dot" /> SMALL TOOL. BETTER STARTS.
        </div>
        <h1>
          Great projects start
          <br />
          with a little structure.
        </h1>
        <p>
          Turn a simple outline into a ready-to-build project.
          <br className="desktop-break" /> Less setup. More of the work you
          love.
        </p>
        <div className="hero-actions">
          <a className="fg-button primary" href="#workspace">
            Create your structure <ArrowRight size={16} />
          </a>
          <Link className="fg-button quiet" href="/docs">
            <Terminal size={16} />
            Prefer the terminal? <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="hero-footnote">
          <span>No account needed</span>
          <span>Free & open source</span>
          <span>Yours in seconds</span>
        </div>
      </section>
      <section className="fg-container workspace-section">
        <div className="section-caption">
          <span>
            <span className="caption-index">01 /</span> YOUR NEXT PROJECT STARTS
            HERE
          </span>
          <span>From outline to download. Just like that.</span>
        </div>
        <Workspace compact />
        <div className="workspace-under">
          <span>
            <LockKeyhole size={13} />
            Your files stay in your browser.
          </span>
          <Link href="/generate-file">
            Open full workspace <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <section className="fg-container process-section">
        <div className="process-intro">
          <span className="eyebrow">SKIP THE REPETITIVE PART</span>
          <h2>
            A clear head.
            <br />A clean project.
          </h2>
          <p>
            The folders, the files, the starting point.
            <br />
            All the little things, already in place.
          </p>
          <Link href="/learn-more" className="inline-link">
            A closer look at FileGen <ArrowRight size={15} />
          </Link>
        </div>
        <div className="process-steps">
          {[
            {
              icon: Braces,
              title: "Sketch it out",
              text: "Write your files and folders as a simple outline. Or pick a starter and make it yours.",
            },
            {
              icon: FolderTree,
              title: "See it take shape",
              text: "Preview your structure as you type. Open files, check the details, and get everything in order.",
            },
            {
              icon: Command,
              title: "Make something great",
              text: "Download your project as a ZIP, unzip it, and start building. Your next idea is waiting.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div className="process-step" key={title}>
              <div className="step-icon">
                <Icon size={20} />
              </div>
              <div>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="fg-container terminal-banner">
        <div>
          <span className="eyebrow">SAME TOOL. YOUR WORKFLOW.</span>
          <h2>More of a terminal person?</h2>
          <p>Meet FileGen right where you build.</p>
        </div>
        <div>
          <code>
            <span>$</span> npx @ubaton/filegen
          </code>
          <Link href="/docs">
            Explore the CLI <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
