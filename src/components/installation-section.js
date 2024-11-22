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

export function InstallationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g filegen").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">Installation</h1>
      <p className="text-xl text-muted-foreground">
        Get started with FileGen by installing it globally on your system.
      </p>
      <div>
        <CardHeader>
          <CardTitle>Install FileGen globally</CardTitle>
          <CardDescription>
            Use npm to install FileGen as a global package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="flex items-center justify-between bg-muted p-4 rounded-md overflow-x-auto">
            <code>npm install -g filegen</code>
            <button onClick={handleCopy} aria-label="Copy command">
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircleOne />
                </motion.div>
              ) : (
                <Copy />
              )}
            </button>
          </pre>
        </CardContent>
      </div>
    </div>
  );
}
