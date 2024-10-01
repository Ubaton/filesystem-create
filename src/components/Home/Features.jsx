"use client";

import React, { useEffect, useRef } from "react";
import { Code, FileCode, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BorderBeam } from "@/components/ui/border-beam";
import { motion, useAnimation, useInView } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-background md:shadow-xl"
    >
      <>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="h-6 w-6 mr-2 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
      </>
      <BorderBeam size={250} duration={12} delay={9} />
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Code,
      title: "Multiple File Types",
      description: "Support for JS, JSX, TS, and TSX file types.",
    },
    {
      icon: FileCode,
      title: "Visual Structure",
      description: "Interactive tree view of your file structure.",
    },
    {
      icon: Download,
      title: "Easy Export",
      description:
        "Download your structure as a ZIP file with boilerplate code.",
    },
  ];

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
    </div>
  );
};

export default Features;
