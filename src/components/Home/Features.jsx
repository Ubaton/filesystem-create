"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Code,
  FileCode,
  Download,
  Zap,
  Layers,
  Settings,
  FolderTree,
  GitBranch,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DotPattern from "../ui/dot-pattern";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  features,
  delay = 0,
  className = "",
  variant = "default",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative h-full transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "h-full relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          "bg-gradient-to-br from-background via-background to-muted/20",
          "hover:border-primary/30 hover:shadow-primary/10",
          variant === "hero" &&
            "bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20",
          variant === "accent" &&
            "bg-gradient-to-br from-secondary/10 via-background to-secondary/5 border-secondary/20"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className={cn("pb-4", variant === "hero" && "pb-6")}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl border transition-all duration-300",
                  variant === "hero"
                    ? "w-16 h-16 bg-primary/15 border-primary/30"
                    : "w-12 h-12 bg-muted border-muted-foreground/20"
                )}
              >
                <Icon
                  className={cn(
                    "text-primary transition-colors",
                    variant === "hero" ? "h-8 w-8" : "h-6 w-6"
                  )}
                />
              </div>
              <div>
                <CardTitle
                  className={cn(
                    "font-bold leading-tight",
                    variant === "hero" ? "text-2xl" : "text-lg"
                  )}
                >
                  {title}
                </CardTitle>
                {variant === "hero" && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p
            className={cn(
              "text-muted-foreground leading-relaxed",
              variant === "hero" ? "text-base" : "text-sm"
            )}
          >
            {description}
          </p>

          {features && (
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {variant === "hero" && (
            <div className="pt-4 border-t border-muted">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">50+</div>
                  <div className="text-xs text-muted-foreground">
                    File Types
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">∞</div>
                  <div className="text-xs text-muted-foreground">
                    Structures
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">1-Click</div>
                  <div className="text-xs text-muted-foreground">Export</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div
          className={cn(
            "absolute inset-0 border-2 border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none",
            "shadow-[0_0_20px_rgba(var(--primary)_/_0.1)]"
          )}
        />
      </Card>
    </div>
  );
};

const StatsCard = ({ number, label, delay = 0, className = "" }) => {
  return (
    <div className={className}>
      <Card className="h-full bg-gradient-to-br from-muted/50 to-background border-muted transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {number}
          </div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const CTACard = ({ className = "" }) => {
  return (
    <div className={className}>
      <Card className="h-full bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <FolderTree className="h-6 w-6" />
            <GitBranch className="h-6 w-6" />
            <Code className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of developers streamlining their workflow
            </p>
          </div>
          <Button className="w-full" size="sm">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Index = () => {
  const features = [
    {
      icon: Code,
      title: "Smart File Generation",
      description:
        "Intelligent support for modern development with multiple programming languages and frameworks.",
      features: [
        "JavaScript, TypeScript, JSX, TSX support",
        "React, Vue, Angular templates",
        "Node.js and Python backends",
        "Custom file type support",
      ],
      variant: "hero",
    },
    {
      icon: FileCode,
      title: "Visual Structure",
      description:
        "Interactive tree visualization of your complete project architecture.",
      features: [
        "Real-time tree preview",
        "Drag & drop editing",
        "Collapsible folders",
      ],
    },
    {
      icon: Download,
      title: "Easy Export",
      description:
        "One-click download with complete boilerplate code and documentation.",
      features: [
        "ZIP file generation",
        "Boilerplate code included",
        "README auto-generation",
      ],
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Tailor every aspect to match your development preferences.",
      features: [
        "Custom naming conventions",
        "Template configurations",
        "Style guide integration",
      ],
    },
    {
      icon: Layers,
      title: "Multi-Framework",
      description: "Pre-built templates for popular frameworks and patterns.",
      features: [
        "MVC, MVP, MVVM patterns",
        "Microservices structure",
        "Component-based layouts",
      ],
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate complex project structures in seconds.",
      features: [
        "Instant generation",
        "Optimized file creation",
        "Batch processing",
      ],
      variant: "accent",
    },
  ];

  return (
    <div className="container min-h-screen">
      {/* Hero Section */}
      <div className="mx-auto py-16">
        <div className="text-center mb-16">
          <span className="inline-block mb-4 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Features
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to create professional project structures with
            intelligent automation and customization
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full mx-auto">
          {/* Hero Feature - Spans 4 columns, 3 rows */}
          <FeatureCard
            {...features[0]}
            className="md:col-span-4 lg:col-span-4 md:row-span-3"
          />

          {/* Stats Cards */}
          <StatsCard
            number="50+"
            label="File Types"
            delay={0.1}
            className="md:col-span-1 lg:col-span-1"
          />
          <StatsCard
            number="∞"
            label="Structures"
            delay={0.2}
            className="md:col-span-1 lg:col-span-1"
          />

          {/* Visual Structure - Spans 2 columns, 2 rows */}
          <FeatureCard
            {...features[1]}
            className="md:col-span-2 lg:col-span-2 md:row-span-2"
          />

          {/* Easy Export */}
          <FeatureCard
            {...features[2]}
            className="md:col-span-2 lg:col-span-2"
          />

          {/* Customizable */}
          <FeatureCard
            {...features[3]}
            className="md:col-span-2 lg:col-span-2"
          />

          {/* CTA Card */}
          <CTACard className="md:col-span-2 lg:col-span-2 md:row-span-2" />

          {/* Multi-Framework */}
          <FeatureCard
            {...features[4]}
            className="md:col-span-2 lg:col-span-2"
          />

          {/* Lightning Fast - Accent variant */}
          <FeatureCard
            {...features[5]}
            className="md:col-span-2 lg:col-span-2"
          />

          {/* Bottom stat */}
          <StatsCard
            number="1-Click"
            label="Export"
            delay={0.3}
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "opacity-30"
        )}
      />
    </div>
  );
};

export default Index;
