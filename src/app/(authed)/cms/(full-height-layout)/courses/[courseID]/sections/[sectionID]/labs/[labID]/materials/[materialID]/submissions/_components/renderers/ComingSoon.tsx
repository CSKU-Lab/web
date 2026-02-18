import { Construction } from "lucide-react";

interface ComingSoonProps {
  type: string;
}

function ComingSoon({ type }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-(--gray-11)">
      <Construction size="3rem" className="mb-3 opacity-50" />
      <p className="text-sm font-medium">Coming Soon</p>
      <p className="text-xs mt-1">
        Submission view for <span className="capitalize">{type}</span> materials
        is not yet available.
      </p>
    </div>
  );
}

export default ComingSoon;
