"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  FileCode,
  ChevronRight,
  Download,
  Copy,
  RefreshCw,
  Info,
} from "lucide-react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const FileTypes = {
  JS: ".js",
  JSX: ".jsx",
  TS: ".ts",
  TSX: ".tsx",
};

export default function FileStructureGenerator() {
  const [input, setInput] = useState("");
  const [defaultFileType, setDefaultFileType] = useState("JS");
  const [structure, setStructure] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const savedStructure = localStorage.getItem("fileStructure");
    if (savedStructure) {
      setInput(savedStructure);
    }
  }, []);

  const toggleNode = (nodePath) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath],
    }));
  };

  const generateBoilerplate = (name, fileType) => {
    const componentName = name.split(".")[0];
    switch (fileType) {
      case "JS":
      case "JSX":
        return `import React from 'react';

const ${componentName} = () => {
  return (
    <div>
      <h1>${componentName} Component</h1>
    </div>
  );
};

export default ${componentName};`;
      case "TS":
      case "TSX":
        return `import React from 'react';

interface ${componentName}Props {}

const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div>
      <h1>${componentName} Component</h1>
    </div>
  );
};

export default ${componentName};`;
      default:
        return "";
    }
  };

  const generateStructure = () => {
    setIsGenerating(true);
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const root = { name: "root", children: [], type: "folder" };
    const stack = [root];

    lines.forEach((line) => {
      const level = line.search(/\S/);
      let name = line.trim();
      let type = "folder";
      let fileType = defaultFileType;

      if (name.endsWith("/")) {
        name = name.slice(0, -1);
      } else if (name.includes(".")) {
        type = "file";
        const extension = name.split(".").pop().toLowerCase();
        switch (extension) {
          case "js":
            fileType = "JS";
            break;
          case "jsx":
            fileType = "JSX";
            break;
          case "ts":
            fileType = "TS";
            break;
          case "tsx":
            fileType = "TSX";
            break;
          default:
            fileType = defaultFileType;
        }
      } else {
        type = "file";
        name = `${name}${FileTypes[defaultFileType]}`;
      }

      const node = { name, children: [], type, fileType };

      while (level < stack.length - 1) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      if (node.type === "folder") {
        stack.push(node);
      }
    });

    setStructure(root);
    // localStorage.setItem("fileStructure", input);
    setIsGenerating(false);
    toast.success("File structure generated successfully!");
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
              {FileTypes[node.fileType]}
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

  const generateZip = async () => {
    const zip = new JSZip();

    const addToZip = (node, currentPath) => {
      if (node.type === "folder") {
        const folderPath = currentPath
          ? `${currentPath}/${node.name}`
          : node.name;
        node.children.forEach((child) => addToZip(child, folderPath));
      } else {
        const filePath = currentPath
          ? `${currentPath}/${node.name}`
          : node.name;
        const fileContent = generateBoilerplate(node.name, node.fileType);
        zip.file(filePath, fileContent);
      }
    };

    addToZip(structure, "");

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, "file-structure.zip");
    toast.success("ZIP file downloaded successfully!");
  };

  const copyToClipboard = async () => {
    const exampleText = `src/
  pages/
    index
    about
  components/
    Header
    Footer
  api/
    users`;

    try {
      await navigator.clipboard.writeText(exampleText);
      toast.success("Example copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy example to clipboard");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl min-h-screen">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            File Structure Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Enter file structure (one item per line, use spaces for
              indentation):
            </label>
            <Textarea
              id="input-area"
              className="min-h-[200px] font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="src/
  pages/
    index
    about
  components/
    Header
    Footer
  api/
    users"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <label className="block mb-2 text-sm font-medium text-foreground">
                Select default file type:
              </label>
              <div className="flex space-x-4">
                <Select
                  id="file-type-select"
                  value={defaultFileType}
                  onValueChange={setDefaultFileType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FileTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setInput("")}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              id="generate-btn"
              onClick={generateStructure}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Structure"
              )}
            </Button>
            {structure && (
              <Button id="download-btn" variant="outline" onClick={generateZip}>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            )}
          </div>
          {structure && (
            <div id="structure-display">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                Generated Structure
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
          )}
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy Example
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Example Structure</DialogTitle>
            <DialogDescription>
              <p className="mb-6">
                Copy the example below to your clipboard and paste it into the
                input field.
              </p>
              <div className="relative">
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono">
                    src/ <br />
                    {"  "}pages/ <br />
                    {"    "}index <br />
                    {"    "}about <br />
                    {"  "}components/ <br />
                    {"    "}Header <br />
                    {"    "}Footer <br />
                    {"  "}api/ <br />
                    {"    "}users
                  </code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
