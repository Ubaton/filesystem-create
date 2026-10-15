"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  File,
  FileCode2,
  Folder,
  FolderOpen,
  Layers,
  Plus,
  RotateCcw,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { examples, parseStructure, fileContent } from "@/lib/structure";

function TreeNode({ node, onSelect, selected }) {
  const [open, setOpen] = useState(true);
  const folder = node.type === "folder";
  return (
    <div className="tree-node">
      <button
        className={`tree-row ${selected?.path === node.path ? "selected" : ""}`}
        onClick={() => (folder ? setOpen(!open) : onSelect(node))}
        aria-expanded={folder ? open : undefined}
      >
        {folder ? (
          <>
            <span className="tree-chevron">
              {open ? <ChevronDown /> : <ChevronRight />}
            </span>
            {open ? (
              <FolderOpen className="folder-icon" />
            ) : (
              <Folder className="folder-icon" />
            )}
          </>
        ) : (
          <>
            <span className="tree-chevron" />
            <FileCode2
              className={`file-icon ext-${node.name.split(".").pop()}`}
            />
          </>
        )}
        <span>{node.name}</span>
      </button>
      {folder && open && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              {...{ onSelect, selected }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Workspace({ compact = false }) {
  const [source, setSource] = useState(examples.react.source);
  const [language, setLanguage] = useState("tsx");
  const [template, setTemplate] = useState("react");
  const [name, setName] = useState("my-project");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("tree");
  const upload = useRef(null);
  const editor = useRef(null);
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const pending = sessionStorage.getItem("filegen-template");
      const outline = sessionStorage.getItem("filegen-outline");
      const draft = localStorage.getItem("filegen-workspace-v1");
      if (outline) {
        setSource(outline);
        setLanguage("tsx");
        setTemplate("custom");
        sessionStorage.removeItem("filegen-outline");
      } else if (pending && examples[pending]) {
        setSource(examples[pending].source);
        setLanguage(examples[pending].language);
        setTemplate(pending);
        sessionStorage.removeItem("filegen-template");
      } else if (draft) {
        const data = JSON.parse(draft);
        if (typeof data.source === "string") setSource(data.source);
        if (
          ["tsx", "jsx", "ts", "js", "py", "html", "css", "md"].includes(
            data.language,
          )
        )
          setLanguage(data.language);
        if (typeof data.name === "string") setName(data.name);
        setTemplate("custom");
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    setSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          "filegen-workspace-v1",
          JSON.stringify({ source, language, name }),
        );
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [source, language, name, ready]);
  const result = useMemo(() => {
    try {
      return { ...parseStructure(source, language), error: null };
    } catch (error) {
      return { error: error.message };
    }
  }, [source, language]);
  const choose = (key) => {
    setTemplate(key);
    setSource(examples[key].source);
    setLanguage(examples[key].language);
    setSelected(null);
    setView("tree");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      toast.success("Structure copied to clipboard");
    } catch {
      toast.error(
        "Clipboard unavailable. Select and copy the structure manually.",
      );
    }
  };
  const download = async () => {
    if (result.error || !result.root.children.length) return;
    setBusy(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const add = (node) => {
        if (node.type === "folder") {
          if (node.path) zip.folder(node.path);
          node.children.forEach(add);
        } else zip.file(node.path, fileContent(node.name));
      };
      add(result.root);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${name.replace(/[^a-z0-9_-]/gi, "-").replace(/^-+|-+$/g, "") || "my-project"}.zip`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Downloaded ${result.files} files. Happy building!`);
    } catch {
      toast.error("Could not create the ZIP. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className={`workspace ${compact ? "workspace-compact" : ""}`}
      id="workspace"
    >
      <div className="workspace-toolbar">
        <div className="workspace-title">
          <span className="workspace-symbol">
            <Layers size={16} />
          </span>
          <span>Project workspace</span>
          <span className="local-badge">LOCAL</span>
        </div>
        <span className="autosave" aria-live="polite">
          <span className={saved ? "status-dot" : "status-dot pending"} />
          {saved ? "Draft saved" : "Local workspace"}
        </span>
      </div>
      <div className="workspace-options">
        <div className="starter-tabs" aria-label="Starter template">
          {Object.entries(examples)
            .slice(0, 3)
            .map(([key, item]) => (
              <button
                key={key}
                onClick={() => choose(key)}
                className={template === key ? "active" : ""}
                aria-pressed={template === key}
              >
                {item.label}
              </button>
            ))}
        </div>
        <button
          className="text-button"
          onClick={() => {
            setSource("");
            setTemplate("custom");
            setSelected(null);
            editor.current?.focus();
          }}
        >
          <Plus size={14} />
          Start blank
        </button>
      </div>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="panel-heading">
            <span>
              <Code2 size={15} />
              Structure
            </span>
            <div className="panel-actions">
              <button
                onClick={() => upload.current.click()}
                aria-label="Import a text structure"
                title="Import text file"
              >
                <Upload size={15} />
              </button>
              <button
                onClick={copy}
                aria-label="Copy structure"
                title="Copy structure"
              >
                <Copy size={15} />
              </button>
              <button
                onClick={() => choose("react")}
                aria-label="Reset to React example"
                title="Reset to example"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <div className="code-editor">
            <div className="line-numbers" aria-hidden="true">
              {source.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={editor}
              spellCheck={false}
              style={{ height: `${source.split("\n").length * 24}px` }}
              title="Tab indents. Shift+Tab moves to the previous control. Escape leaves the editor."
              aria-label="Project structure. Use two spaces to nest items and a trailing slash for folders."
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setTemplate("custom");
                setSelected(null);
              }}
              placeholder={"my-project/\n  src/\n    App.tsx"}
              onKeyDown={(e) => {
                if (e.key === "Escape") e.currentTarget.blur();
                if (e.key === "Tab" && !e.shiftKey) {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const start = el.selectionStart,
                    end = el.selectionEnd;
                  setSource(source.slice(0, start) + "  " + source.slice(end));
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = start + 2;
                  });
                }
              }}
            />
          </div>
          <div className="editor-hint">
            <span>Two spaces to nest · / for folders</span>
            <label>
              Default file{" "}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Default file extension"
              >
                {["tsx", "jsx", "ts", "js", "py", "html", "css", "md"].map(
                  (ext) => (
                    <option key={ext}>{ext}</option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>
        <section className="preview-panel">
          <div className="panel-heading">
            <div className="preview-tabs">
              <button
                className={view === "tree" ? "active" : ""}
                aria-pressed={view === "tree"}
                onClick={() => setView("tree")}
              >
                <Folder size={14} />
                Explorer
              </button>
              <button
                className={view === "code" ? "active" : ""}
                aria-pressed={view === "code"}
                onClick={() => setView("code")}
              >
                <File size={14} />
                File preview
              </button>
            </div>
            <span className="live-label">
              <span className="status-dot" />
              Live
            </span>
          </div>
          <div className="tree-content">
            {result.error ? (
              <div className="workspace-empty" role="alert">
                <Code2 size={26} />
                <strong>A little adjustment needed</strong>
                <p>{result.error}</p>
              </div>
            ) : !result.root.children.length ? (
              <div className="workspace-empty">
                <FolderOpen size={30} />
                <strong>A fresh start.</strong>
                <p>
                  Add a few files on the left. Your project will take shape
                  here.
                </p>
              </div>
            ) : view === "tree" ? (
              <>
                <div className="tree-project">
                  <ChevronDown size={13} />
                  <FolderOpen size={16} />
                  <span>{name || "my-project"}</span>
                </div>
                {result.root.children.map((node) => (
                  <TreeNode
                    key={node.path}
                    node={node}
                    selected={selected}
                    onSelect={(node) => {
                      setSelected(node);
                      setView("code");
                    }}
                  />
                ))}
              </>
            ) : selected ? (
              <>
                <div className="file-preview-name">{selected.path}</div>
                <pre className="file-preview">
                  {fileContent(selected.name) ||
                    "// This file will be created empty."}
                </pre>
              </>
            ) : (
              <div className="workspace-empty">
                <FileCode2 size={30} />
                <strong>Peek inside a file.</strong>
                <p>
                  Select a file in the explorer to preview its starter content.
                </p>
                <button className="text-button" onClick={() => setView("tree")}>
                  Back to explorer
                </button>
              </div>
            )}
          </div>
          <div className="preview-status">
            <span>
              {result.files || 0} files <span className="muted-dot">·</span>{" "}
              {result.folders || 0} folders
            </span>
            <span>
              <Check size={13} />
              {result.error ? "Check structure" : "Ready when you are"}
            </span>
          </div>
        </section>
      </div>
      <div className="workspace-bottom">
        <label className="project-name">
          <Folder size={15} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Project name"
            placeholder="my-project"
          />
          <span>.zip</span>
        </label>
        <span className="export-note">
          <CheckCheck size={15} />
          Generated in your browser
        </span>
        <button
          className="fg-button primary"
          onClick={download}
          disabled={busy || !!result.error || !result.root?.children.length}
        >
          <ArrowDownToLine size={15} />
          {busy ? "Preparing ZIP…" : "Download project"}
          <span className="button-detail">.zip</span>
        </button>
      </div>
      <input
        ref={upload}
        hidden
        type="file"
        accept=".txt,.md"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            if (file.size > 100000) throw new Error();
            setSource(await file.text());
            setTemplate("custom");
            toast.success("Structure imported");
          } catch {
            toast.error("Choose a text file smaller than 100 KB.");
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
