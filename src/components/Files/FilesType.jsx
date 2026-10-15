"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { Copy } from "@mynaui/icons-react";
import { structures } from "@/templates/projectStructures";
import StructureTree from "./StructureTree";
import { Separator } from "../ui/separator";
import ProFileType from "./ProFileType";

export default function FileType() {
  const [copiedStructure, setCopiedStructure] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const copiedTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(copiedTimerRef.current);
  }, []);

  const filteredStructures = useMemo(() => {
    return Object.entries(structures).filter(([key]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCopy = async (key, structure) => {
    try {
      await navigator.clipboard.writeText(structure);
      setCopiedStructure(key);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedStructure(null), 1500);
      toast.success(`Copied ${key} structure!`);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error(`Failed to copy ${key} structure`);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background container">
      <div className="text-center mb-8">
        <span className="inline-block mb-4 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Templates
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Project Structures
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Ready-made structures for popular frameworks. Copy one and start
          building.
        </p>
      </div>
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
      <div>
        <AnimatePresence>
          <motion.div
            key="structures-grid"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
          >
            {filteredStructures.map(([key, structure]) => (
              <motion.div
                key={`structure-${key}`}
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
                    aria-label={
                      copiedStructure === key
                        ? `Copied ${key} structure`
                        : `Copy ${key} structure`
                    }
                  >
                    {copiedStructure === key ? (
                      <Check className="text-green-500" size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                    <span className="sr-only">
                      {copiedStructure === key ? "Copied" : "Copy"}
                    </span>
                  </Button>
                </div>
                <div className="bg-secondary p-4 rounded-lg overflow-auto max-h-80">
                  <StructureTree structure={structure} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <Separator key="separator" />
        <div
          key="pro-structures-header"
          className="flex flex-col justify-center items-center my-6"
        >
          <h2 className="text-2xl font-bold mb-4">Pro Structures</h2>
          <p className="text-muted-foreground text-center">
            These structures are meticulously crafted and tailored for optimal
            real-world application.
          </p>
        </div>
        <ProFileType key="pro-file-type" searchTerm={searchTerm} />
      </div>
    </div>
  );
}
