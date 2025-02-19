"use cache";

import FileStructureGenerator from "@/components/FileStructureGenerator/FileStructureGenerator";
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
    <div className="px-4 sm:px-6 lg:px-8">
      <FileStructureGenerator />
    </div>
  );
};

export default page;
