"use client";

import Link from "next/link";
import {
  Terminal,
  BookOpen,
  Download,
  Code2,
  Sparkles,
  FileText,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Introduction",
    id: "introduction",
    icon: BookOpen,
  },
  {
    title: "Installation",
    id: "installation",
    icon: Download,
  },
  {
    title: "Usage",
    id: "usage",
    icon: Code2,
  },
  {
    title: "Interactive",
    id: "interactive",
    icon: Sparkles,
  },
  {
    title: "Templates",
    id: "templates",
    icon: FileText,
  },
  {
    title: "AIChat",
    id: "aichat",
    icon: Sparkles,
    badge: "New",
  },
  {
    title: "License",
    id: "license",
    icon: Shield,
  },
];

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    navigationItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Terminal className="h-6 w-6" />
          <span className="text-lg font-semibold">FileGen</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeSection === item.id &&
                  "bg-accent text-accent-foreground font-medium"
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link
            href="https://github.com/Ubaton/filegen-package"
            target="_blank"
          >
            <Terminal className="mr-2 h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed bottom-4 left-4 z-40 rounded-full border bg-background shadow-lg"
            aria-label="Open docs navigation"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 relative">
          {/* Close button at top right */}
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r sticky top-16 h-[calc(100vh-4rem)] shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
