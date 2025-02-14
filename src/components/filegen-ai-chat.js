import React from 'react';
import { Terminal } from 'lucide-react';

const FilegenAIChat = () => {
    return (
        <div className="w-full mx-auto p-6">
           

            <section className="space-y-6">
            
                <div>
                    <h2 className="text-2xl font-semibold mb-4">FileGen AI Chat</h2>
                    <p className="mb-4">FileGen uses a simple syntax to generate project structures with Filegen AI Chat:</p>
                    <div className="bg-zinc-900 p-4 rounded-lg mb-4">
                        <code className="text-white">@filegen/[ProjectType]</code>
                    </div>
                    <p>Replace [ProjectType] with: blog, ecommerce, or portfolio etc.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Automatic Dependencies</h3>
                            <ul className="space-y-2">
                                <li>• Next.js 14^</li>
                                <li>• React 18</li>
                                <li>• TypeScript</li>
                                <li>• TailwindCSS</li>
                            </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Project Structure</h3>
                            <ul className="space-y-2">
                                <li>• Feature-based organization</li>
                                <li>• Modern Next.js app directory</li>
                                <li>• API routes included</li>
                                <li>• Common utilities</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Example Usage</h2>
                    <div className="bg-zinc-900 p-4 rounded-lg">
                        <pre className="text-white">
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
                    <h2 className="text-2xl font-semibold mb-4">Response Structure</h2>
                    <div className="bg-zinc-900 p-4 rounded-lg">
                        <pre className="text-white">
{`{
  structure: string,    // Generated file structure
  packageJson: string,  // Package.json content
  copyCommand: string   // Next.js creation command
}`}
                        </pre>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Next.js Integration</h2>
                    <div className="bg-zinc-900 p-4 rounded-lg mb-4">
                        <code className="text-white text-sm">
                            npx create-next-app@latest [project-name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
                        </code>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
                    <ul className="space-y-2">
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