"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import ShineBorder from "@/components/ui/shine-border";

export function FlickeringGridDemo() {
  return (
    <div className="relative h-[500px] rounded-lg w-full bg-background overflow-hidden border">
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
}

const StepCard = ({ number, description }) => {
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
    >
      <Card className="transition-all duration-300 ease-in-out hover:scale-105 m-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mr-2">
              {number}
            </span>
            {description}
          </CardTitle>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    "Enter your desired file structure",
    "Select the default file type",
    "Generate and visualize the structure",
    "Download as a ZIP file",
  ];

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
      className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
    >
      <section id="how-it-works" className="w-full py-4 md:py-6 lg:py-8">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            How It Works
          </h2>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {steps.map((step, index) => (
                <StepCard key={index} number={index + 1} description={step} />
              ))}
            </div>
            <ShineBorder
              className="relative flex w-full overflow-hidden rounded-xl border bg-background shadow-xl mt-4"
              color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            >
              <CardContent className="p-6">
                <pre className="text-sm whitespace-pre-wrap">
                  <code>
                    {`src/
  pages/
    index
    about
  components/
    Header
    Footer
  api/
    users`}
                  </code>
                </pre>
              </CardContent>
            </ShineBorder>
          </div>
        </div>
      </section>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        )}
      />
    </motion.div>
  );
};

export default HowItWorks;
