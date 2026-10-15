import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function AccountFree() {
  return (
    <section className="account-free">
      <div className="step-icon">
        <LockKeyhole size={23} />
      </div>
      <div className="page-heading">
        <span className="eyebrow">ONE LESS THING TO SET UP</span>
        <h1>You’re already good to go.</h1>
        <p>
          FileGen works without an account. Create a structure, save a draft on
          this device, and download your project whenever you’re ready.
        </p>
      </div>
      <Link className="fg-button primary" href="/generate-file">
        Open your workspace <ArrowRight size={16} />
      </Link>
      <Link className="inline-link" href="/docs">
        Explore the documentation <ArrowRight size={14} />
      </Link>
    </section>
  );
}
