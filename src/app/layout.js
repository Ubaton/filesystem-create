import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navigation from "../components/Navbar/Navigation";
import Footer from "../components/Footer/Footer";
import { Toaster } from "sonner";
import ScrollToTop from "../components/ui/sroll-to-top";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { metadataFilegen } from "./metadata";
import AnalyticsLoader from "@/lib/analytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Filegen = metadataFilegen;

export const metadata = {
  title: Filegen.title,
  description: Filegen.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        )}
        
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Canonical link for crawlers */}
        <link rel="canonical" href={metadataFilegen.alternates?.canonical || "https://filegen.vercel.app"} />
        
        {/* Basic structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: metadataFilegen.title?.default || "Filegen",
              url: metadataFilegen.alternates?.canonical || "https://filegen.vercel.app",
              description: metadataFilegen.description,
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="min-h-svh">{children}</main>
          <Footer />
          <ScrollToTop />
          <Toaster position="top-center" />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <AnalyticsLoader />
      </body>
    </html>
  );
}
