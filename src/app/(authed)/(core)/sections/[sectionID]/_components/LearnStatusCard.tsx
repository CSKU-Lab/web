import Link from "~/components/commons/Link";
import { cn } from "~/lib/utils";
import type { LearnStatus } from "../../../types";
import StatusIcon from "../../../components/StatusIcon";

interface Props {
  title: string;
  status: LearnStatus;
  href: string;
}

function LearnStatusCard({ title, status, href }: Props) {
  const successCard = `border-(--grass-11) hover:border-(--grass-9) shadow-(--grass-11) hover:bg-(--grass-2) hover:shadow-(--grass-9)`;
  const inProgressCard = `border-(--amber-11) hover:border-(--amber-11/50) shadow-(--amber-11) hover:bg-(--amber-2) hover:shadow-(--amber-11)`;
  const failedCard = `border-(--tomato-11) hover:border-(--tomato-9) shadow-(--tomato-11) hover:bg-(--tomato-2) hover:shadow-(--tomato-9)`;
  const noneCard = `border-(--gray-11) hover:border-(--gray-9) shadow-(--gray-11) hover:bg-(--gray-2) hover:shadow-(--gray-9)`;

  const successText = "text-(--grass-11) group-hover:text-(--grass-11)/50";
  const failedText = "text-(--tomato-11) group-hover:text-(--tomato-11)/50";
  const inProgressText = "text-(--amber-11) group-hover:text-(--amber-11)/50";
  const noneText = "text-(--gray-11) group-hover:text-(--gray-11)/50";
  return (
    <Link
      href={href}
      className={cn(
        "col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 border-2 p-4 rounded-lg h-[160px] flex flex-col justify-end shadow-[0_8px_0_0]  group hover:shadow-[0_4px_0_0]  transition-all",
        status === "PASSED" && successCard,
        status === "FAILED" && failedCard,
        status === "IN_PROGRESS" && inProgressCard,
        status === "NONE" && noneCard,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="text-(--grass-11) group-hover:text-(--grass-9)">
          <h5
            className={cn(
              "text-2xl font-medium",
              status === "PASSED" && successText,
              status === "FAILED" && failedText,
              status === "IN_PROGRESS" && inProgressText,
              status === "NONE" && noneText,
            )}
          >
            {title}
          </h5>
        </div>
        <StatusIcon {...{ status }} size="2rem" />
      </div>
    </Link>
  );
}

export default LearnStatusCard;
