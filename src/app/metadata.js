const baseUrl = "https://filegen.vercel.app";

export const metadataFilegen = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Filegen | File Structure Generator",
    template: "%s | Filegen",
  },
  description:
    "Filegen helps you create, preview, and download file structures for web projects. Fast, simple, and ideal for bootstrapping new projects.",
  keywords: [
    "file structure generator",
    "filegen",
    "project scaffolding",
    "nextjs",
    "generator",
    "template",
  ],
  authors: [{ name: "Raymond Ngobeni" }],
  creator: "Raymond Ngobeni",
  publisher: "Raymond Ngobeni",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Filegen",
    title: "Filegen | File Structure Generator",
    description:
      "Create and download complete file structures for your projects. Filegen visualizes folder trees and exports ZIPs ready to use.",
    images: [
      {
        url: "/assets/GrayFIleGen.png",
        width: 1200,
        height: 630,
        alt: "Filegen preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filegen | File Structure Generator",
    description:
      "Create and download complete file structures for your projects. Filegen visualizes folder trees and exports ZIPs ready to use.",
    images: ["/assets/GrayFIleGen.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
  alternates: {
    canonical: baseUrl,
  },
  manifest: `${baseUrl}/site.webmanifest`,
};

export default metadataFilegen;
