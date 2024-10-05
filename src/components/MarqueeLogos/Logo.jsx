import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import Image from "next/image";
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
    name: "React.js",
    img: JReactJSLogo,
  },
  {
    id: 5,
    name: "React.js",
    img: VueLogo,
  },
  {
    id: 6,
    name: "React.js",
    img: ViteJSLogo,
  },
];

const ReviewCard = ({ img, name }) => {
  return (
    <figure
      className={cn(
        "relative w-20 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        <Image
          className="transition-colors duration-300 grayscale hover:grayscale-0"
          width="50"
          height="50"
          alt={name}
          src={img}
          priority={true}
        />
      </div>
    </figure>
  );
};

export function MarqueeLogo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-4">
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
