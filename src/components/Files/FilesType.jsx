"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Folder, FileCode, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Copy } from "@mynaui/icons-react";
import { structures } from "@/templates/projectStructures";
import StructureTree from "./StructureTree";
// import { Separator } from "../ui/separator";
// import ProFileType from "./ProFileType";

export default function FileType() {
  const [copyingStructure, setCopyingStructure] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStructures = useMemo(() => {
    return Object.entries(structures).filter(([key]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCopy = (key, structure) => {
    setCopyingStructure(key);

    setTimeout(() => {
      navigator.clipboard
        .writeText(structure)
        .then(() => {
          toast.custom(
            (t) => (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-zinc-100 border px-4 text-black py-2 rounded-md shadow-sm flex items-center space-x-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
                <span>Copied {key} structure!</span>
              </motion.div>
            ),
            { duration: 2000, position: "top-center" }
          );
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error(`Failed to copy ${key} structure`);
        })
        .finally(() => {
          setCopyingStructure(null);
        });
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Project Structures
      </h1>
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search structures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
        >
          {filteredStructures.map(([key, structure]) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="border rounded-lg p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {key} Structure
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(key, structure)}
                  disabled={copyingStructure !== null}
                  aria-label={
                    copyingStructure === key
                      ? `Copying ${key} structure`
                      : `Copy ${key} structure`
                  }
                >
                  {copyingStructure === key ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                  <span className="sr-only">
                    {copyingStructure === key ? "Copying" : "Copy"}
                  </span>
                </Button>
              </div>
              <div className="bg-secondary p-4 rounded-lg overflow-auto max-h-80">
                <StructureTree structure={structure} />
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* <Separator /> */}
        {/* <div className="flex flex-col justify-center items-center my-6">
          <h2 className="text-2xl font-bold mb-4">Pro Structures</h2>
          <p className="text-muted-foreground">
            These structures are only available for paid plans.
          </p>
        </div> */}
        {/* <ProFileType /> */}
      </AnimatePresence>
    </div>
  );
}
