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
        "bg-white shadow-none h-9 focus-visible:ring-0 placeholder:text-(--gray-9) text-(--gray-12) border-(--gray-6)",
        isError &&
          "border-red-500 focus:border-red-500 focus-visible:border-red-500",
        props.className,
      )}
    />
  );
}

export default Input;
