#!/usr/bin/env node

const program = require("commander");
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");

async function promptUser() {
  const questions = [
    {
      type: "list",
      name: "projectType",
      message: "What type of project do you want to generate?",
      choices: ["blogpost", "ecommerce", "tech", "portfolio"],
    },
    {
      type: "confirm",
      name: "replaceApp",
      message: "Do you want to replace the app folder in the src?",
      default: false,
    },
    {
      type: "confirm",
      name: "useTypescript",
      message: "Do you want to use TypeScript?",
      default: true,
    },
  ];

  return inquirer.prompt(questions);
}

async function generateStructure(options) {
  const { projectType, replaceApp, useTypescript } = options;
  const srcPath = path.join(process.cwd(), "src");
  const appPath = path.join(srcPath, "app");
  const templatePath = path.join(__dirname, "..", "templates", projectType);
  const extension = useTypescript ? "ts" : "js";

  if (!fs.existsSync(templatePath)) {
    console.error(`Template for "${projectType}" not found.`);
    process.exit(1);
  }

  // Ensure src directory exists
  fs.ensureDirSync(srcPath);

  // Handle app folder replacement
  if (replaceApp) {
    fs.removeSync(appPath);
    fs.copySync(path.join(templatePath, "app"), appPath);
  } else {
    fs.copySync(path.join(templatePath, "app"), appPath, { overwrite: false });
  }

  // Copy other directories
  ["components", "lib", "styles"].forEach((dir) => {
    fs.copySync(path.join(templatePath, dir), path.join(srcPath, dir), {
      overwrite: false,
    });
  });

  // Rename files based on language choice
  if (useTypescript) {
    renameFiles(srcPath, ".js", ".ts");
    renameFiles(srcPath, ".jsx", ".tsx");
  } else {
    renameFiles(srcPath, ".ts", ".js");
    renameFiles(srcPath, ".tsx", ".jsx");
  }

  console.log(
    `Successfully generated "${projectType}" structure in your Next.js project.`
  );
}

function renameFiles(dir, fromExt, toExt) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      renameFiles(filePath, fromExt, toExt);
    } else if (path.extname(file) === fromExt) {
      fs.renameSync(
        filePath,
        path.join(dir, path.basename(file, fromExt) + toExt)
      );
    }
  });
}

program
  .version("1.0.0")
  .description("Generate and customize Next.js project structures")
  .action(async () => {
    const options = await promptUser();
    await generateStructure(options);
  });

program.parse(process.argv);
