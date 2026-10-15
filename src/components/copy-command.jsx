"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export default function CopyCommand({ children }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="copy-command">
      <code>{children}</code>
      <button
        className="icon-button"
        aria-label="Copy command"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            toast.error("Could not copy. Please select the command manually.");
          }
        }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}
