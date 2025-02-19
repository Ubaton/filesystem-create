const baseUrl = "https://filegen.vercel.app/";

export const metadataFilegen = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Filegen - File Structure Generator",
    template: "%s | Filegen",
  },
  description:
    "Filegen is a file structure generator that allows users to create and visualize file structures, and generate downloadable ZIP files based on the input.",
  keywords: [
    "filegen",
    "project",
    "SEO",
    "file structure generator",
    "file structure",
    "filegen project",
    "filegen SEO",
    "file",
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
    locale: "en_ZA",
    url: baseUrl,
    siteName: "Filegen",
    title: "Filegen - File Structure Generator",
    description: "Filegen is a file structure generator that allows users to create and visualize file structures, and generate downloadable ZIP files based on the input.",
    images: [
      {
        url: "/public/assets/GrayFIleGen.png",
        width: 1200,
        height: 630,
        alt: "Filegen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filegen - File Structure Generator",
    description: "Filegen is a file structure generator that allows users to create and visualize file structures, and generate downloadable ZIP files based on the input.",
    images: ["/public/assets/GrayFIleGen.png"],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default metadataFilegen;
