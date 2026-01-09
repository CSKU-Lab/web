import { CloudUpload, SaveIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import CopyButton from "./CopyButton";
import ResetButton from "./ResetButton";
import SettingButton from "./SettingButton";

function CodeHeader() {
  return (
    <div className="p-2 bg-white border-b border-(--gray-6) flex flex-wrap gap-4 justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="flex items-center text-(--gray-9) space-x-2">
          <SaveIcon size="1rem" />
          <h6 className="text-xs">Saved to local</h6>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1">
          <CopyButton />
          <ResetButton />
          <SettingButton />
        </div>
        <div className="space-x-2 flex flex-1">
          <Button
            className="space-x-2 bg-(--grass-9) hover:bg-(--grass-10) flex-1"
            variant="default"
            size="sm"
          >
            <CloudUpload size="1rem" />
            <h6>Submit</h6>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CodeHeader;
