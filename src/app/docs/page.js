import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CopyCommand from "@/components/copy-command";
import ChatAssistantLazy from "@/components/chat/chat-assistant-lazy";
export default function DocsPage() {
  return (
    <div className="docs-article">
      <section id="introduction">
        <div className="page-heading">
          <span className="eyebrow">A LITTLE GUIDANCE GOES A LONG WAY</span>
          <h1>From idea to first file.</h1>
          <p>Everything you need to find your way around FileGen.</p>
        </div>
        <p>
          FileGen turns a plain-text outline into folders and files you can
          download. Sketch your own structure, choose a starter, or use the
          command line.
        </p>
        <Link href="/generate-file" className="fg-button primary">
          Open the workspace <ArrowUpRight size={15} />
        </Link>
      </section>
      <section id="installation">
        <span className="eyebrow">01 / COMMAND LINE</span>
        <h2>At home in your terminal.</h2>
        <p>Run the published FileGen package directly with npx:</p>
        <CopyCommand>npx @ubaton/filegen</CopyCommand>
        <p>For the available options, check the package help:</p>
        <CopyCommand>npx @ubaton/filegen --help</CopyCommand>
      </section>
      <section id="usage">
        <span className="eyebrow">02 / THE OUTLINE</span>
        <h2>Simple text. Real structure.</h2>
        <p>
          Write one item per line. End folder names with a slash and indent
          their children with two spaces. Press Tab in the editor to add two
          spaces.
        </p>
        <pre>
          {
            "src/\n  components/\n    Button.tsx\n  App.tsx\n  styles.css\npublic/\n  images/\nREADME.md"
          }
        </pre>
        <div className="docs-callout">
          Give files their own extension, or leave it off to use the default
          file type. Names must be unique within each folder.
        </div>
      </section>
      <section id="interactive">
        <span className="eyebrow">03 / THE WORKSPACE</span>
        <h2>Everything in its place.</h2>
        <p>
          The explorer updates as you type. Click folders to collapse them, or
          select a file to inspect its starter content. Fix any inline
          validation errors before exporting.
        </p>
        <p>
          Your draft saves automatically on this device. Use the import button
          to open a .txt or .md outline, copy your structure to the clipboard,
          or name your project and download the ZIP.
        </p>
        <div className="docs-callout">
          Your download is a scaffold. Supported file types include minimal
          starter content; other files are empty. Install and configure your
          framework separately.
        </div>
      </section>
      <section id="templates">
        <span className="eyebrow">04 / STARTERS</span>
        <h2>Start a few steps ahead.</h2>
        <p>
          Choose React, Next.js, Python, or a static website. Each starter opens
          in the workspace, ready to edit. The library also includes FileGen’s
          original application outlines.
        </p>
        <Link href="/project-file" className="fg-button">
          Explore templates <ArrowUpRight size={15} />
        </Link>
      </section>
      <section id="aichat">
        <span className="eyebrow">05 / A HELPING HAND</span>
        <h2>Think through your structure.</h2>
        <p>
          Open chat in the corner and describe a project using @filegen/blog,
          @filegen/ecommerce, or your own project type. AI generation requires a
          configured provider on the server.
        </p>
        <ChatAssistantLazy />
      </section>
      <section id="license">
        <span className="eyebrow">06 / OPEN SOURCE</span>
        <h2>Build freely.</h2>
        <p>FileGen is available under the MIT license.</p>
        <Link href="/docs/license" className="inline-link">
          Read the license <ArrowUpRight size={14} />
        </Link>
      </section>
    </div>
  );
}
