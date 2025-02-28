"use client";

import React from "react";
import {
  Sun,
  Moon,
  FileCode2,
  Github,
  // Twitter,
  Laptop,
  FolderTree,
} from "lucide-react";
import { BrandX } from "@mynaui/icons-react";
// import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import FileGen from "../../public/assets/GrayFIleGen.png";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FileText } from "@mynaui/icons-react";
import NPMLogo from "../../public/assets/npm.svg";
import { useRouter } from "next/navigation";
import ThemeToggle from "../ui/theme-toggle";

const imageAsset = {
  name: "File Structure Generator",
  image: FileGen,
};

const Navigation = () => {
  // const { setTheme, theme } = useTheme();
  const router = useRouter();

  const handleLinkToNPM = () => {
    router.push("https://www.npmjs.com/package/@ubaton/filegen");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"/"}>
          <div className="flex items-center space-x-1">
            <Image
              src={imageAsset.image}
              alt={imageAsset.name}
              width={40}
              height={40}
              priority={true}
            />

            <h1 className="hidden lg:block text-lg font-semibold">
              File
              <span className="bg-gradient-to-bl from-pink-400 to-violet-500 bg-clip-text text-transparent">
                Gen
              </span>
            </h1>
          </div>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/docs">
            <Badge
              variant="ghost"
              className="flex space-x-2 rounded-md py-0.5 cursor-pointer"
            >
              <FileText size={20} />
              <span className="text-sm hidden md:block">Docs</span>
            </Badge>
          </Link>
          <Link href="/generate-file">
            <Badge
              variant="ghost"
              className="flex space-x-2 rounded-md py-0.5 cursor-pointer"
            >
              <FaWandMagicSparkles size={20} />
              <span className="text-sm hidden md:block">Gen</span>
            </Badge>
          </Link>
          <Link href="/project-file">
            <Badge
              variant="ghost"
              className="flex space-x-2 rounded-md py-0.5 cursor-pointer"
            >
              <FolderTree size={20} />
              <span className="text-sm hidden md:block">Project File</span>
            </Badge>
          </Link>
          <Badge
            onClick={handleLinkToNPM}
            variant="outline"
            className="flex iteam-center text-sm text-muted-foreground space-x-2 cursor-pointer"
          >
            <span className="hover:underline"> v2.0.9</span>
          </Badge>
          <Link
            href="https://github.com/Ubaton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub repository</span>
          </Link>

          <Link
            href="https://x.com/_GoldManRay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BrandX className="h-5 w-5" />
            <span className="sr-only">Twitter profile</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
