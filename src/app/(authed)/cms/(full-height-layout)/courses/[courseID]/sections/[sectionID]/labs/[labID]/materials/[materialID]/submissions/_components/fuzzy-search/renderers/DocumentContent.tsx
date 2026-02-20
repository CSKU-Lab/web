"use client";

import { FileText } from "lucide-react";

export function DocumentContent() {
  return (
    <div className="flex items-center gap-3 text-sm text-(--gray-11)">
      <FileText size={18} className="text-(--gray-9) shrink-0" />
      <span>Document submission</span>
    </div>
  );
}
