"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Copy,
  Download,
  Upload,
  Save,
  Trash2,
  Settings,
  FileText,
  Folder,
  AlertCircle,
} from "lucide-react";
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
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Noise from "../ui/noise";
import InputSection from "./InputSection";
import FileTreeViewer from "./FileTreeViewer";

const FILE_TYPES = {
  JS: {
    extension: ".js",
    label: "JavaScript",
    template: "javascript",
  },
  JSX: {
    extension: ".jsx",
    label: "React JSX",
    template: "react-js",
  },
  TS: {
    extension: ".ts",
    label: "TypeScript",
    template: "typescript",
  },
  TSX: {
    extension: ".tsx",
    label: "React TSX",
    template: "react-ts",
  },
  PY: {
    extension: ".py",
    label: "Python",
    template: "python",
  },
  HTML: {
    extension: ".html",
    label: "HTML",
    template: "html",
  },
  CSS: {
    extension: ".css",
    label: "CSS",
    template: "css",
  },
  JSON: {
    extension: ".json",
    label: "JSON",
    template: "json",
  },
  MD: {
    extension: ".md",
    label: "Markdown",
    template: "markdown",
  },
};

const BOILERPLATE_TEMPLATES = {
  javascript: (name) => `// ${name}
export default function ${toPascalCase(name)}() {
  // Implementation here
  return null;
}`,

  "react-js": (name) => `import React from 'react';

const ${toPascalCase(name)} = () => {
  return (
    <div className="${toKebabCase(name)}">
      <h1>${toPascalCase(name)} Component</h1>
      {/* Component content */}
    </div>
  );
};

export default ${toPascalCase(name)};`,

  typescript: (name) => `// ${name}
export default function ${toPascalCase(name)}(): void {
  // Implementation here
}`,

  "react-ts": (name) => `import React from 'react';

interface ${toPascalCase(name)}Props {
  // Define props here
}

const ${toPascalCase(name)}: React.FC<${toPascalCase(name)}Props> = () => {
  return (
    <div className="${toKebabCase(name)}">
      <h1>${toPascalCase(name)} Component</h1>
      {/* Component content */}
    </div>
  );
};

export default ${toPascalCase(name)};`,

  python: (name) => `"""${name} module"""

def main():
    """Main function"""
    pass

if __name__ == "__main__":
    main()`,

  html: (name) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${toPascalCase(name)}</title>
</head>
<body>
    <h1>${toPascalCase(name)}</h1>
</body>
</html>`,

  css: (name) => `/* ${name} styles */
.${toKebabCase(name)} {
  /* Add your styles here */
}`,

  json: () => `{
  "name": "example",
  "version": "1.0.0"
}`,

  markdown: (name) => `# ${toPascalCase(name)}

Description of ${name}.

## Usage

\`\`\`
// Example usage
\`\`\``,
};

// Utility functions
const toPascalCase = (str) => {
  return str
    .split(/[-_.]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
};

const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const generateBoilerplate = (name, fileType) => {
  const baseName = name.split(".")[0];
  const template = FILE_TYPES[fileType]?.template || "javascript";
  const generator = BOILERPLATE_TEMPLATES[template];

  return generator
    ? generator(baseName)
    : `// ${name}\n// TODO: Add implementation`;
};

const STORAGE_KEY = "fileStructureGenerator";
const INDENT_SIZE = 2;

const getIndentLevel = (line) => {
  const leadingWhitespace = line.match(/^\s*/)?.[0] || "";
  const normalizedWhitespace = leadingWhitespace.replace(/\t/g, " ".repeat(INDENT_SIZE));
  return normalizedWhitespace.length;
};

export default function FileStructureGenerator() {
  const [input, setInput] = useState("");
  const [defaultFileType, setDefaultFileType] = useState("TSX");
  const [structure, setStructure] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState("input");

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setInput(data.input || "");
        setDefaultFileType(data.defaultFileType || "TSX");
        setSavedProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
      toast.error("Failed to load saved data");
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      input,
      defaultFileType,
      projects: savedProjects,
      lastModified: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }, [input, defaultFileType, savedProjects]);

  // Validate input
  const validateInput = useCallback((inputText) => {
    const errors = [];
    const lines = inputText.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      errors.push("Input cannot be empty");
      return errors;
    }

    let previousLevel = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const level = getIndentLevel(line);
      const trimmed = line.trim();

      if (level % INDENT_SIZE !== 0) {
        errors.push(
          `Line ${i + 1}: Indentation must use multiples of ${INDENT_SIZE} spaces`
        );
      }

      if (level > previousLevel + INDENT_SIZE) {
        errors.push(`Line ${i + 1}: Indentation too deep (${level} spaces)`);
      }

      if (trimmed.includes("..")) {
        errors.push(`Line ${i + 1}: Invalid characters in name`);
      }
      previousLevel = level;
    }

    return errors;
  }, []);

  // Generate structure
  const generateStructure = useCallback(() => {
    setIsGenerating(true);
    setErrors([]);

    try {
      // Validate input
      const validationErrors = validateInput(input);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsGenerating(false);
        return;
      }

      const lines = input.split("\n").filter((line) => line.trim() !== "");
      const root = { name: "root", children: [], type: "folder" };
      const stack = [root];

      lines.forEach((line, index) => {
        const level = getIndentLevel(line) / INDENT_SIZE;
        let name = line.trim();
        let type = "folder";
        let fileType = defaultFileType;

        if (name.endsWith("/")) {
          name = name.slice(0, -1);
          type = "folder";
        } else if (name.includes(".")) {
          type = "file";
          const extension = name.split(".").pop()?.toLowerCase();

          // Auto-detect file type from extension
          const detectedType = Object.entries(FILE_TYPES).find(
            ([, config]) => config.extension === `.${extension}`
          );

          if (detectedType) {
            fileType = detectedType[0];
          }
        } else {
          type = "file";
          name = `${name}${FILE_TYPES[defaultFileType]?.extension || ".txt"}`;
        }

        const content =
          type === "file" ? generateBoilerplate(name, fileType) : undefined;
        const size = content ? new Blob([content]).size : undefined;

        const node = {
          name,
          children: type === "folder" ? [] : undefined,
          type,
          fileType,
          content,
          size,
        };

        // Adjust stack based on indentation level
        while (level < stack.length - 1) {
          stack.pop();
        }

        stack[stack.length - 1].children?.push(node);

        if (node.type === "folder") {
          stack.push(node);
        }
      });

      setStructure(root);
      setActiveTab("preview");
  toast.success("File structure generated successfully!");
  try { trackEvent('generate_structure', { project: input?.slice(0,50) }); } catch(e){}
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate structure");
      setErrors(["An unexpected error occurred during generation"]);
    } finally {
      setIsGenerating(false);
    }
  }, [input, defaultFileType, validateInput, setStructure]);

  // Generate and download ZIP (JSZip/file-saver load on demand, not on page load)
  const generateZip = useCallback(async () => {
    if (!structure) return;

    try {
      const [{ default: JSZip }, { default: FileSaver }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();
      let fileCount = 0;

      const addToZip = (node, currentPath = "") => {
        if (node.type === "folder" && node.children) {
          const folderPath = currentPath
            ? `${currentPath}/${node.name}`
            : node.name;

          // Create empty folder if it has no children
          if (node.children.length === 0) {
            zip.folder(folderPath);
          }

          node.children.forEach((child) => addToZip(child, folderPath));
        } else if (node.type === "file") {
          const filePath = currentPath
            ? `${currentPath}/${node.name}`
            : node.name;
          const content =
            node.content ||
            generateBoilerplate(node.name, node.fileType || defaultFileType);
          zip.file(filePath, content);
          fileCount++;
        }
      };

      addToZip(structure);

      toast.promise(
        zip.generateAsync({ type: "blob" }).then((content) => {
          FileSaver.saveAs(content, "file-structure.zip");
          return fileCount;
        }),
        {
          loading: "Generating ZIP file...",
          success: (count) => { trackEvent('download_zip', { files: count }); return `ZIP file downloaded with ${count} files!` },
          error: "Failed to generate ZIP file",
        }
      );
    } catch (error) {
      console.error("ZIP generation failed:", error);
      toast.error("Failed to generate ZIP file");
    }
  }, [structure, defaultFileType]);

  // Save current project
  const saveProject = useCallback(() => {
    const project = {
      id: Date.now().toString(),
      name: `Project ${savedProjects.length + 1}`,
      input,
      defaultFileType,
      timestamp: Date.now(),
    };

    setSavedProjects((prev) => [project, ...prev.slice(0, 9)]); // Keep last 10 projects
    toast.success("Project saved!");
    try { trackEvent('save_project', { name: project.name }); } catch(e){}
  }, [input, defaultFileType, savedProjects.length]);

  // Load saved project
  const loadProject = useCallback(
    (project) => {
      setInput(project.input);
      setDefaultFileType(project.defaultFileType);
      setStructure(null);
      toast.success(`Loaded ${project.name}`);
    },
    [setStructure]
  );

  // Delete saved project
  const deleteProject = useCallback((projectId) => {
    setSavedProjects((prev) => prev.filter((p) => p.id !== projectId));
    toast.success("Project deleted");
  }, []);

  // Copy example to clipboard
  const copyExample = useCallback(async () => {
    const example = `src/
  components/
    ui/
      Button
      Input
      Card
    layout/
      Header
      Footer
      Sidebar
  pages/
    Home
    About
    Contact
  hooks/
    useAuth
    useApi
  utils/
    helpers
    constants
  styles/
    globals.css
    components.css
public/
  images/
  icons/
  favicon.ico
package.json
README.md
tsconfig.json`;

    try {
      await navigator.clipboard.writeText(example);
      toast.success("Example copied to clipboard!");
  try { trackEvent('copy_example'); } catch(e){}
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy example");
    }
  }, []);

  // Statistics
  const stats = useMemo(() => {
    if (!structure) return null;

    let fileCount = 0;
    let folderCount = 0;
    let totalSize = 0;

    const traverse = (node) => {
      if (node.type === "file") {
        fileCount++;
        totalSize += node.size || 0;
      } else if (node.type === "folder") {
        folderCount++;
        node.children?.forEach(traverse);
      }
    };

    structure.children?.forEach(traverse);

    return { fileCount, folderCount, totalSize };
  }, [structure]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-0 h-full min-h-screen">
        <Noise
          patternSize={300}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={2}
          patternAlpha={20}
        />
      </div>

      <div className="mx-auto py-8 w-full min-h-screen relative z-10">
        <div className="mx-auto max-w-6xl px-4">
          <Card className="max-w-6xl mx-auto">
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    File Structure Generator
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Create, preview, and download your project structure
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {stats && (
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        <Folder className="h-3 w-3 mr-1" />
                        {stats.folderCount}
                      </Badge>
                      <Badge variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {stats.fileCount}
                      </Badge>
                      <Badge variant="outline">
                        {(stats.totalSize / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={saveProject}
                        disabled={!input.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {savedProjects.length > 0 && (
                        <>
                          {savedProjects.slice(0, 5).map((project) => (
                            <DropdownMenuItem
                              key={project.id}
                              className="flex items-center justify-between"
                            >
                              <span
                                onClick={() => loadProject(project)}
                                className="flex-1 cursor-pointer"
                              >
                                {project.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProject(project.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">Input & Settings</TabsTrigger>
                  <TabsTrigger value="preview" disabled={!structure}>
                    Preview & Export
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="space-y-6">
                  <InputSection
                    input={input}
                    setInput={setInput}
                    defaultFileType={defaultFileType}
                    setDefaultFileType={setDefaultFileType}
                    onGenerate={generateStructure}
                    isGenerating={isGenerating}
                  />

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={generateStructure}
                      disabled={isGenerating || !input.trim()}
                      size="lg"
                    >
                      Generate Structure
                    </Button>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg">
                          <Copy className="mr-2 h-4 w-4" />
                          View Example
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Example Structure</DialogTitle>
                          <DialogDescription>
                            Here&apos;s an example of a typical React project
                            structure
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                            <code>{`src/
  components/
    ui/
      Button
      Input
      Card
    layout/
      Header
      Footer
      Sidebar
  pages/
    Home
    About
    Contact
  hooks/
    useAuth
    useApi
  utils/
    helpers
    constants
  styles/
    globals.css
    components.css
public/
  images/
  icons/
  favicon.ico
package.json
README.md
tsconfig.json`}</code>
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={copyExample}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  {structure && (
                    <>
                      <div className="flex justify-center gap-4">
                        <Button onClick={generateZip} variant="default">
                          <Download className="mr-2 h-4 w-4" />
                          Download ZIP
                        </Button>
                        <Button
                          onClick={() => setActiveTab("input")}
                          variant="outline"
                        >
                          Edit Structure
                        </Button>
                      </div>

                      <FileTreeViewer
                        structure={structure}
                        searchable={true}
                        showFileSize={true}
                        maxHeight={600}
                      />
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
