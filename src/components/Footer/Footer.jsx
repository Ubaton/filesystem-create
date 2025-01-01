"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FileGen from "../../public/assets/GrayFIleGen.png";

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
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; 2024 - {currentYear} Raymond Ngobeni. All rights reserved.
          </p>

          <Link href={"/"}>
            <div className="flex items-center space-x-1">
              <Image
                src={imageAsset.image}
                alt={imageAsset.name}
                width={40}
                height={40}
                priority={true}
              />

              <h1 className="text-lg font-semibold">
                File
                <span className="bg-gradient-to-bl from-pink-400 to-violet-500 bg-clip-text text-transparent">
                  Gen
                </span>
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}
