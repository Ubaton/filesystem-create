import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="rounded-lg bg-muted dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
          <h3 className="mb-2 font-semibold">Quick Setup</h3>
          <p className="mb-2 text-sm text-zinc-400">
            Get started in minutes with our simple installation process.
          </p>
        </div>
        <div className="rounded-lg bg-muted dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
          <h3 className="mb-2 font-semibold">Customizable Templates</h3>
          <p className="mb-2 text-sm text-zinc-400">
            Create and use your own templates or choose from our pre-defined
            options.
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Link href="https://github.com/Ubaton/filegen-package">
          <Button variant="outline" size="lg">
            View on GitHub
          </Button>
        </Link>
      </div>
    </section>
  );
}
