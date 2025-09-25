"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Folder, FileText, Download, Settings } from "lucide-react";
import DotPattern from "../ui/dot-pattern";

const StepCard = ({ number, title, description, icon: Icon, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="group"
    >
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg">
              {number}
            </div>
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold leading-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FileStructureDemo = () => {
  const [highlightedLine, setHighlightedLine] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fileStructure = [
    "├── public/",
    "│   ├── index.html",
    "│   └── favicon.ico",
    "├── src/",
    "│   ├── components/",
    "│   │   ├── Header/",
    "│   │   │   ├── index.tsx",
    "│   │   │   └── Header.module.css",
    "│   │   └── Footer/",
    "│   │       ├── index.tsx",
    "│   │       └── Footer.module.css",
    "│   ├── pages/",
    "│   │   ├── Home/",
    "│   │   │   └── index.tsx",
    "│   │   └── About/",
    "│   │       └── index.tsx",
    "│   ├── hooks/",
    "│   │   └── useApi.ts",
    "│   ├── utils/",
    "│   │   └── helpers.ts",
    "│   ├── App.tsx",
    "│   └── index.tsx",
    "├── package.json",
    "├── tsconfig.json",
    "└── README.md",
  ];

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      // Animate through different lines
      const interval = setInterval(() => {
        setHighlightedLine((prev) => (prev + 1) % fileStructure.length);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [controls, isInView, fileStructure.length]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="relative"
    >
      <Card className="relative overflow-hidden border-2 shadow-2xl bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <CardContent className="relative p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">my-react-app/</h3>
              <p className="text-sm text-muted-foreground">
                Generated file structure
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border">
            <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
              {fileStructure.map((line, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "transition-all duration-300",
                    highlightedLine === index
                      ? "text-primary font-medium bg-primary/10 -mx-2 px-2 rounded"
                      : "text-muted-foreground"
                  )}
                  animate={
                    highlightedLine === index ? { scale: 1.02 } : { scale: 1 }
                  }
                >
                  {line}
                </motion.div>
              ))}
            </pre>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Structure generated successfully</span>
            </div>
            <div className="text-xs text-muted-foreground">
              24 files • 8 folders
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Define Structure",
      description:
        "Enter your desired file and folder structure using our intuitive interface or text input.",
      icon: FileText,
    },
    {
      title: "Configure Settings",
      description:
        "Select default file types, naming conventions, and customize your project template.",
      icon: Settings,
    },
    {
      title: "Preview & Edit",
      description:
        "Visualize your structure in real-time and make adjustments before generation.",
      icon: Folder,
    },
    {
      title: "Download Package",
      description:
        "Generate and download your complete project structure as a ready-to-use ZIP file.",
      icon: Download,
    },
  ];

  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <section className="w-full py-6 lg:py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 w-full mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create professional project structures in minutes with our simple
            4-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={index + 1}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delay={index * 0.1}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-8">
            <FileStructureDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
