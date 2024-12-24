import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InteractiveSelectionSection() {
  return (
    <section id="interactive">
      <div className="space-y-6 w-full">
        <h1 className="font-heading text-3xl md:text-4xl">
          🎯 Interactive Selection
        </h1>
        <p className="text-xl text-muted-foreground">
          When you run <code>filegen</code> without any arguments, you'll be
          presented with an interactive CLI interface:
        </p>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>How to use</CardTitle>
            <CardDescription>
              Navigate and select templates using keyboard controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              1. <strong>Template Selection</strong>
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{`
Select a template to generate:
▶ 🛒 E-commerce Store
  ✍️ Blog Platform
  💻 Tech Website
  📁 Portfolio
  🚀 SaaS Platform
  👥 Community Forum
  📚 Learning Management System
  📰 News Portal

[↑↓] Navigate
[Enter] Select template
              `}</code>
            </pre>
            <p className="mb-4">
              2. <strong>Package Manager Selection</strong>
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{`
Choose a package manager to use:
▶ bunx
  npx
  yarn
  pnpm
              `}</code>
            </pre>
            <p className="mb-4">
              3. <strong>Project Setup</strong>
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Creates a new Next.js project with:</li>
              <ul className="list-disc list-inside">
                <li>TypeScript configuration</li>
                <li>Tailwind CSS setup</li>
                <li>ESLint integration</li>
              </ul>
              <li>Installs template-specific dependencies</li>
              <li>
                Generates the file structure based on your selected template
              </li>
            </ul>
            <p className="mb-4">
              4. <strong>Post-Installation</strong>
            </p>
            <p className="mb-4">
              Once completed, you can start your development server:
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{`
# Start the development server
bun dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
              `}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
