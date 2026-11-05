import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Files } from "@/components/ui/isometric/files";
import { Keys } from "@/components/ui/isometric/keys";
import { Laptop } from "@/components/ui/isometric/laptop";
import { Stack } from "@/components/ui/isometric/stack";

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
            figure: Files,
            title: "An outline is all it takes.",
            text: "Turn indented text into a real project structure. Preview folders as you type and catch mistakes before you export.",
          },
          {
            figure: Stack,
            title: "A thoughtful starting point.",
            text: "Choose a framework starter or begin with a blank canvas. Inspect generated file content, customize your outline, and download a ZIP.",
          },
          {
            figure: Laptop,
            title: "Your workspace stays yours.",
            text: "Manual structure generation and ZIP export run in your browser. Drafts are stored on your device, without creating an account.",
          },
          {
            figure: Keys,
            title: "Built around your workflow.",
            text: "Use the browser for a visual workspace, or run the FileGen CLI from your terminal. Start where you feel at home.",
          },
        ].map(({ figure: Figure, title, text }) => (
          <article className="template-card" key={title}>
            <Figure className="card-figure" aria-hidden="true" />
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
