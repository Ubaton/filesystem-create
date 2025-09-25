"use client";

import FileStructureGenerator from "@/components/FileStructureGenerator/FileStructureGenerator";
import ChatAssistant from "@/components/chat/chat-assistant";
import React from "react";

const Page = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <FileStructureGenerator />
      <ChatAssistant />
    </div>
  );
};

export default Page;
