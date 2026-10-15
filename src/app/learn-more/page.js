import LearnMore from "@/components/LearnMore/LearnMore";
import { metadataFilegen } from "../metadata";

export const metadata = {
  title: "Learn More — Filegen",
  description:
    "Learn how Filegen helps you scaffold projects: structure syntax, templates, AI generation, and ZIP export.",
  alternates: {
    canonical: `${metadataFilegen.metadataBase}/learn-more`,
  },
};

export default function LearnMorePage() {
  return <LearnMore />;
}
