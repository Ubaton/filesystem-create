"use cache";

import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navigation from "../components/Navbar/Navigation";
import Footer from "../components/Footer/Footer";
import { Toaster } from "sonner";
import ScrollToTop from "../components/ui/sroll-to-top";
import { Analytics } from "@vercel/analytics/react";

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

export const metadata = {
  title: "File Structure Generator",
  description:
    "File Structure Generator built with Next.js and React. It allows users to create and visualize file structures, and generate downloadable ZIP files based on the input",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
            <Toaster position="top-center" />
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </>
  );
}
