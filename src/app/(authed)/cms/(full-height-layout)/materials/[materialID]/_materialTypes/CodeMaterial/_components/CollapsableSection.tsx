import { ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "~/lib/tiptap-utils";

interface Props {
  name: string;
}

function CollapsableSection({ name }: Props) {
  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <div className="">
      <button
        onClick={() => setIsCollapse(!isCollapse)}
        className="flex w-full justify-between border-y p-4"
      >
        <div className="">
          <h4 className="text-xs text-(--gray-11)">{name}</h4>
        </div>
        <ChevronUp
          size="1rem"
          className={cn("text-(--gray-11)", isCollapse && "rotate-180")}
        />
      </button>
      <motion.div
        initial={{ height: isCollapse ? 0 : 200 }}
        animate={{ height: isCollapse ? 0 : 200 }}
      ></motion.div>
    </div>
  );
}

export default CollapsableSection;
