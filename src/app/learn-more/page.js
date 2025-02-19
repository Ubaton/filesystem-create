"use cache";

import LearnMore from "@/components/LearnMore/LearnMore";
import React from "react";
import { metadataFilegen } from "../metadata";

export const metadata = {
  title: metadataFilegen.title,
  description: metadataFilegen.description,
  keywords: metadataFilegen.keywords,
  authors: metadataFilegen.authors,
  creator: metadataFilegen.creator,
  publisher: metadataFilegen.publisher,
  formatDetection: metadataFilegen.formatDetection,
  openGraph: metadataFilegen.openGraph,
  twitter: metadataFilegen.twitter,
};

const page = () => {
  return (
    <div>
      <LearnMore />
    </div>
  );
};

export default page;
