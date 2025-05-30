"use client";

import { SidebarNav } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1">
        <ScrollArea className="h-screen">
          <div className="container max-w-full py-6">{children}</div>
        </ScrollArea>
      </main>
    </div>
  );
}
