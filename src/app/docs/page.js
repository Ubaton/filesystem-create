"use client";

import { InstallationSection } from "@/components/installation-section";
import { InteractiveSelectionSection } from "@/components/interactive-selection-section";
import { IntroductionSection } from "@/components/introduction-section";
import { LicenseSection } from "@/components/license-section";
import { TemplatesSection } from "@/components/templates-section";
import { UsageSection } from "@/components/usage-section";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      {/* Main content */}
      <main className="w-full mx-auto space-y-12 p-8">
        <section id="introduction">
          <IntroductionSection />
        </section>

        <section id="installation">
          <InstallationSection />
        </section>

        <section id="usage">
          <UsageSection />
        </section>

        <section id="templates">
          <TemplatesSection />
        </section>

        <section id="interactive-selection">
          <InteractiveSelectionSection />
        </section>

        <section id="license" className="pb-12">
          <LicenseSection />
        </section>
      </main>
    </div>
  );
};

export default page;