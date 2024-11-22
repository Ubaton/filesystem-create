import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LicenseSection() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">License</h1>
      <p className="text-xl text-muted-foreground">
        Information about the license under which FileGen is distributed.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>MIT License</CardTitle>
          <CardDescription>A permissive open-source license</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            FileGen is released under the MIT License. You are free to use,
            modify, and distribute this software, subject to the terms of the
            license.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
