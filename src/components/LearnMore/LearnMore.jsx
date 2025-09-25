import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Zap,
  Play,
  Code,
  Users,
  Shield,
  Download,
  BookOpen,
  ArrowRight,
  Eye,
  Settings,
  Archive,
  Palette,
  Navigation,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const LearnMore = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  const sectionRefs = useRef({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const containerStyle = {
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const navigationItems = [
    {
      id: "introduction",
      label: "Introduction",
      icon: <FileText className="h-4 w-4" />,
    },
    { id: "features", label: "Features", icon: <Zap className="h-4 w-4" /> },
    {
      id: "how-to-use",
      label: "How to Use",
      icon: <Play className="h-4 w-4" />,
    },
    {
      id: "technologies",
      label: "Technologies",
      icon: <Code className="h-4 w-4" />,
    },
    {
      id: "contributing",
      label: "Contributing",
      icon: <Users className="h-4 w-4" />,
    },
    { id: "license", label: "License", icon: <Shield className="h-4 w-4" /> },
  ];

  const featureItems = [
    {
      icon: <Settings className="h-4 w-4" />,
      title: "Interactive file structure input",
      description:
        "Intuitive text-based interface for defining your project structure",
    },
    {
      icon: <Eye className="h-4 w-4" />,
      title: "Real-time visual preview",
      description:
        "Live preview of your file structure as you type with instant feedback",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Customizable file types",
      description: "Set default extensions for files without explicit types",
    },
    {
      icon: <Archive className="h-4 w-4" />,
      title: "ZIP file generation",
      description:
        "Download your complete project structure as a ready-to-use ZIP file",
    },
    {
      icon: <Palette className="h-4 w-4" />,
      title: "Theme support",
      description:
        "Dark and light mode toggle for comfortable usage in any environment",
    },
  ];

  const technologies = [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Shadcn UI",
    "Lucide React",
    "JSZip",
    "File-saver",
    "JavaScript",
  ];

  const steps = [
    {
      number: "1",
      title: "Define your structure",
      description:
        "Enter your desired file structure in the text area, using spaces or tabs for indentation to represent folder hierarchy.",
    },
    {
      number: "2",
      title: "Configure file types",
      description:
        "Select the default file type for files without extensions to ensure proper file creation.",
    },
    {
      number: "3",
      title: "Generate and preview",
      description:
        "Click 'Generate Structure' to visualize your file structure and verify it matches your expectations.",
    },
    {
      number: "4",
      title: "Download your project",
      description:
        "Click 'Download ZIP' to get a complete ZIP file containing your entire project structure.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-12 px-4 w-full">
        <div className="flex gap-8">
          {/* Mini-map Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <Card className="shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Navigation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <div
                          className={`transition-colors duration-200 ${
                            activeSection === item.id
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        {activeSection === item.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground opacity-80" />
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div style={containerStyle}>
              <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                      File Structure Generator
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">
                    Create, visualize, and download file structures with ease
                  </p>
                </CardHeader>

                <CardContent className="px-8 pb-8 ">
                  <ScrollArea className="h-[70vh] w-full pr-4">
                    <div className="space-y-10">
                      {/* Introduction */}
                      <section
                        id="introduction"
                        ref={(el) => (sectionRefs.current.introduction = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            What is File Structure Generator?
                          </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-lg pl-14">
                          File Structure Generator is a powerful developer tool
                          that allows you to create and visualize file
                          structures, then generate downloadable ZIP files based
                          on your input. Built with modern web technologies, it
                          provides an interactive and user-friendly interface
                          that streamlines project scaffolding and file
                          organization.
                        </p>
                      </section>

                      <Separator className="my-8" />

                      {/* Features */}
                      <section
                        id="features"
                        ref={(el) => (sectionRefs.current.features = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            Key Features
                          </h2>
                        </div>
                        <div className="grid gap-4 pl-14">
                          {featureItems.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors duration-200"
                            >
                              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                                {feature.icon}
                              </div>
                              <div>
                                <span className="font-semibold text-foreground block mb-1">
                                  {feature.title}
                                </span>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <Separator className="my-8" />

                      {/* How to Use */}
                      <section
                        id="how-to-use"
                        ref={(el) => (sectionRefs.current["how-to-use"] = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Play className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            How to Use
                          </h2>
                        </div>
                        <div className="space-y-5 pl-14">
                          {steps.map((step, index) => (
                            <div
                              key={index}
                              className="flex gap-5 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
                                {step.number}
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2 text-foreground text-lg">
                                  {step.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <Separator className="my-8" />

                      {/* Technologies */}
                      <section
                        id="technologies"
                        ref={(el) => (sectionRefs.current.technologies = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Code className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            Technologies Used
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-14">
                          {technologies.map((tech, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors duration-200"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                              <span className="text-sm font-medium text-foreground truncate">
                                {tech}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>

                      <Separator className="my-8" />

                      {/* Contributing */}
                      <section
                        id="contributing"
                        ref={(el) => (sectionRefs.current.contributing = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            Contributing
                          </h2>
                        </div>
                        <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary ml-14">
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            We welcome contributions from the developer
                            community! Whether it&apos;s bug fixes, feature
                            enhancements, or documentation improvements, your
                            contributions help make this tool better for
                            everyone. Please feel free to submit a Pull Request
                            to our project repository.
                          </p>
                        </div>
                      </section>

                      <Separator className="my-8" />

                      {/* License */}
                      <section
                        id="license"
                        ref={(el) => (sectionRefs.current.license = el)}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 px-1">
                          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">
                            License
                          </h2>
                        </div>
                        <div className="p-6 rounded-xl bg-muted/30 border border-border ml-14">
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            This project is open source and available under the{" "}
                            <span className="font-semibold text-foreground bg-primary/10 px-2 py-1 rounded">
                              MIT License
                            </span>
                            . You&apos;re free to use, modify, and distribute
                            this software in accordance with the license terms.
                          </p>
                        </div>
                      </section>
                    </div>
                  </ScrollArea>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-border">
                    <Button className="flex-1 gap-2 h-12 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200">
                      <Play className="h-4 w-4" />
                      Get Started
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 h-12 text-base font-medium bg-transparent hover:bg-muted/50 transition-all duration-200"
                    >
                      <BookOpen className="h-4 w-4" />
                      View Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 h-12 text-base font-medium bg-transparent hover:bg-muted/50 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                      Download Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
