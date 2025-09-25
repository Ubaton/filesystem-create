import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Sparkles,
  FolderTree,
  GitBranch,
  Code,
  Star,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RainbowButton } from "../ui/rainbow-button";
import { cn } from "@/lib/utils";
import DotPattern from "../ui/dot-pattern";

const FeatureHighlight = ({ icon: Icon, text, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
          "bg-primary-foreground/10 border border-primary-foreground/20",
          isHovered &&
            "bg-primary-foreground/20 border-primary-foreground/40 shadow-lg"
        )}
      >
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-primary-foreground/90">{text}</span>
    </div>
  );
};

const StatsHighlight = ({ number, label, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="bg-primary-foreground/10 border-primary-foreground/20 transition-all duration-300 hover:bg-primary-foreground/15 hover:border-primary-foreground/30 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        <Icon
          className={cn(
            "h-6 w-6 text-primary-foreground mb-2 transition-all duration-300",
            isHovered && "scale-110"
          )}
        />
        <div className="text-2xl font-bold text-primary-foreground mb-1">
          {number}
        </div>
        <div className="text-xs text-primary-foreground/80">{label}</div>
      </CardContent>
    </Card>
  );
};

const GetStarted = () => {
  const [mainCardHovered, setMainCardHovered] = useState(false);

  const features = [
    { icon: Code, text: "50+ File Types Supported" },
    { icon: FolderTree, text: "Intelligent Structure Generation" },
    { icon: Download, text: "One-Click Export" },
    { icon: GitBranch, text: "Version Control Ready" },
  ];

  const stats = [
    { number: "10K+", label: "Developers", icon: Star },
    { number: "50+", label: "Templates", icon: FolderTree },
    { number: "<1s", label: "Generation", icon: Zap },
  ];

  return (
    <section
      id="get-started"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden"
    >
      {/* Background Pattern */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "opacity-20"
        )}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-foreground/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Header Section */}
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/15 border border-primary-foreground/30 mb-4 transition-all duration-300 hover:scale-110 hover:bg-primary-foreground/20">
                <Zap className="h-10 w-10" />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground/90">
                Join 10,000+ Developers
              </span>
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>

            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>

            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl leading-relaxed">
              Generate your file structure now and streamline your development
              process with intelligent automation.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="flex item-center justify-between gap-4 w-full mx-auto">
            {features.map((feature, index) => (
              <FeatureHighlight
                key={index}
                icon={feature.icon}
                text={feature.text}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mx-auto w-full">
            {stats.map((stat, index) => (
              <StatsHighlight
                key={index}
                number={stat.number}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div
            className="space-y-4 transition-all duration-300 w-full"
            onMouseEnter={() => setMainCardHovered(true)}
            onMouseLeave={() => setMainCardHovered(false)}
          >
            <Card
              className={cn(
                "w-full bg-primary-foreground/10 border-primary-foreground/20 transition-all duration-500 hover:bg-primary-foreground/15 hover:border-primary-foreground/30 hover:shadow-2xl hover:-translate-y-2",
                "backdrop-blur-sm",
                mainCardHovered && "shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              )}
            >
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-center space-x-2 text-primary-foreground">
                  <FolderTree
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      mainCardHovered && "scale-110 rotate-12"
                    )}
                  />
                  <GitBranch
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      mainCardHovered && "scale-110 -rotate-12"
                    )}
                  />
                  <Code
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      mainCardHovered && "scale-110"
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">
                    Start Building Today
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-6">
                    Join thousands of developers who trust our platform for
                    their project generation needs
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/generate-file" className="block">
                    <RainbowButton className="w-full group">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Try File Structure Generator</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </RainbowButton>
                  </Link>

                  <p className="text-xs text-primary-foreground/60">
                    No credit card required • Free forever • 1-click setup
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
    </section>
  );
};

export default GetStarted;
