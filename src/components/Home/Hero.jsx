"use cache";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "../ui/rainbow-button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import WordRotate from "@/components/ui/word-rotate";
import { MarqueeLogo } from "../MarqueeLogos/Logo";

const Hero = () => {
  return (
    <section className="flex w-full py-4 md:py-6 lg:py-12 xl:py-16 h-[90vh] items-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex flex-row space-x-4">
            <Badge
              variant="outline"
              className="rounded-full px-4 items-center space-x-1"
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Boiler Plate Code Included</span>
              </AnimatedShinyText>
            </Badge>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Generate File Structures with
              <WordRotate
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
                words={["Ease", "Speed", "Precision", "Flexibility"]}
              />
            </h1>
            <p className="mx-auto max-w-[700px]  md:text-xl bg-gradient-to-bl from-pink-400 to-violet-500 bg-clip-text text-transparent">
              Create, visualize, and download your project&apos;s file structure
              in seconds. Perfect for developers and project managers.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/generate-file">
              <RainbowButton>Get Started</RainbowButton>
            </Link>
            <Button
              className="rounded-xl h-11 px-8 py-2"
              asChild
              size="lg"
              variant="outline"
            >
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
        <MarqueeLogo />
      </div>
    </section>
  );
};

export default Hero;
