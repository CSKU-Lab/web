"use client";

import { Type } from "lucide-react";

export function TypeContent() {
  return (
    <div className="flex items-center gap-3 text-sm text-(--gray-11)">
      <Type size={18} className="text-(--gray-9) shrink-0" />
      <span>Typed response submission</span>
    </div>
  );
}
