import {
  PopoverTrigger,
  Popover,
  PopoverContent as ShadcnPopoverContent,
  PopoverAnchor,
} from "~/components/ui/popover";
import type * as PopoverPrimitive from "@radix-ui/react-popover";

const PopoverContent = ({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
  return <ShadcnPopoverContent {...props} className={className} />;
};

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
