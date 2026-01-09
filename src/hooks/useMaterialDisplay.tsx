import { Keyboard, NotebookText, Terminal } from "lucide-react";
import { JSX } from "react";
import { MaterialType } from "~/types/cms-material";

export const useMaterialDisplay = () => {
  const visibilityStyleMap: Record<
    "public" | "private",
    { className: string; label?: string }
  > = {
    public: {
      className: "border-green-500 text-green-600 bg-green-50",
    },
    private: {
      className: "border-red-500 text-red-600 bg-red-50",
    },
  };

  const logoMap: Record<MaterialType, JSX.Element> = {
    [MaterialType.CODE]: <Terminal className="w-4 h-4" />,
    [MaterialType.DOCUMENT]: <NotebookText className="w-4 h-4" />,
    [MaterialType.TYPE]: <Keyboard className="w-4 h-4" />,
  };
  return { logoMap, visibilityStyleMap };
};
