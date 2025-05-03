import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const templates = [
  {
    name: "E-commerce Store",
    features: [
      "Complete shopping cart",
      "Product management",
      "State management with Zustand",
      "TypeScript support",
    ],
  },
  {
    name: "Blog Platform",
    features: [
      "Featured posts section",
      "Dynamic routing",
      "Author profiles",
      "Responsive design",
    ],
  },
  {
    name: "Tech Website",
    features: [
      "Modern landing page",
      "Feature showcase",
      "Contact forms",
      "SEO optimized",
    ],
  },
  {
    name: "Portfolio",
    features: [
      "Project showcase",
      "Skills section",
      "Contact information",
      "Responsive design",
    ],
  },
  {
    name: "SaaS Platform",
    features: [
      "Authentication",
      "Dashboard",
      "User management",
      "Subscription handling",
    ],
  },
  {
    name: "Community Forum",
    features: [
      "Discussion boards",
      "User profiles",
      "Notifications",
      "Search functionality",
    ],
  },
  {
    name: "Learning Management",
    features: [
      "Course structure",
      "Progress tracking",
      "Assessments",
      "User dashboard",
    ],
  },
  {
    name: "News Portal",
    features: [
      "Article layout",
      "Categories",
      "Search functionality",
      "Responsive design",
    ],
  },
];

export function TemplatesSection() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl">
        Available Templates
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Explore the pre-defined templates available in FileGen.
      </p>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template, index) => (
          <Card
            key={index}
            className="shadow-none hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {template.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
