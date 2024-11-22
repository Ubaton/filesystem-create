import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InstallationSection() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">Installation</h1>
      <p className="text-xl text-muted-foreground">
        Get started with FileGen by installing it globally on your system.
      </p>
      <div>
        <CardHeader>
          <CardTitle>Install FileGen globally</CardTitle>
          <CardDescription>
            Use npm to install FileGen as a global package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>npm install -g filegen</code>
          </pre>
        </CardContent>
      </div>
    </div>
  );
}
