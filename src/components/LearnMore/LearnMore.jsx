import Link from "next/link";
import {
  ArrowRight,
  FolderTree,
  LockKeyhole,
  FileCode2,
  Terminal,
} from "lucide-react";
export default function LearnMore() {
  return (
    <div className="fg-container inner-page">
      <div className="page-heading">
        <span className="eyebrow">MADE FOR THE MOMENT BEFORE YOU BUILD</span>
        <h1>
          Less setup.
          <br />
          More possibility.
        </h1>
        <p>
          FileGen takes care of the repetitive first steps, so you can focus on
          your idea.
        </p>
      </div>
      <div className="template-grid">
        {[
          {
            icon: FolderTree,
            title: "An outline is all it takes.",
            text: "Turn indented text into a real project structure. Preview folders as you type and catch mistakes before you export.",
          },
          {
            icon: FileCode2,
            title: "A thoughtful starting point.",
            text: "Choose a framework starter or begin with a blank canvas. Inspect generated file content, customize your outline, and download a ZIP.",
          },
          {
            icon: LockKeyhole,
            title: "Your workspace stays yours.",
            text: "Manual structure generation and ZIP export run in your browser. Drafts are stored on your device, without creating an account.",
          },
          {
            icon: Terminal,
            title: "Built around your workflow.",
            text: "Use the browser for a visual workspace, or run the FileGen CLI from your terminal. Start where you feel at home.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article className="template-card" key={title}>
            <div className="step-icon">
              <Icon size={21} />
            </div>
            <h2 style={{ marginTop: 24 }}>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="learn-cta">
        <h2>Your next idea deserves a good start.</h2>
        <Link className="fg-button primary" href="/generate-file">
          Let’s build something <ArrowRight size={16} />
        </Link>
        <Link className="inline-link" href="/docs">
          Read the field guide <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
