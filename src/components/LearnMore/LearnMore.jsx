import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const LearnMore = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Learn More About File Structure Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-[700px] w-full rounded-md border p-4">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                What is File Structure Generator?
              </h2>
              <p>
                File Structure Generator is a tool that allows users to create
                and visualize file structures, and generate downloadable ZIP
                files based on the input. It&apos;s built with Next.js and
                React, providing an interactive and user-friendly interface.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Key Features</h2>
              <ul className="list-disc pl-5">
                <li>Interactive file structure input</li>
                <li>Visual representation of the file structure</li>
                <li>Customizable default file type</li>
                <li>ZIP file generation for download</li>
                <li>Dark/Light mode toggle</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">How to Use</h2>
              <ol className="list-decimal pl-5">
                <li>
                  Enter your desired file structure in the text area, using
                  spaces for indentation.
                </li>
                <li>
                  Select the default file type for files without extensions.
                </li>
                <li>
                  Click &quot;Generate Structure&quot; to visualize the file
                  structure.
                </li>
                <li>
                  Optionally, click &quot;Download ZIP&quot;to get a ZIP file of
                  the structure.
                </li>
              </ol>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Technologies Used</h2>
              <ul className="list-disc pl-5">
                <li>Next.js</li>
                <li>React</li>
                <li>Tailwind CSS</li>
                <li>Shadcn UI</li>
                <li>Lucide React (for icons)</li>
                <li>JSZip (for ZIP file generation)</li>
                <li>File-saver (for downloading files)</li>
                <li>Framer Motion (for animations)</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Contributing</h2>
              <p>
                Contributions are welcome! Please feel free to submit a Pull
                Request to the project repository.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">License</h2>
              <p>
                This project is open source and available under the MIT License.
              </p>
            </section>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearnMore;
