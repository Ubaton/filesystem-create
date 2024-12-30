"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Copy } from "@mynaui/icons-react";
import { proStructure } from "@/templates/proProjectStuctres";
import StructureTree from "./StructureTree";

const ProFileType = () => {
  const [copyingStructure, setCopyingStructure] = useState(null);

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
                <span>Copied {key} pro structure!</span>
              </motion.div>
            ),
            { duration: 2000, position: "top-center" }
          );
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error(`Failed to copy ${key} pro structure`);
        })
        .finally(() => {
          setCopyingStructure(null);
        });
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {Object.entries(proStructure).map(([key, structure]) => (
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
                {key} Pro Structure
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(key, structure)}
                disabled={copyingStructure !== null}
                aria-label={
                  copyingStructure === key
                    ? `Copying ${key} pro structure`
                    : `Copy ${key} pro structure`
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
            <div className="bg-secondary p-4 rounded-lg overflow-hidden max-h-40 relative">
              <div className="absolute inset-0 bg-black opacity-50" />
              <div className="overflow-hidden max-h-40">
                <StructureTree structure={structure} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProFileType;
