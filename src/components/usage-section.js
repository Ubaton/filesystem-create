import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, CheckCircleOne } from "@mynaui/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function UsageSection() {
  const [copiedCLI, setCopiedCLI] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyCLI = () => {
    navigator.clipboard.writeText("filegen").then(() => {
      setCopiedCLI(true);
      setTimeout(() => setCopiedCLI(false), 2000);
    });
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText("filegen --template e-commerce").then(() => {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    });
  };

  return (
    <div className="space-y-6 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">Usage</h1>
      <p className="text-xl text-muted-foreground">
        Learn how to use FileGen to generate file structures for your projects.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Run the interactive CLI</CardTitle>
            <CardDescription>
              Use the command-line interface to select templates interactively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="flex items-center justify-between bg-muted p-2 px-4 rounded-md overflow-x-auto">
              <code>filegen</code>
              <button onClick={handleCopyCLI} aria-label="Copy command">
                {copiedCLI ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircleOne color="#10b981" />
                  </motion.div>
                ) : (
                  <Copy />
                )}
              </button>
            </pre>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Specify a template directly</CardTitle>
            <CardDescription>
              Generate files for a specific template without interaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="flex items-center justify-between bg-muted p-2 px-4 rounded-md overflow-x-auto">
              <code>filegen --template e-commerce</code>
              <button onClick={handleCopyTemplate} aria-label="Copy command">
                {copiedTemplate ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircleOne color="#10b981" />
                  </motion.div>
                ) : (
                  <Copy />
                )}
              </button>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
