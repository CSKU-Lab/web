"use client";

import { useParams } from "next/navigation";
import { RunnerDetailView } from "~/features/cms/runners";

export default function RunnerDetailPage() {
  const { runnerId } = useParams<{ runnerId: string }>();
  return <RunnerDetailView runnerId={runnerId} />;
}
