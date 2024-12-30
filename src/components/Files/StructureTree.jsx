import React from "react";
import { Folder, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StructureTree({ structure }) {
  return (
    <div className="font-mono text-sm">
      {structure.split("\n").map((line, index) => {
        const indent = line.search(/\S/);
        const isFolder = line.trim().endsWith("/");
        const Icon = isFolder ? Folder : FileCode;
        return (
          <div
            key={index}
            className={cn(
              "flex items-center",
              indent > 0 && `ml-${indent * 4}`
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 mr-2",
                isFolder ? "text-yellow-500" : "text-blue-500"
              )}
            />
            <span>{line.trim()}</span>
          </div>
        );
      })}
    </div>
  );
}
