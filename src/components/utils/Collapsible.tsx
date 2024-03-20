"use client";

import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export default function Collapsible({ label, children, className }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="peer flex w-full justify-between border-b-2 p-2 pr-4"
      >
        <p className="capitalize">{label}</p>
        <span>
          <ChevronUp
            key={`${label}-collapsible-toggle`}
            className={cn("transition-transform", {
              "rotate-[-180deg]": isOpen,
            })}
          />
        </span>
      </button>

      <div
        key={`${label}-collapsible-children`}
        className={cn(
          "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300",
          { "grid-rows-[1fr]": isOpen },
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
