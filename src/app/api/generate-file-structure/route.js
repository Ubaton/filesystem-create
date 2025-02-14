import { GoogleGenerativeAI } from "@google/generative-ai";
import { structures } from "@/templates/projectStructures";
import { proStructure } from "@/templates/proProjectStuctres";

const getDependencies = (projectType) => {
  const commonDeps = {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1"
  };

  const projectDeps = {
    blog: {
      "mdx": "^0.2.3",
      "@mdx-js/loader": "^3.0.0",
      "@mdx-js/react": "^3.0.0",
      "gray-matter": "^4.0.3",
      "remark": "^15.0.1",
      "remark-html": "^16.0.1"
    },
    ecommerce: {
      "@stripe/stripe-js": "^2.4.0",
      "stripe": "^14.14.0",
      "@prisma/client": "^5.8.1",
      "prisma": "^5.8.1"
    },
    portfolio: {
      "framer-motion": "^10.18.0",
      "three": "^0.160.0",
      "@react-three/fiber": "^8.15.14"
    }
  };

  return {
    dependencies: {
      ...commonDeps,
      ...(projectDeps[projectType.toLowerCase()] || {})
    }
  };
};

export async function POST(req) {
  try {
    const { request } = await req.json();
    
    // Parse @filegen/ProjectType syntax
    const match = request.match(/@filegen\/([\w-]+)/);
    if (!match) {
      return Response.json(
        { error: "Invalid syntax. Use @filegen/ProjectType format." },
        { status: 400 }
      );
    }

    const projectType = match[1];
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_CHAT_FILE_GENERATE
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine all templates
    const allTemplates = { ...structures, ...proStructure };
    
    // Create a context from all templates
    const templateContext = Object.entries(allTemplates)
      .map(([name, structure]) => `Project Type: ${name}\nStructure:\n${structure}\n---\n`)
      .join("\n");

    // Create the prompt
    const prompt = `You are a file structure generator. Below are examples of different project structures:

${templateContext}

Based on these examples, generate a detailed file structure for a "${projectType}" project. 
Follow these rules:
1. Use a similar format to the examples
2. Include common modern best practices
3. Organize files logically by feature/functionality
4. Include necessary configuration files
5. Follow the naming conventions shown in the examples
6. Include appropriate API routes if needed
7. Include common utilities and components

Generate the structure now:`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chat.sendMessage(projectType);
    const structure = result.response.text();

    // Get dependencies for the project type
    const dependencies = getDependencies(projectType);

    // Create package.json content
    const packageJson = {
      name: projectType.toLowerCase(),
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      ...dependencies
    };

    return Response.json({ 
      structure,
      packageJson: JSON.stringify(packageJson, null, 2),
      copyCommand: `npx create-next-app@latest ${projectType.toLowerCase()} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` 
    });
  } catch (error) {
    console.error("Error generating structure:", error);
    return Response.json(
      { error: "Failed to generate file structure" },
      { status: 500 }
    );
  }
}
