"use client";

import React, { useState, useEffect } from "react";
import { Copy, Download } from "lucide-react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import InputSection from "./InputSection";
import FileTreeViewer from "./FileTreeViewer";

const FileTypes = {
  JS: ".js",
  JSX: ".jsx",
  TS: ".ts",
  TSX: ".tsx",
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

export default function FileStructureGenerator() {
  const [input, setInput] = useState("");
  const [defaultFileType, setDefaultFileType] = useState("JS");
  const [structure, setStructure] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const savedStructure = localStorage.getItem("fileStructure");
    if (savedStructure) {
      setInput(savedStructure);
    }
  }, []);

  const generateStructure = () => {
    "use cache";
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
    setIsGenerating(false);
    toast.success("File structure generated successfully!");
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
      setDialogOpen(false);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy example to clipboard");
    }
  };

  return (
    <div className=" mx-auto py-8 w-full min-h-screen">
      <div className="mx-auto max-w-4xl relative overflow-hidden">
        <div class="absolute right-0 top-0 h-16 w-16">
          <div class="absolute transform rotate-45 bg-gradient-to-bl from-pink-400 to-violet-500 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
            New CLI Tool
          </div>
        </div>

        <Card className=" max-w-4xl mx-auto">
          <CardHeader className="relative">
            <CardTitle className="text-3xl font-bold text-center">
              File Structure Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <InputSection
              input={input}
              setInput={setInput}
              defaultFileType={defaultFileType}
              setDefaultFileType={setDefaultFileType}
              onGenerate={generateStructure}
              isGenerating={isGenerating}
            />

            <div className="flex justify-center space-x-4">
              <Button
                id="generate-btn"
                onClick={generateStructure}
                disabled={isGenerating}
              >
                Generate Structure
              </Button>
              {structure && (
                <Button
                  id="download-btn"
                  variant="outline"
                  onClick={generateZip}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download ZIP
                </Button>
              )}
            </div>

            {structure && <FileTreeViewer structure={structure} />}
          </CardContent>
        </Card>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          className="absolute z-50"
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 cursor-pointer">
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
    </div>
  );
}
