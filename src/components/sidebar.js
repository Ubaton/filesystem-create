"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r dark:border-zinc-900 border-zinc-100">
      <div className="h-full py-6 pl-8 pr-6 lg:py-8">
        <div className="px-4 py-2">
          <Link href="#" className="flex items-center space-x-2">
            <Terminal className="h-6 w-6" />
            <span className="text-lg font-semibold">FileGen</span>
          </Link>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {[
            "Introduction",
            "Installation",
            "Usage",
            "Interactive",
            "Templates",
            { name: "AIChat", isNew: true },
            "License",
          
          ].map((item) => (
            <Link
              key={typeof item === 'string' ? item : item.name}
              href={`#${(typeof item === 'string' ? item : item.name).toLowerCase()}`}
              className="block rounded-lg px-3 py-2 text-sm text-black dark:text-white hover:bg-zinc-900 hover:text-white relative"
            >
              {typeof item === 'string' ? item : (
                <div className="flex items-center">
                  {item.name}
                  {item.isNew && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-bl from-pink-400 to-violet-500 text-transparent px-2 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}