import { cn } from "~/lib/utils";
import type { ChildrenProps } from "~/types/children-props";
interface Props extends ChildrenProps {
  isActive?: boolean;
  onClick?: () => void;
}

const IOButton = ({ children, isActive, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-b p-2 flex-1 border-r text-(--gray-11) hover:bg-(--gray-2)",
        isActive && "text-(--gray-1) bg-(--gray-12) hover:bg-(--gray-12)/90",
      )}
    >
      <h4 className="text-xs">{children}</h4>
    </button>
  );
};

export default IOButton;
