import { metadataFilegen } from "../metadata";

export const metadata = {
  title: "Generate File Structure | Filegen",
  description: "Create and download complete file structures for your projects with our interactive generator. Supports multiple file types and templates.",
  openGraph: {
    title: "Filegen File Structure Generator",
    description: "Interactive tool to generate, preview, and download project file structures instantly.",
    url: `${metadataFilegen.metadataBase}/generate-file`,
  },
  alternates: {
    canonical: `${metadataFilegen.metadataBase}/generate-file`,
  },
};

export default function GenerateFileLayout({ children }) {
  return children;
}