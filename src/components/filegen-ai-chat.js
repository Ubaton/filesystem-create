import React from "react";
import { Terminal } from "lucide-react";

const FilegenAIChat = () => {
  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
      <section className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            FileGen AI Chat
          </h2>
          <p className="text-sm sm:text-base mb-3 sm:mb-4">
            FileGen uses a simple syntax to generate project structures with
            Filegen AI Chat:
          </p>
          <div className="bg-zinc-900 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 overflow-x-auto">
            <code className="text-white text-sm sm:text-base">
              @filegen/[ProjectType]
            </code>
          </div>
          <p className="text-sm sm:text-base">
            Replace [ProjectType] with: blog, ecommerce, or portfolio etc.
          </p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Automatic Dependencies
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>• Next.js 14^</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• TailwindCSS</li>
              </ul>
            </div>
            <div className="p-3 sm:p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Project Structure
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>• Feature-based organization</li>
                <li>• Modern Next.js app directory</li>
                <li>• API routes included</li>
                <li>• Common utilities</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Example Usage
          </h2>
          <div className="bg-zinc-900 p-3 sm:p-4 rounded-lg overflow-x-auto">
            <pre className="text-white text-xs sm:text-sm">
              {`const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    request: '@filegen/blog'
  })
});`}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Response Structure
          </h2>
          <div className="bg-zinc-900 p-3 sm:p-4 rounded-lg overflow-x-auto">
            <pre className="text-white text-xs sm:text-sm">
              {`{
  structure: string,    // Generated file structure
  packageJson: string,  // Package.json content
  copyCommand: string   // Next.js creation command
}`}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Next.js Integration
          </h2>
          <div className="bg-zinc-900 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 overflow-x-auto">
            <code className="text-white text-xs sm:text-sm">
              npx create-next-app@latest [project-name] --typescript --tailwind
              --eslint --app --src-dir --import-alias &quot;@/*&quot;
            </code>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Best Practices
          </h2>
          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <li>1. Always check the generated structure before implementing</li>
            <li>2. Review and adjust dependencies as needed</li>
            <li>3. Follow the provided file organization patterns</li>
            <li>4. Use the provided configuration files as a starting point</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default FilegenAIChat;
