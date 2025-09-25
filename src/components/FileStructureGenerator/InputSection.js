"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  RefreshCw,
  Upload,
  Download,
  Copy,
  Undo2,
  Redo2,
  FileText,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FILE_TYPES = {
  JS: {
    extension: ".js",
    label: "JavaScript",
    color: "bg-yellow-500",
    description: "JavaScript files",
  },
  JSX: {
    extension: ".jsx",
    label: "React JSX",
    color: "bg-blue-500",
    description: "React JSX components",
  },
  TS: {
    extension: ".ts",
    label: "TypeScript",
    color: "bg-blue-600",
    description: "TypeScript files",
  },
  TSX: {
    extension: ".tsx",
    label: "React TSX",
    color: "bg-blue-700",
    description: "React TypeScript components",
  },
  PY: {
    extension: ".py",
    label: "Python",
    color: "bg-green-500",
    description: "Python files",
  },
  HTML: {
    extension: ".html",
    label: "HTML",
    color: "bg-orange-500",
    description: "HTML files",
  },
  CSS: {
    extension: ".css",
    label: "CSS",
    color: "bg-pink-500",
    description: "CSS stylesheets",
  },
  JSON: {
    extension: ".json",
    label: "JSON",
    color: "bg-gray-500",
    description: "JSON data files",
  },
  MD: {
    extension: ".md",
    label: "Markdown",
    color: "bg-purple-500",
    description: "Markdown files",
  },
  TXT: {
    extension: ".txt",
    label: "Text",
    color: "bg-gray-400",
    description: "Plain text files",
  },
};

const TEMPLATES = {
  "React App": `src/
  components/
    Header
    Footer
    Button
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
package.json
README.md`,

  "Next.js App": `app/
  (dashboard)/
    page
    layout
  api/
    users/
      route
    auth/
      route
  globals.css
  layout
  page
components/
  ui/
    button
    input
    card
  Header
  Footer
lib/
  utils
  db
public/
  images/
next.config.js
package.json`,

  "Node.js API": `src/
  controllers/
    userController
    authController
  middleware/
    auth
    validation
  models/
    User
    Post
  routes/
    users
    auth
  utils/
    database
    helpers
  app
  server
tests/
  unit/
  integration/
package.json
.env.example`,

  "Python Project": `src/
  models/
    __init__.py
    user.py
    database.py
  controllers/
    __init__.py
    user_controller.py
  utils/
    __init__.py
    helpers.py
  main.py
tests/
  test_models.py
  test_controllers.py
requirements.txt
README.md`,
};

const InputSection = ({
  input,
  setInput,
  defaultFileType,
  setDefaultFileType,
  isGenerating,
  onGenerate,
}) => {
  const [history, setHistory] = useState([
    { value: input, timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Statistics
  const stats = useMemo(() => {
    const lines = input.split("\n").filter((line) => line.trim());
    const folders = lines.filter(
      (line) => line.trim().endsWith("/") || line.trim().endsWith("\\")
    );
    const files = lines.filter(
      (line) =>
        !line.trim().endsWith("/") && !line.trim().endsWith("\\") && line.trim()
    );
    const maxDepth = Math.max(
      ...lines.map((line) => {
        const match = line.match(/^(\s*)/);
        return match ? Math.floor(match[1].length / 2) : 0;
      }),
      0
    );

    return {
      totalLines: lines.length,
      folders: folders.length,
      files: files.length,
      maxDepth: maxDepth + 1,
    };
  }, [input]);

  // Handle input change with history
  const handleInputChange = useCallback(
    (value) => {
      setInput(value);

      // Add to history if significant change
      if (
        Math.abs(value.length - input.length) > 5 ||
        Date.now() - history[historyIndex].timestamp > 5000
      ) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ value, timestamp: Date.now() });
        setHistory(newHistory.slice(-50)); // Keep last 50 states
        setHistoryIndex(newHistory.length - 1);
      }
    },
    [input, history, historyIndex, setInput]
  );

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(history[newIndex].value);
    }
  }, [historyIndex, history, setInput]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(history[newIndex].value);
    }
  }, [historyIndex, history, setInput]);

  // Auto-format functionality
  const formatInput = useCallback(() => {
    const lines = input.split("\n");
    const formatted = lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        const depth = line.search(/\S/);
        const normalizedDepth = Math.floor(depth / 2) * 2;
        return " ".repeat(normalizedDepth) + trimmed;
      })
      .join("\n");

    handleInputChange(formatted);
  }, [input, handleInputChange]);

  // Load template
  const loadTemplate = useCallback(
    (templateName) => {
      const template = TEMPLATES[templateName];
      if (template) {
        handleInputChange(template);
      }
    },
    [handleInputChange]
  );

  // File operations
  const exportToFile = useCallback(() => {
    const blob = new Blob([input], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "file-structure.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [input]);

  const importFromFile = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileImport = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          handleInputChange(content);
        };
        reader.readAsText(file);
      }
    },
    [handleInputChange]
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(input);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            } else {
              e.preventDefault();
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "Enter":
            if (e.shiftKey) {
              e.preventDefault();
              onGenerate?.();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, onGenerate]);

  // Auto-format on change if enabled
  useEffect(() => {
    if (autoFormat && input) {
      const timer = setTimeout(() => {
        const lines = input.split("\n");
        const needsFormatting = lines.some((line) => {
          const trimmed = line.trim();
          if (!trimmed) return false;
          const depth = line.search(/\S/);
          return depth > 0 && depth % 2 !== 0;
        });

        if (needsFormatting) {
          formatInput();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [input, autoFormat, formatInput]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">
              File Structure Input
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your file structure using indentation to show hierarchy
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{stats.totalLines} items</Badge>
            <Badge variant="outline">{stats.folders} folders</Badge>
            <Badge variant="outline">{stats.files} files</Badge>
            <Badge variant="outline">depth {stats.maxDepth}</Badge>
          </div>
        </div>

        {/* Main input area */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Templates
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.keys(TEMPLATES).map((template) => (
                      <DropdownMenuItem
                        key={template}
                        onClick={() => loadTemplate(template)}
                      >
                        {template}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={formatInput}>
                      <Zap className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Format structure</TooltipContent>
                </Tooltip>

                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                      >
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-format"
                    checked={autoFormat}
                    onCheckedChange={setAutoFormat}
                  />
                  <Label htmlFor="auto-format" className="text-sm">
                    Auto-format
                  </Label>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle preview</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={importFromFile}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import from file
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToFile}>
                      <Download className="h-4 w-4 mr-2" />
                      Export to file
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to clipboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear input</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Input area */}
            <div
              className={`grid gap-4 ${
                showPreview ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              <div>
                <Textarea
                  ref={textareaRef}
                  className="min-h-[350px] font-mono text-sm resize-none"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={`src/
  components/
    Header
    Footer
    Button
  pages/
    Home
    About
    Contact
  utils/
    helpers
    constants
public/
  images/
  icons/
package.json
README.md`}
                  aria-label="File structure input"
                />
              </div>

              {showPreview && (
                <div className="border rounded-md p-3 bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="text-sm font-mono space-y-1 max-h-[280px] overflow-y-auto">
                    {input.split("\n").map((line, index) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={index} className="h-4" />;

                      const depth = line.search(/\S/);
                      const isFolder =
                        trimmed.endsWith("/") || trimmed.endsWith("\\");

                      return (
                        <div
                          key={index}
                          className="flex items-center"
                          style={{ paddingLeft: `${depth * 8}px` }}
                        >
                          <span
                            className={
                              isFolder
                                ? "text-yellow-600 font-medium"
                                : "text-blue-600"
                            }
                          >
                            {trimmed}
                            {!isFolder && (
                              <span className="text-muted-foreground">
                                {FILE_TYPES[defaultFileType]?.extension ||
                                  ".txt"}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* File type selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Default File Type
            </Label>
            <Select value={defaultFileType} onValueChange={setDefaultFileType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a file type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FILE_TYPES).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`} />
                      <span>{type.label}</span>
                      <span className="text-muted-foreground text-xs">
                        ({type.extension})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {FILE_TYPES[defaultFileType]?.description ||
                "Select a file type for files without extensions"}
            </p>
          </div>

          <div className="flex flex-col justify-end">
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !input.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Structure"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Ctrl+Shift+Enter to generate
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
    </TooltipProvider>
  );
};

export default InputSection;
