"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Code,
  Zap,
  FolderTree,
  Star,
  Play,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RainbowButton } from "../ui/rainbow-button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import WordRotate from "@/components/ui/word-rotate";
import { MarqueeLogo } from "../MarqueeLogos/Logo";
import DotPattern from "../ui/dot-pattern";

const FloatingElement = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FloatingElement delay={delay}>
      <Card
        className={cn(
          "group relative overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 w-full",
          "bg-gradient-to-br from-background via-background to-muted/20",
          "hover:border-primary/30 hover:shadow-primary/20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-6 text-center space-y-3 relative z-10">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 mx-auto rounded-xl border transition-all duration-300",
              "bg-primary/10 border-primary/20",
              isHovered && "bg-primary/20 border-primary/40 scale-110"
            )}
          >
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>

        <div
          className={cn(
            "absolute inset-0 border-2 border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none",
            "shadow-[0_0_20px_rgba(var(--primary)_/_0.1)]"
          )}
        />
      </Card>
    </FloatingElement>
  );
};

const StatsCard = ({ icon: Icon, number, label, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <FloatingElement delay={delay}>
      <div
        className={cn(
          "flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:scale-105",
          "bg-muted/30 border border-muted hover:bg-muted/50 hover:border-primary/30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
            "bg-primary/10 border border-primary/20",
            isHovered && "bg-primary/20 border-primary/40 scale-110"
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-lg font-bold text-foreground">{number}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </FloatingElement>
  );
};

const Hero = () => {
  const [mainContentVisible, setMainContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMainContentVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: Star, number: "10K+", label: "Happy Developers" },
    { icon: FolderTree, number: "50+", label: "Templates" },
    { icon: Zap, number: "<1s", label: "Generation Time" },
  ];

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
        <div className="absolute top-24 -left-24 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Badge Section */}
          <FloatingElement delay={0}>
            <div className="flex flex-row space-x-4">
              <Badge
                variant="outline"
                className="rounded-full border-2 px-4 items-center space-x-1 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span>✨ Boiler Plate Code Included</span>
                </AnimatedShinyText>
              </Badge>
            </div>
          </FloatingElement>

          {/* Main Content */}
          <div
            className={cn(
              "space-y-6 transition-all duration-1000 ease-out",
              mainContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Generate File Structures with
                </span>
                <br />
                <WordRotate
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
                  words={["Ease", "Speed", "Precision", "Flexibility"]}
                />
              </h1>

              <p className="mx-auto max-w-[700px] md:text-xl bg-gradient-to-bl from-pink-400 to-violet-500 bg-clip-text text-transparent leading-relaxed">
                Create, visualize, and download your project&apos;s file
                structure in seconds. Perfect for developers and project
                managers.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  icon={stat.icon}
                  number={stat.number}
                  label={stat.label}
                  delay={400 + index * 100}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <FloatingElement delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/generate-file">
                  <Button
                    className={cn(
                      "rounded-xl h-12 px-8 py-3 text-base font-medium",
                      "hover:bg-primary/90"
                    )}
                    size="lg"
                    variant="default"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>

                <Link href="/learn-more">
                  <Button
                    className={cn(
                      "rounded-xl h-12 px-8 py-3 text-base font-medium"
                    )}
                    size="lg"
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Learn more
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                No credit card required • Free forever • 10,000+ developers
                trust us
              </p>
            </FloatingElement>
          </div>
        </div>

        {/* MarqueeLogo */}
        <FloatingElement delay={1200}>
          <MarqueeLogo />
        </FloatingElement>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </section>
  );
};

export default Hero;
