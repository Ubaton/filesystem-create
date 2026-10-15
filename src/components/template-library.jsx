"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Braces,
  Search,
  FolderTree,
  Layers,
  Code2,
} from "lucide-react";
import { examples } from "@/lib/structure";
import { structures } from "@/templates/projectStructures";
import { proStructure } from "@/templates/proProjectStuctres";
import { toast } from "sonner";
const icons = [Braces, Layers, Code2, FolderTree];
export default function TemplateLibrary() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const entries = Object.entries(examples).filter(([, entry]) =>
    `${entry.label} ${entry.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="fg-container inner-page">
      <div className="page-heading">
        <span className="eyebrow">DON’T START FROM ZERO</span>
        <h1>A head start for your next idea.</h1>
        <p>
          Thoughtful project outlines. Pick a starting point, then make it
          yours.
        </p>
      </div>
      <label className="template-search">
        <Search size={18} />
        <input
          placeholder="Find a template…"
          aria-label="Search templates"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>{entries.length} starters</span>
      </label>
      <div className="template-grid">
        {entries.map(([key, entry], i) => {
          const Icon = icons[i % icons.length];
          return (
            <article className="template-card" key={key}>
              <div className="template-card-top">
                <div className="step-icon">
                  <Icon size={22} />
                </div>
                <span className="local-badge">
                  {entry.language.toUpperCase()}
                </span>
              </div>
              <h2>{entry.label}</h2>
              <p>{entry.description}</p>
              <pre>
                {entry.source.split("\n").slice(0, 9).join("\n")}
                <span>{"\n  …"}</span>
              </pre>
              <button
                className="fg-button"
                onClick={() => {
                  sessionStorage.setItem("filegen-template", key);
                  router.push("/generate-file");
                }}
              >
                Use this starter <ArrowUpRight size={15} />
              </button>
            </article>
          );
        })}
      </div>
      {!entries.length && (
        <div className="workspace-empty">
          <Search size={28} />
          <h2>No starters found</h2>
          <p>Try “React”, “Python”, or “website”.</p>
          <button className="fg-button" onClick={() => setSearch("")}>
            Clear search
          </button>
        </div>
      )}
      <div className="library-extra">
        <span className="eyebrow">MORE WAYS TO ORGANIZE</span>
        <h2>Find a structure that fits.</h2>
        <p>
          Browse the original FileGen outlines for common application types.
        </p>
        <div className="outline-grid">
          {Object.entries({ ...structures, ...proStructure })
            .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
            .map(([key, source]) => (
              <details key={key}>
                <summary>
                  <FolderTree size={16} />
                  <span>
                    {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                  </span>
                </summary>
                <pre>{source}</pre>
                <div className="outline-actions">
                  <button
                    className="fg-button"
                    onClick={() => {
                      sessionStorage.setItem("filegen-outline", source);
                      router.push("/generate-file");
                    }}
                  >
                    Use this outline <ArrowUpRight size={14} />
                  </button>
                  <button
                    className="text-button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(source);
                        toast.success("Outline copied");
                      } catch {
                        toast.error("Could not copy the outline.");
                      }
                    }}
                  >
                    Copy outline
                  </button>
                </div>
              </details>
            ))}
        </div>
      </div>
    </div>
  );
}
