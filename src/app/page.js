import Image from "next/image";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import GetStarted from "@/components/Home/GetStarted";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Hero />
      <Features />
      <Separator />
      <HowItWorks />
      <GetStarted />
    </div>
  );
}
