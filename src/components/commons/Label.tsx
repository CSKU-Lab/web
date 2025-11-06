import { Label as ShadcnLabel } from "~/components/ui/label";
import type * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "~/lib/utils";

interface Props extends React.ComponentProps<typeof LabelPrimitive.Root> {
  isError?: boolean;
}

function Label({ className, isError, ...props }: Props) {
  return (
    <ShadcnLabel
      {...props}
      className={cn("font-normal",className, isError && "text-(--red-9)")}
    />
  );
}

export default Label;
