"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import JSLogo from "../../public/assets/js.png";
import TPLogo from "../../public/assets/typescript.png";
import NextJSLogo from "../../public/assets/NEXTjs.png";
import JReactJSLogo from "../../public/assets/React Js.png";
import VueLogo from "../../public/assets/Vue.png";
import ViteJSLogo from "../../public/assets/vite-js.png";

const reviews = [
  {
    id: 1,
    name: "JavaScript",
    img: JSLogo,
  },
  {
    id: 2,
    name: "TypeScript",
    img: TPLogo,
  },
  {
    id: 3,
    name: "Next.js",
    img: NextJSLogo,
  },
  {
    id: 4,
    name: "React",
    img: JReactJSLogo,
  },
  {
    id: 5,
    name: "Vue",
    img: VueLogo,
  },
  {
    id: 6,
    name: "Vite",
    img: ViteJSLogo,
  },
];

const ReviewCard = ({ img, name, isHovered }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="relative mx-2">
      <Badge
        variant="secondary"
        className={cn(
          "flex items-center rounded-full space-x-2 px-3 py-1",
          "bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isHovered
            ? "bg-background/90 border-primary/20"
            : "border border-primary/10"
        )}
      >
        <div>
          <Image
            className={cn(
              "w-6 h-6 object-contain transition-all duration-300 ease-in-out",
              isHovered ? "filter-none" : "filter grayscale"
            )}
            width={24}
            height={24}
            alt={name}
            src={img}
            priority={true}
          />
        </div>
        <span className="text-xs font-medium">{name}</span>
      </Badge>
    </motion.div>
  );
};

export function MarqueeLogo() {
  const [hoveredId, setHoveredId] = React.useState(null);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-8">
      <Marquee pauseOnHover className="[--duration:30s] py-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            onMouseEnter={() => setHoveredId(review.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <ReviewCard {...review} isHovered={hoveredId === review.id} />
          </div>
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
    </div>
  );
}
