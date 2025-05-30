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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Introduction",
    href: "#introduction",
    icon: BookOpen,
  },
  {
    title: "Installation",
    href: "#installation",
    icon: Download,
  },
  {
    title: "Usage",
    href: "#usage",
    icon: Code2,
  },
  {
    title: "Interactive",
    href: "#interactive",
    icon: Sparkles,
  },
  {
    title: "Templates",
    href: "#templates",
    icon: FileText,
  },
  {
    title: "AIChat",
    href: "#aichat",
    icon: Sparkles,
    badge: "New",
  },
  {
    title: "License",
    href: "#license",
    icon: Shield,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href && "bg-accent text-accent-foreground"
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
          <Button variant="ghost" size="icon" className="md:hidden">
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
      <aside className="hidden md:flex w-72 flex-col border-r">
        <NavContent />
      </aside>
    </>
  );
}
