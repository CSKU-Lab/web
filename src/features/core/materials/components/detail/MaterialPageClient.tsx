"use client";

import { type ReactNode } from "react";
import { useSubmissionStatusListener } from "~/features/core/materials/hooks/useSubmissionStatusListener";

interface MaterialPageClientProps {
  materialID: string;
  children: ReactNode;
}

export default function MaterialPageClient({
  materialID,
  children,
}: MaterialPageClientProps) {
  // Hook manages all EventSource connections
  useSubmissionStatusListener(materialID);

  // Just render children
  return <>{children}</>;
}
