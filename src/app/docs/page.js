"use client";

import { InstallationSection } from "@/components/installation-section";
import { InteractiveSelectionSection } from "@/components/interactive-selection-section";
import { IntroductionSection } from "@/components/introduction-section";
import { LicenseSection } from "@/components/license-section";
import { TemplatesSection } from "@/components/templates-section";
import { UsageSection } from "@/components/usage-section";
import React from "react";
import { motion } from "framer-motion";
import FilegenAIChat from "@/components/filegen-ai-chat";

const page = () => {
  return (
    <div className="flex justify-center items-start min-h-screen w-full">
      <main className="w-full mx-auto space-y-6 md:space-y-12 p-4 md:p-8">
        <motion.section
          id="introduction"
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IntroductionSection />
        </motion.section>

        <motion.section
          id="installation"
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InstallationSection />
        </motion.section>

        <motion.section
          id="usage"
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <UsageSection />
        </motion.section>

        <motion.section
          id="interactive"
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InteractiveSelectionSection />
        </motion.section>

        <motion.section
          id="templates"
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TemplatesSection />
        </motion.section>

        <motion.section
          id="aichat"
          className="w-full pb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <FilegenAIChat />
        </motion.section>

        <motion.section
          id="license"
          className="w-full pb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <LicenseSection />
        </motion.section>
      </main>
    </div>
  );
};

export default page;
