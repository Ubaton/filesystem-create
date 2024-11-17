"use cache";

import React from "react";
import { RefreshCw } from "lucide-react";
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

const FileTypes = {
  JS: ".js",
  JSX: ".jsx",
  TS: ".ts",
  TSX: ".tsx",
};

const InputSection = ({
  input,
  setInput,
  defaultFileType,
  setDefaultFileType,
  isGenerating,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-foreground">
          Enter file structure (one item per line, use spaces for indentation):
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
    </div>
  );
};

export default InputSection;
