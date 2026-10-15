"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import FileGenLogo from "@/public/assets/GrayFIleGen.png";
import { FiGithub as Github } from "react-icons/fi";
import { useState } from "react";
import ThemeToggle from "../ui/theme-toggle";
export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    ["/generate-file", "Workspace"],
    ["/project-file", "Templates"],
    ["/docs", "Documentation"],
  ];
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="fg-nav">
        <div className="fg-container nav-inner">
          <Link className="fg-brand" href="/" onClick={() => setOpen(false)}>
            <Image src={FileGenLogo} alt="" width={40} height={40} priority className="brand-logo" />
            FileGen<span className="brand-dot">.</span>
          </Link>
          <nav
            className={`nav-links ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <a
              href="https://github.com/Ubaton/filesystem-create"
              target="_blank"
              rel="noreferrer"
              className="github-link"
              aria-label="FileGen on GitHub"
            >
              <Github size={18} />
            </a>
            <ThemeToggle />
            <Link href="/generate-file" className="fg-button nav-cta">
              Start building <ArrowUpRight size={14} />
            </Link>
            <button
              className="mobile-menu icon-button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
