"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, FileCode2, Github, Laptop, FolderTree } from "lucide-react";
import { BrandX } from "@mynaui/icons-react";
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
import { cn } from "@/lib/utils";

const imageAsset = {
  name: "File Structure Generator",
  image: FileGen,
};

const FloatingNavItem = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("transition-all duration-300", className)}
    >
      {children}
    </motion.div>
  );
};

const EnhancedBadge = ({
  children,
  onClick,
  href,
  delay = 0,
  variant = "ghost",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const badgeContent = (
    <Badge
      onClick={onClick}
      variant={variant}
      className={cn(
        "flex space-x-2 border rounded-full py-1.5 px-3 cursor-pointer transition-colors",
        "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </Badge>
  );

  return (
    <FloatingNavItem delay={delay}>
      {href ? <Link href={href}>{badgeContent}</Link> : badgeContent}
    </FloatingNavItem>
  );
};

const SocialLink = ({ href, icon: Icon, label, delay = 0 }) => {
  return (
    <FloatingNavItem delay={delay}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    </FloatingNavItem>
  );
};

const Navigation = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkToNPM = () => {
    router.push("https://www.npmjs.com/package/@ubaton/filegen");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "border-border/60 shadow" : "border-border/50"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <FloatingNavItem delay={0}>
          <Link href="/" className="group">
            <div className="flex items-center space-x-1">
              <div className="p-1 rounded-xl">
                <Image
                  src={imageAsset.image}
                  alt={imageAsset.name}
                  width={40}
                  height={40}
                  priority={true}
                />
              </div>

              <h1 className="hidden lg:block text-lg font-semibold transition-all duration-300 group-hover:scale-105">
                File
                <span className="bg-gradient-to-bl from-pink-400 via-violet-500 to-primary bg-clip-text text-transparent">
                  Gen
                </span>
              </h1>
            </div>
          </Link>
        </FloatingNavItem>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-3">
          <EnhancedBadge href="/docs" delay={100}>
            <FileText
              size={20}
              className="transition-transform duration-300 hover:rotate-12"
            />
            <span className="text-sm hidden md:block font-medium">Docs</span>
          </EnhancedBadge>

          <EnhancedBadge href="/generate-file" delay={200}>
            <FaWandMagicSparkles
              size={20}
              className="transition-transform duration-300 hover:rotate-12"
            />
            <span className="text-sm hidden md:block font-medium">Gen</span>
          </EnhancedBadge>

          <EnhancedBadge href="/project-file" delay={300}>
            <FolderTree
              size={20}
              className="transition-transform duration-300 hover:rotate-12"
            />
            <span className="text-sm hidden md:block font-medium">
              Project File
            </span>
          </EnhancedBadge>

          <EnhancedBadge
            onClick={handleLinkToNPM}
            variant="outline"
            delay={400}
          >
            <span className="text-sm font-medium hover:underline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              v2.2.0
            </span>
          </EnhancedBadge>

          {/* Social Links */}
          <SocialLink
            href="https://github.com/Ubaton"
            icon={Github}
            label="GitHub repository"
            delay={500}
          />

          <SocialLink
            href="https://x.com/_GoldManRay"
            icon={BrandX}
            label="Twitter profile"
            delay={600}
          />

          {/* Theme Toggle */}
          <FloatingNavItem delay={700}>
            <ThemeToggle />
          </FloatingNavItem>
        </nav>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
};

export default Navigation;
