"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Home, 
  FileText, 
  FolderTree, 
  Search,
  ArrowLeft,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FileGen from "../../public/assets/GrayFIleGen.png";
import { trackEvent } from "@/lib/analytics";

const popularPages = [
  {
    title: "Documentation",
    description: "Learn how to use Filegen",
    href: "/docs",
    icon: FileText,
    badge: "Popular"
  },
  {
    title: "Generate Files",
    description: "Create file structures",
    href: "/generate-file",
    icon: FolderTree,
    badge: "Main Tool"
  },
  {
    title: "Project Templates",
    description: "Browse ready-made templates",
    href: "/project-file",
    icon: Search,
    badge: "Templates"
  }
];

const quickActions = [
  "Create a new React project structure",
  "Generate Next.js file layout",
  "Build Node.js API structure",
  "Set up TypeScript project files"
];

export default function NotFound() {
  const handleLinkClick = (href, type) => {
    try {
      trackEvent('404_navigation', { 
        destination: href,
        type: type 
      });
    } catch (e) {
      // Analytics shouldn't break navigation
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <Image
              src={FileGen}
              alt="Filegen logo"
              width={120}
              height={120}
              className="opacity-50"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-muted-foreground/30">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oops! The page you&apos;re looking for seems to have wandered off into the digital void. 
              But don&apos;t worry, let&apos;s get you back to creating amazing file structures!
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button 
            asChild 
            size="lg"
            onClick={() => handleLinkClick('/', 'home_button')}
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            onClick={() => handleLinkClick('/generate-file', 'generate_button')}
          >
            <Link href="/generate-file">
              <FolderTree className="mr-2 h-4 w-4" />
              Start Generating
            </Link>
          </Button>
        </motion.div>

        {/* Popular Pages Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {popularPages.map((page, index) => (
            <Card 
              key={page.href} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <page.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {page.badge}
                  </Badge>
                </div>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleLinkClick(page.href, 'popular_page')}
                >
                  <Link href={page.href}>
                    Visit Page
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-muted/50 rounded-lg p-6 mt-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Quick Ideas</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            While you&apos;re here, why not try one of these popular file structure templates:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="text-sm p-3 bg-background rounded-md border text-left"
              >
                {action}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => {
              try {
                trackEvent('404_back_navigation');
              } catch (e) {}
              window.history.back();
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-sm text-muted-foreground pt-6 border-t"
        >
          <p>
            Still having trouble? Check out our{" "}
            <Link 
              href="/docs" 
              className="text-primary hover:underline"
              onClick={() => handleLinkClick('/docs', 'help_link')}
            >
              documentation
            </Link>{" "}
            or start fresh with the{" "}
            <Link 
              href="/generate-file" 
              className="text-primary hover:underline"
              onClick={() => handleLinkClick('/generate-file', 'help_link')}
            >
              file generator
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}