"use client";

import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Print A5 card" }: { label?: string }) {
  return (
    <Button
      type="button"
      className="h-11 rounded-full bg-[#1e4038] px-5 text-[#f6f1e6] hover:bg-[#16332d]"
      onClick={() => window.print()}
    >
      {label}
    </Button>
  );
}
