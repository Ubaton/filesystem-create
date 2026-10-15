"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, FolderTree, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import WordRotate from "@/components/ui/word-rotate";
import { MarqueeLogo } from "../MarqueeLogos/Logo";
import DotPattern from "../ui/dot-pattern";

const stats = [
  { icon: Star, number: "10K+", label: "Happy Developers" },
  { icon: FolderTree, number: "50+", label: "Templates" },
  { icon: Zap, number: "<1s", label: "Generation Time" },
];

const StatsCard = ({ icon: Icon, number, label, delayClass }) => (
  <div
    className={cn(
      "group flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105",
      "bg-muted/30 border border-muted hover:bg-muted/50 hover:border-primary/30",
      "animate-fade-up",
      delayClass
    )}
  >
    <div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
        "bg-primary/10 border border-primary/20",
        "group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110"
      )}
    >
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="text-left">
      <div className="text-lg font-bold text-foreground">{number}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="relative flex w-full py-4 md:py-6 lg:py-12 xl:py-12 min-h-[90vh] items-center overflow-hidden">
      {/* Background Elements */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]",
          "opacity-30"
        )}
      />

      {/* Subtle Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 -left-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-24 -right-24 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-56 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Badge Section */}
          <div className="animate-fade-up">
            <Badge
              variant="outline"
              className="rounded-full border-2 px-4 items-center space-x-1 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Boiler Plate Code Included</span>
              </AnimatedShinyText>
            </Badge>
          </div>

          {/* Main Content */}
          <div className="space-y-6 animate-fade-up animation-delay-100">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Generate File Structures with
                </span>
                <br />
                <WordRotate
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-bl from-pink-400 via-violet-500 to-primary bg-clip-text text-transparent"
                  words={["Ease", "Speed", "Precision", "Flexibility"]}
                />
              </h1>

              <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground leading-relaxed">
                Create, visualize, and download your project&apos;s file
                structure in seconds. Perfect for developers and project
                managers.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.label}
                  icon={stat.icon}
                  number={stat.number}
                  label={stat.label}
                  delayClass={
                    ["animation-delay-100", "animation-delay-200", "animation-delay-300"][index]
                  }
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-up animation-delay-300">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  className="rounded-full h-12 px-8 py-3 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-shadow"
                  size="lg"
                  variant="default"
                  asChild
                >
                  <Link href="/generate-file">
                    <span className="flex items-center space-x-2">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>

                <Button
                  className="rounded-full h-12 px-8 py-3 text-base font-medium hover:border-primary/40"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/learn-more">
                    <Play className="h-4 w-4 mr-2" />
                    Learn more
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                No credit card required • Free forever • 10,000+ developers
                trust us
              </p>
            </div>
          </div>
        </div>

        {/* MarqueeLogo */}
        <div className="animate-fade-in animation-delay-500">
          <MarqueeLogo />
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </section>
  );
};

export default Hero;
