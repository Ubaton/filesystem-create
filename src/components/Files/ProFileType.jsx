"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Copy } from "@mynaui/icons-react";
import { proStructure } from "@/templates/proProjectStuctres";
import StructureTree from "./StructureTree";
import { getDocs, query, collection, limit } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// Cap how many community structures we pull from Firestore on page load
const MAX_FETCHED_STRUCTURES = 24;

const ProFileType = ({ searchTerm }) => {
  const [copiedStructure, setCopiedStructure] = useState(null);
  const [generativeStructure, setGenerativeStructure] = useState([]);
  const [displayedStructures, setDisplayedStructures] = useState([]);
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const copiedTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(copiedTimerRef.current);
  }, []);

  useEffect(() => {
    const fetchAllStructures = async () => {
      try {
        const q = query(
          collection(db, "generatedStructures"),
          limit(MAX_FETCHED_STRUCTURES)
        );
        const querySnapshot = await getDocs(q);
        const structures = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const cleanedStructure = data.structure
            .replace(/Project Type:.*?\n/, "")
            .replace(/Structure:\n/, "")
            .replace(/```/g, "")
            .trim();
          return {
            id: doc.id,
            structure: cleanedStructure,
            projectType: data.projectType,
          };
        });
        setGenerativeStructure(structures);
        // Initialize displayed structures with first page
        setDisplayedStructures(structures.slice(0, itemsPerPage));
      } catch (error) {
        console.error("Error fetching project structures:", error);
      }
    };

    fetchAllStructures();
  }, [itemsPerPage]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * itemsPerPage;
    setDisplayedStructures(generativeStructure.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const hasMoreItems = displayedStructures.length < generativeStructure.length;

  const filteredProStructures = useMemo(() => {
    if (!searchTerm) return Object.entries(proStructure);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Object.entries(proStructure).filter(
      ([key]) => key && key.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  const handleCopy = async (key, structure) => {
    try {
      await navigator.clipboard.writeText(structure);
      setCopiedStructure(key);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedStructure(null), 1500);
      toast.success(`Copied ${key} pro structure!`);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error(`Failed to copy ${key} pro structure`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProStructures.length > 0 ? (
          filteredProStructures.map(([key, structure]) => (
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
                <h2 className="text-xl font-bold capitalize">{key}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(key, structure)}
                  aria-label={`Copy ${key} pro structure`}
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
              <div className="bg-secondary p-4 rounded-lg relative">
                <div className="overflow-auto max-h-80">
                  <StructureTree structure={structure} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No results found for &quot;{searchTerm}&quot;
          </div>
        )}

        {generativeStructure.length > 0 &&
          displayedStructures.map((structure) => (
            <motion.div
              key={structure.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="border rounded-lg p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">
                  {structure.projectType}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(structure.projectType, structure.structure)
                  }
                  aria-label={`Copy ${structure.projectType} pro structure`}
                >
                  {copiedStructure === structure.projectType ? (
                    <Check className="text-green-500" size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                  <span className="sr-only">
                    {copiedStructure === structure.projectType
                      ? "Copied"
                      : "Copy"}
                  </span>
                </Button>
              </div>
              <div className="bg-secondary p-4 rounded-lg relative">
                <div className="overflow-auto max-h-80">
                  <StructureTree structure={structure.structure} />
                </div>
              </div>
            </motion.div>
          ))}

        {hasMoreItems && (
          <motion.div
            className="col-span-full flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="px-6 py-2"
            >
              Load More
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProFileType;
