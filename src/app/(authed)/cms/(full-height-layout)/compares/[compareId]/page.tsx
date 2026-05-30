"use client";

import { useParams } from "next/navigation";
import { CompareDetailView } from "~/features/cms/compares";

export default function CompareDetailPage() {
  const { compareId } = useParams<{ compareId: string }>();
  return <CompareDetailView compareId={compareId} />;
}
