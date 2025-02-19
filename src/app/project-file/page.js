"use cache";

import FilesType from "@/components/Files/FilesType";
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
      <FilesType />
    </div>
  );
};

export default page;
