import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

export function Callout({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "my-6 flex items-start rounded-md border border-blue-200 bg-blue-100 p-2 dark:border-blue-900 dark:bg-blue-950",
        className
      )}
      {...props}
    >
      <InfoIcon className="h-4 w-4 mt-1 mr-2 text-blue-900 dark:text-blue-400" />
      <div className="text-sm text-blue-900 dark:text-blue-400 [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
