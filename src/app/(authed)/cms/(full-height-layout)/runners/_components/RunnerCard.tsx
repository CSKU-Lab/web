import Link from "next/link";
import { Terminal } from "lucide-react";
import type { RunnerListItem } from "~/types/cms-runner";

interface RunnerCardProps {
  runner: RunnerListItem;
}

function RunnerCard({ runner }: RunnerCardProps) {
  const { id, name, description } = runner;

  return (
    <Link
      href={`/cms/runners/${id}`}
      className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) transition-colors"
    >
      <div className="bg-linear-to-bl from-emerald-600 to-emerald-400 h-5" />
      <div className="p-4 space-y-3 flex-1">
        <div>
          <h6 className="text-xs text-(--gray-9) leading-tight">Name</h6>
          <div className="flex items-center gap-2 mt-1">
            <Terminal size="1rem" className="text-(--gray-11)" />
            <h3 className="text-lg font-medium line-clamp-1">{name}</h3>
          </div>
        </div>
        {description && (
          <div>
            <h6 className="text-xs text-(--gray-9) leading-tight">
              Description
            </h6>
            <p className="text-sm text-(--gray-11) line-clamp-2 mt-1">
              {description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default RunnerCard;
