import Link from "next/link";
import { ArrowRight, FolderSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fg-container inner-page account-free">
      <div className="step-icon">
        <FolderSearch size={24} />
      </div>
      <div className="page-heading">
        <span className="eyebrow">404 / A LITTLE OUT OF PLACE</span>
        <h1>This file isn’t in the tree.</h1>
        <p>
          The page you’re looking for may have moved. Let’s get you back to
          something worth building.
        </p>
      </div>
      <Link className="fg-button primary" href="/">
        Back to FileGen <ArrowRight size={16} />
      </Link>
      <Link className="inline-link" href="/generate-file">
        Open the workspace <ArrowRight size={14} />
      </Link>
    </div>
  );
}
