import type { JSX } from "react";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface Props {
  label: string;
  value: string | number | undefined | JSX.Element;
  isLoading?: boolean;
}

function HeaderItem({ label, value, isLoading = false }: Props) {
  const longText = typeof value === "string" && value.length > 30;

  const renderBody = () => {
    if (typeof value === "string") {
      if (longText) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{value}</h4>
              </div>
            </TooltipTrigger>
            <TooltipContent>{value}</TooltipContent>
          </Tooltip>
        );
      } else {
        return <h4 className="font-medium">{value}</h4>;
      }
    }
    if (typeof value === "number") {
      return (
        <h4 className="font-medium">
          {Intl.NumberFormat("en-Us", {
            compactDisplay: "short",
            notation: "compact",
            maximumSignificantDigits: 3,
          }).format(1230)}
        </h4>
      );
    }
    return value;
  };
  return (
    <div className="max-w-64 shrink-0">
      <h6 className="text-xs text-(--gray-11)">{label}</h6>
      <Loading
        isLoading={isLoading}
        fallback={<Skeleton className="w-32 h-6" />}
      >
        {renderBody()}
      </Loading>
    </div>
  );
}

export default HeaderItem;
