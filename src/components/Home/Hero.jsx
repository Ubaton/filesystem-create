import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "../ui/rainbow-button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import WordRotate from "@/components/ui/word-rotate";

const Hero = () => {
  return (
    <section className="flex w-full py-4 md:py-6 lg:py-12 xl:py-16 h-[90vh] items-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full p-1 px-4 items-center space-x-1"
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Boiler Plate Code Included</span>
            </AnimatedShinyText>
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none lg:max-w-2xl">
              Generate File Structures with
              <WordRotate
                className="text-black dark:text-white"
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
      </div>
    </section>
  );
};

export default Hero;
