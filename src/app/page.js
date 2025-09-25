"use client";

import Script from "next/script";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import GetStarted from "@/components/Home/GetStarted";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Hero />
        <Features />
        <Separator />
        <HowItWorks />
        <GetStarted />
      </div>
    </>
  );
}
