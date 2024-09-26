import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Created by Raymond Ngobeni
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">and Code</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            &copy; {currentYear} Raymond Ngobeni. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
