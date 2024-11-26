import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Callout } from "./ui/callout";

const features = [
  {
    title: "Quick Setup",
    description: "Get started in minutes with our simple installation process.",
  },
  {
    title: "Customizable Templates",
    description:
      "Create and use your own templates or choose from our pre-defined options.",
  },
];

export function IntroductionSection() {
  return (
    <section id="introduction" className="py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to FileGen
        </h1>
        <p className="text-xl text-muted-foreground">
          FileGen is a powerful and flexible file generation tool designed to
          streamline your development workflow. Create project structures,
          boilerplate code, and custom templates with ease.
        </p>
      </div>

      <Tabs defaultValue="installation" className="w-full">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
        </TabsList>
        <TabsContent value="requirements" className="py-3 mt-2">
          <Callout>
            {" "}
            FileGen requires Node.js 18+ and{" "}
            <span className="font-semibold">npm</span> for installation.{" "}
          </Callout>
        </TabsContent>
        <TabsContent
          value="installation"
          className="p-4 border rounded-md mt-2"
        >
          <p>To install FileGen, run the following command:</p>
          <pre className="bg-muted p-2 rounded mt-2">
            <code>npm install -g filegen</code>
          </pre>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div key={index} className="rounded-lg bg-muted p-4 border">
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div>
        <Link href="https://github.com/Ubaton/filegen-package">
          <Button variant="outline" size="lg">
            View on GitHub
          </Button>
        </Link>
      </div>
    </section>
  );
}
