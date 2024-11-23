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
          Interactive Selection
        </h1>
        <p className="text-xl text-muted-foreground">
          Learn how to use the interactive CLI to select templates for your
          projects.
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
              Use arrow keys to navigate through templates and space bar to
              select. Press enter to confirm your selection.
            </p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{`
▶ E-commerce Store
  Blog Platform
  Tech Website
  Portfolio
  SaaS Platform
  Community Forum
  Learning Management
  News Portal

[Space] Toggle selection
[Enter] Confirm
[↑↓] Navigate
            `}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
