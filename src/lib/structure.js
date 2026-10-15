export const examples = {
  react: {
    label: "React app",
    description: "A clean foundation for your next React project.",
    language: "tsx",
    source:
      "src/\n  components/\n    Button.tsx\n    Header.tsx\n  hooks/\n    useLocalStorage.ts\n  styles/\n    globals.css\n  App.tsx\n  main.tsx\npublic/\n  images/\npackage.json\nREADME.md",
  },
  next: {
    label: "Next.js app",
    description: "App Router, shared components, and API routes.",
    language: "tsx",
    source:
      "src/\n  app/\n    layout.tsx\n    page.tsx\n    globals.css\n    api/\n      hello/\n        route.ts\n  components/\n    Header.tsx\n    Footer.tsx\n  lib/\n    utils.ts\npublic/\n  images/\npackage.json\nREADME.md",
  },
  python: {
    label: "Python API",
    description: "A small, organized starting point for a Python API.",
    language: "py",
    source:
      "app/\n  routes/\n    health.py\n  services/\n    example.py\n  __init__.py\n  main.py\ntests/\n  test_health.py\nrequirements.txt\nREADME.md\n.gitignore",
  },
  website: {
    label: "Static website",
    description: "The essentials for a lightweight website.",
    language: "html",
    source:
      "assets/\n  images/\n  styles/\n    main.css\n  scripts/\n    main.js\nindex.html\nabout.html\nREADME.md",
  },
};

export function parseStructure(source, extension = "tsx") {
  const root = { name: "project", type: "folder", children: [], path: "" };
  const stack = [{ node: root, depth: -1 }];
  let files = 0,
    folders = 0;
  const paths = new Set();
  source.split("\n").forEach((line, index) => {
    if (!line.trim()) return;
    const normalized = line.replace(/\t/g, "  ");
    const spaces = normalized.match(/^ */)[0].length;
    if (spaces % 2)
      throw new Error(
        `Line ${index + 1}: use two spaces per indentation level.`,
      );
    const depth = spaces / 2;
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth)
      stack.pop();
    const parent = stack[stack.length - 1];
    if (depth !== parent.depth + 1)
      throw new Error(
        `Line ${index + 1}: place this item inside a folder, using two spaces.`,
      );
    const folder = normalized.trim().endsWith("/");
    let name = normalized.trim().replace(/\/$/, "");
    if (
      !name ||
      name === "." ||
      name === ".." ||
      /[\\/:*?"<>|\x00-\x1f]/.test(name) ||
      /[. ]$/.test(name) ||
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(name)
    )
      throw new Error(`Line ${index + 1}: enter a valid file or folder name.`);
    if (!folder && !name.includes(".")) name += `.${extension}`;
    const path = parent.node.path ? `${parent.node.path}/${name}` : name;
    if (paths.has(path.toLowerCase()))
      throw new Error(
        `Line ${index + 1}: “${name}” already exists in this folder.`,
      );
    paths.add(path.toLowerCase());
    const node = {
      name,
      path,
      type: folder ? "folder" : "file",
      ...(folder ? { children: [] } : {}),
    };
    parent.node.children.push(node);
    if (folder) {
      folders++;
      stack.push({ node, depth });
    } else files++;
  });
  return { root, files, folders };
}

export function fileContent(name) {
  const ext = name.split(".").pop();
  const component =
    name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "") || "Component";
  const safeName = /^[A-Za-z]/.test(component)
    ? component[0].toUpperCase() + component.slice(1)
    : `Component${component}`;
  if (ext === "tsx" || ext === "jsx")
    return `export default function ${safeName}() {\n  return <div>${safeName}</div>;\n}\n`;
  if (ext === "json") return "{}\n";
  if (ext === "md") return `# ${component}\n\nYour project starts here.\n`;
  if (ext === "py") return `"""${component} module."""\n`;
  if (ext === "html")
    return '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My project</title>\n</head>\n<body>\n  <h1>Hello, world.</h1>\n</body>\n</html>\n';
  return "";
}
