/**
 * Story content for the architecture section. `files` / `folders` drive the
 * readout counters, interpolated continuously between chapters.
 */
export const chapters = [
  {
    id: "foundation",
    number: "01",
    tag: "START WITH CODE",
    layer: "CODE",
    title: "A little code. A new beginning.",
    text: "Start with an outline and a few lines of possibility. FileGen turns your plan into real files, with starter content you can inspect before you download.",
    file: "App.tsx",
    files: 1,
    folders: 0,
    items: [
      "Plain-text outlines",
      "Live structure validation",
      "A starting point you control",
    ],
    link: "/generate-file",
    action: "Sketch your foundation",
  },
  {
    id: "structure",
    number: "02",
    tag: "FILES BECOME FOLDERS",
    layer: "FILES & FOLDERS",
    title: "Your files find their home.",
    text: "A component, a stylesheet, a new route. Bring related files together inside folders. Nest them with a simple indent, and watch your project take shape.",
    file: "src/components/",
    files: 9,
    folders: 3,
    items: [
      "Nested folders, without the busywork",
      "React, Next.js, Python, and more",
      "Starters you can make your own",
    ],
    link: "/project-file",
    action: "Find your starting point",
  },
  {
    id: "details",
    number: "03",
    tag: "A PROJECT, CONNECTED",
    layer: "PROJECT TREE",
    title: "Every branch. Ready to build.",
    text: "Folders connect into a complete directory tree. Explore every branch, check the details, and download it all as a ZIP. Your outline is now a project you can build on.",
    file: "my-project.zip",
    files: 24,
    folders: 8,
    items: [
      "Preview generated starter content",
      "Keep empty folders and dotfiles",
      "Export directly from your browser",
    ],
    link: "/generate-file",
    action: "Bring your project to life",
  },
];

/** Linear interpolation of a numeric chapter field at a continuous progress. */
export function interpolate(field, progress) {
  const low = Math.floor(progress);
  const high = Math.min(chapters.length - 1, low + 1);
  const t = progress - low;
  return chapters[low][field] + (chapters[high][field] - chapters[low][field]) * t;
}
