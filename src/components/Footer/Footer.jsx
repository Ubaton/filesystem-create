import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import FileGenLogo from "@/public/assets/GrayFIleGen.png";
export default function Footer() {
  return (
    <footer className="fg-footer">
      <div className="fg-container">
        <div className="footer-top">
          <div>
            <Link href="/" className="fg-brand">
              <Image src={FileGenLogo} alt="" width={40} height={40} className="brand-logo" />
              FileGen<span className="brand-dot">.</span>
            </Link>
            <p>A little structure. A lot of possibility.</p>
          </div>
          <div className="footer-links">
            <Link href="/generate-file">Workspace</Link>
            <Link href="/project-file">Templates</Link>
            <Link href="/docs">Documentation</Link>
            <a
              href="https://github.com/Ubaton/filesystem-create"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} FileGen. Built for the joy of building.
          </span>
          <span>
            <span className="status-dot" />
            Free, open source, and made for you.
          </span>
        </div>
      </div>
    </footer>
  );
}
