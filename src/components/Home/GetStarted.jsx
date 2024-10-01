import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "../ui/rainbow-button";

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Zap className="h-12 w-12 mb-4" />
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
            Generate your file structure now and streamline your development
            process.
          </p>

          <Link href="/generate-file">
            <RainbowButton>Try File Structure Generator</RainbowButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
