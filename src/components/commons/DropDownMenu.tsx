import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <ShadcnDropdownMenuContent
      {...props}
      className={cn(className, "bg-white text-(--gray-11)")}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <ShadcnDropdownMenuCheckboxItem
      {...props}
      className={cn(className, "text-xs")}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuShortcut,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
};
