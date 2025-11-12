import { FilePlus, FolderPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

function FileTree() {
  return (
    <div className="min-w-[240px] border-r">
      <div className="flex justify-between items-center mb-3 border-b p-2">
        <h6 className="text-xs">Files</h6>
        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-(--gray-11)">
                <FilePlus size="1rem" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add a file</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-(--gray-11)">
                <FolderPlus size="1rem" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add a folder</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="space-y-1.5 px-1">
        <button className="px-4 py-1 flex items-center gap-2 bg-(--gray-4) text-(--gray-12) font-medium rounded text-sm w-full">
          <img
            className="w-6 h-6"
            src="https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png"
            alt="test"
          />
          main.go
        </button>
      </div>
    </div>
  );
}

export default FileTree;
