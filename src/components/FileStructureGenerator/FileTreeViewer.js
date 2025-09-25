"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  ChevronRight,
  Info,
  Search,
  X,
  Copy,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";

const getFileIcon = (fileName, fileType) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const type = fileType?.toLowerCase();

  if (
    type?.includes("image") ||
    ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
  ) {
    return <FileImage className="h-4 w-4 text-green-500" />;
  }
  if (
    type?.includes("video") ||
    ["mp4", "avi", "mov", "wmv", "flv"].includes(extension || "")
  ) {
    return <FileVideo className="h-4 w-4 text-purple-500" />;
  }
  if (
    type?.includes("audio") ||
    ["mp3", "wav", "flac", "aac"].includes(extension || "")
  ) {
    return <FileAudio className="h-4 w-4 text-pink-500" />;
  }
  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "html",
      "css",
      "php",
    ].includes(extension || "")
  ) {
    return <FileCode className="h-4 w-4 text-blue-500" />;
  }
  if (["txt", "md", "doc", "docx", "pdf"].includes(extension || "")) {
    return <FileText className="h-4 w-4 text-gray-500" />;
  }
  return <File className="h-4 w-4 text-gray-400" />;
};

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const FileTreeViewer = ({
  structure,
  onFileSelect,
  onFileAction,
  searchable = true,
  showFileSize = true,
  maxHeight = 400,
}) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const searchInputRef = useRef(null);

  const toggleNode = useCallback((nodePath) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath],
    }));
  }, []);

  const handleFileSelect = useCallback(
    (file, path) => {
      if (file.type === "file") {
        setSelectedFile(path);
        onFileSelect?.(file);
      }
    },
    [onFileSelect]
  );

  const handleFileAction = useCallback(
    (action, file) => {
      onFileAction?.(action, file);
    },
    [onFileAction]
  );

  // Filter nodes based on search term
  const filterNodes = useCallback(
    (node, path) => {
      if (!searchTerm) return node;

      const matchesSearch = node.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (node.type === "file") {
        return matchesSearch ? node : null;
      }

      const filteredChildren = node.children
        ?.map((child) => filterNodes(child, `${path}/${child.name}`))
        .filter(Boolean);

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren || [],
        };
      }

      return null;
    },
    [searchTerm]
  );

  const filteredStructure = useMemo(() => {
    return filterNodes(structure, "root");
  }, [structure, filterNodes]);

  // Auto-expand nodes when searching
  useEffect(() => {
    if (searchTerm && filteredStructure) {
      const expandAll = (node, path) => {
        if (node.type === "folder" && node.children) {
          setExpandedNodes((prev) => ({ ...prev, [path]: true }));
          node.children.forEach((child) =>
            expandAll(child, `${path}/${child.name}`)
          );
        }
      };
      expandAll(filteredStructure, "root");
    }
  }, [searchTerm, filteredStructure]);

  const renderStructure = (node, level = 0, path = "root") => {
    const isExpanded = expandedNodes[path] || false;
    const isSelected = selectedFile === path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <motion.div
        key={`${path}-${node.name}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center py-1.5 px-2 hover:bg-accent rounded-md transition-all duration-200 cursor-pointer group ${
                isSelected ? "bg-accent border-l-2 border-primary" : ""
              }`}
              onClick={() => {
                if (node.type === "folder") {
                  toggleNode(path);
                } else {
                  handleFileSelect(node, path);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (node.type === "folder") {
                    toggleNode(path);
                  } else {
                    handleFileSelect(node, path);
                  }
                }
              }}
              tabIndex={0}
              role={node.type === "folder" ? "button" : "option"}
              aria-expanded={node.type === "folder" ? isExpanded : undefined}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              {node.type === "folder" ? (
                <div className="flex items-center">
                  {hasChildren && (
                    <motion.div
                      initial={false}
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="mr-1"
                    >
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </motion.div>
                  )}
                  {isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-yellow-500 mr-2" />
                  ) : (
                    <Folder className="h-4 w-4 text-yellow-600 mr-2" />
                  )}
                </div>
              ) : (
                <div className="flex items-center mr-2 ml-4">
                  {getFileIcon(node.name, node.fileType)}
                </div>
              )}

              <span
                className={`text-sm flex-1 ${isSelected ? "font-medium" : ""}`}
              >
                {node.name}
              </span>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {node.type === "file" && node.fileType && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {node.fileType}
                  </Badge>
                )}
                {showFileSize && node.size && (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(node.size)}
                  </span>
                )}
              </div>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleFileAction("copy", node)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Path
            </ContextMenuItem>
            {node.type === "file" && (
              <>
                <ContextMenuItem onClick={() => handleFileAction("view", node)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View File
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleFileAction("download", node)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>

        <AnimatePresence>
          {node.type === "folder" && isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {node.children?.map((child) =>
                renderStructure(child, level + 1, `${path}/${child.name}`)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!filteredStructure) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          No files match your search criteria
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Generated Structure
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click folders to expand/collapse</p>
                <p>Right-click for context menu</p>
                <p>Use keyboard navigation</p>
              </TooltipContent>
            </Tooltip>
          </h2>
        </div>

        {searchable && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        <Card>
          <ScrollArea
            className={`w-full rounded-md border p-2`}
            style={{ height: maxHeight }}
          >
            <div role="tree" aria-label="File tree">
              {renderStructure(filteredStructure)}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default FileTreeViewer;
