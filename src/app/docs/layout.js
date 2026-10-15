import { metadataFilegen } from "../metadata";
export const metadata = {
  title: "Documentation | FileGen",
  description:
    "Learn the FileGen workspace, outline syntax, templates, and CLI.",
  alternates: { canonical: `${metadataFilegen.metadataBase}/docs` },
};
export default function DocsLayout({ children }) {
  return (
    <div className="fg-container docs-layout">
      <aside className="docs-nav">
        <span className="eyebrow">THE FIELD GUIDE</span>
        {[
          ["introduction", "Getting started"],
          ["installation", "Command line"],
          ["usage", "Structure syntax"],
          ["interactive", "The workspace"],
          ["templates", "Templates"],
          ["aichat", "AI assistant"],
          ["license", "License"],
        ].map(([id, label]) => (
          <a key={id} href={`/docs#${id}`}>
            {label}
          </a>
        ))}
      </aside>
      <div className="docs-content">{children}</div>
    </div>
  );
}
