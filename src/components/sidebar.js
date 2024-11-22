"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { title: "Introduction", href: "/" },
  { title: "Installation", href: "/installation" },
  { title: "Usage", href: "/usage" },
  { title: "Templates", href: "/templates" },
  { title: "Interactive Selection", href: "/interactive-selection" },
  { title: "License", href: "/license" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="h-full py-6 pl-8 pr-6 lg:py-8">
        <nav className="grid items-start gap-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                pathname === item.href ? "bg-accent" : "transparent"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
