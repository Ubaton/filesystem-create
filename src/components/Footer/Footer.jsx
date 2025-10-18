"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FileGen from "../../public/assets/GrayFIleGen.png";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const imageAsset = {
  name: "File Structure Generator",
  image: FileGen,
};

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Copyright Section */}
          <div className="text-sm text-muted-foreground">
            &copy; 2024 - {currentYear} Raymond Ngobeni. All rights reserved.
          </div>

          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            onClick={() => { try { trackEvent('footer_home_click'); } catch(e){} }}
          >
            <div className="p-1.5 rounded-lg bg-muted/50">
              <Image
                src={imageAsset.image}
                alt={imageAsset.name}
                width={24}
                height={24}
                priority={true}
              />
            </div>
            <span className="text-base font-medium text-foreground">
              FileGen
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
