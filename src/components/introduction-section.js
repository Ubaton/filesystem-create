import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function IntroductionSection() {
  return (
    <section id="introduction" className="py-12">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to FileGen
      </h1>
      <p className="mb-6 text-xl text-zinc-400">
        FileGen is a powerful and flexible file generation tool designed to
        streamline your development workflow. Create project structures,
        boilerplate code, and custom templates with ease.
      </p>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-zinc-900 p-4">
          <h3 className="mb-2 font-semibold">Quick Setup</h3>
          <p className="mb-2 text-sm text-zinc-400">
            Get started in minutes with our simple installation process.
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-4">
          <h3 className="mb-2 font-semibold">Customizable Templates</h3>
          <p className="mb-2 text-sm text-zinc-400">
            Create and use your own templates or choose from our pre-defined
            options.
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button size="lg">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg">
          View on GitHub
        </Button>
      </div>
    </section>
  );
}
