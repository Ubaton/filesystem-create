"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, CheckCircleOne, Package } from "@mynaui/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NPM from "./ui/npm";
import Yarn from "../public/assets/yarn.svg";
import Pnpm from "../public/assets/pnpm.svg";
import Bun from "../public/assets/bun.svg";
import Npm from "../public/assets/npm.svg";

import Image from "next/image";
const packageManagers = [
  {
    icon: Npm,
    name: "npm",
    command: "npm install -g filegen",
  },
  {
    icon: Yarn,
    name: "yarn",
    command: "yarn global add filegen",
  },
  {
    icon: Pnpm,
    name: "pnpm",
    command: "pnpm add -g filegen",
  },
  {
    icon: Bun,
    name: "bun",
    command: "bun add -g filegen",
  },
];

export function InstallationSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("npm");

  const handleCopy = (command) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8 w-full">
      <h1 className="font-heading text-3xl md:text-4xl">Installation</h1>
      <p className="text-xl text-muted-foreground">
        Get started with FileGen by installing it globally on your system.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Install FileGen globally</CardTitle>
          <CardDescription>
            Install FileGen as a global package using your preferred package
            manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              {packageManagers.map((pm) => (
                <TabsTrigger key={pm.name} value={pm.name}>
                  <Image
                    src={pm.icon}
                    alt={`${pm.name} logo`}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  {pm.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {packageManagers.map((pm) => (
              <TabsContent key={pm.name} value={pm.name}>
                <div className="flex items-center justify-between bg-muted p-2 px-4 rounded-md">
                  <code>{pm.command}</code>
                  <button
                    onClick={() => handleCopy(pm.command)}
                    className="flex items-center space-x-2 ml-4"
                    aria-label={`Copy ${pm.name} command`}
                  >
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
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="w-full mx-auto">
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
                <span>v2.0.7</span>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
