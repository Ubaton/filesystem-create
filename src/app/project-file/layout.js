import { metadataFilegen } from "../metadata";

export const metadata = {
  title: "Project Templates | Filegen",
  description: "Browse and select from ready-made project templates including React, Next.js, Node.js, and more to kickstart your development.",
  openGraph: {
    title: "Filegen Project Templates",
    description: "Ready-made templates for popular frameworks and project types to accelerate your development workflow.",
    url: `${metadataFilegen.metadataBase}/project-file`,
  },
  alternates: {
    canonical: `${metadataFilegen.metadataBase}/project-file`,
  },
};

export default function ProjectFileLayout({ children }) {
  return children;
}