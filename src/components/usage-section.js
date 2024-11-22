import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UsageSection() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">Usage</h1>
      <p className="text-xl text-muted-foreground">
        Learn how to use FileGen to generate file structures for your projects.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Run the interactive CLI</CardTitle>
            <CardDescription>
              Use the command-line interface to select templates interactively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>filegen</code>
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Specify a template directly</CardTitle>
            <CardDescription>
              Generate files for a specific template without interaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>filegen --template e-commerce</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
