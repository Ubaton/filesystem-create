"use cache";

import FileStructureGenerator from "@/components/FileStructureGenerator/FileStructureGenerator";
import React from "react";

const page = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <FileStructureGenerator />
    </div>
  );
};

export default page;
