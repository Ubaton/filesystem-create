"use client";

import React from "react";
import { Sun, Moon, FileCode2, Github, Twitter } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion } from "framer-motion";

const Navigation = () => {
  const { setTheme, theme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCode2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">File Structure Generator</h1>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            href="https://github.com/Ubaton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub repository</span>
          </Link>

          <Link
            href="https://x.com/_GoldManRay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter profile</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <motion.div
                  initial={false}
                  animate={{
                    rotate: theme === "dark" ? -90 : 0,
                    scale: theme === "dark" ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}>
                  <Sun className="h-5 w-5" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    rotate: theme === "dark" ? 0 : 90,
                    scale: theme === "dark" ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute">
                  <Moon className="h-5 w-5" />
                </motion.div>
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Dropdown Items for Theme Selection */}
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
