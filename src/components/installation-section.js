import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, CheckCircleOne, Package } from "@mynaui/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import NPM from "./ui/npm";
import Link from "next/link";

export function InstallationSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install -g filegen").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 w-full shadow-none">
      <h1 className="font-heading text-3xl md:text-4xl">Installation</h1>
      <p className="text-xl text-muted-foreground">
        Get started with FileGen by installing it globally on your system.
      </p>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Install FileGen globally</CardTitle>
          <CardDescription>
            Use npm to install FileGen as a global package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="flex items-center justify-between bg-muted p-2 px-4 rounded-md overflow-x-auto">
            <code>npm install -g filegen</code>
            <button onClick={handleCopy} aria-label="Copy command">
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircleOne className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </pre>
        </CardContent>
      </Card>

      {/* Improved npm section */}
      <Card className="w-full mx-auto shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 space-y-4 sm:space-y-0">
          <CardHeader className="flex-1 p-0 sm:pr-4">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">npm Package Information</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Details about the FileGen npm package
            </CardDescription>
          </CardHeader>
          <div className="w-full sm:w-auto">
            <div className="flex justify-between items-center px-2 py-1 rounded-md">
              <span className="font-medium text-sm mr-3">Latest Version:</span>
              <Link
                href="https://www.npmjs.com/package/@ubaton/filegen"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline border dark:border-zinc-700 rounded-md px-2"
              >
                <NPM className="w-6 h-6 mt-1" />
                <span>v2.0.5</span>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
