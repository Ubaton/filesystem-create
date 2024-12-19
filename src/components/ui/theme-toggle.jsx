"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative h-6 w-11 rounded-full p-1
        transition-colors duration-200
        ${resolvedTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}
      `}
      aria-label="Toggle theme"
    >
      <motion.div
        className={`
          absolute top-1 flex h-4 w-4 items-center justify-center
          rounded-full bg-white shadow-sm
        `}
        initial={{ x: 0 }}
        animate={{ x: resolvedTheme === "dark" ? 19 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-3 w-3 text-slate-700" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
