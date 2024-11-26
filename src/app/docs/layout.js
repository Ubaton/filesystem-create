"use cache";

import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar />
      <ScrollArea className="w-full h-screen overflow-auto">
        <main className="relative py-6 items-left justify-start w-full h-full overflow-auto">
          <div className="mx-auto w-full min-w-0">{children}</div>
        </main>
      </ScrollArea>
    </div>
  );
}
