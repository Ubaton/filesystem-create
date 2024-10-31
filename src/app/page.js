"use client";

import Image from "next/image";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import GetStarted from "@/components/Home/GetStarted";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Load Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: window.location.pathname,
    });
  }, []);

  return (
    <>
      <Head>
        <title>File Gen</title>
        <meta name="description" content="Raymond Ngobeni" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        ></script>
      </Head>
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
