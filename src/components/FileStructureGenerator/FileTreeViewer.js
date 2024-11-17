"use cache";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileCode, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FileTreeViewer = ({ structure }) => {
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (nodePath) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath],
    }));
  };

  const renderStructure = (node, level = 0, path = "root") => {
    const isExpanded = expandedNodes[path] || false;

    return (
      <motion.div
        key={node.name}
        className="ml-4"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center py-1 hover:bg-accent rounded transition-colors">
          {node.type === "folder" ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6"
                onClick={() => toggleNode(path)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
              <Folder className="h-4 w-4 text-yellow-500 mr-1" />
            </>
          ) : (
            <FileCode className="h-4 w-4 text-blue-500 mr-1 ml-6" />
          )}
          <span className="text-sm">
            {node.type === "folder" ? `${node.name}/` : node.name}
          </span>
          {node.type === "file" && (
            <span className="ml-2 text-xs text-muted-foreground">
              {node.fileType}
            </span>
          )}
        </div>
        <AnimatePresence>
          {node.type === "folder" && isExpanded && (
            <motion.div
              className="ml-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children.map((child) =>
                renderStructure(child, level + 1, `${path}/${child.name}`)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div id="structure-display">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <span> Generated Structure</span>
        <TooltipProvider className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click on folders to expand/collapse</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      <Card>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {renderStructure(structure)}
        </ScrollArea>
      </Card>
    </div>
  );
};

export default FileTreeViewer;
