"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      className="icon-button theme-button"
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
