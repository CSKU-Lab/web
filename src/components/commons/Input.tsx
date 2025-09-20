import { cn } from "~/lib/utils";
import { Input as ShadcnInput } from "../ui/input";

interface Props extends React.ComponentProps<"input"> {
  isError?: boolean;
}
function Input({ isError = false, ...props }: Props) {
  return (
    <ShadcnInput
      {...props}
      className={cn(
        "bg-(--gray-2) shadow-none h-10 focus-visible:ring-0 placeholder:text-(--gray-9)",
        isError && "border-red-500 focus:border-red-500 focus-visible:border-red-500",
        props.className,
      )}
    />
  );
}

export default Input;
