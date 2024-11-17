"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { Button } from "@/components/ui/button";
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

  return (
    <div className=" mx-auto py-8 w-full min-h-screen bg-card relative overflow-hidden">
      <Card className="container max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div
          className="noise-texture absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
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
              <Button id="download-btn" variant="outline" onClick={generateZip}>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            )}
          </div>

          {structure && <FileTreeViewer structure={structure} />}
        </CardContent>
      </Card>
    </div>
  );
}
