import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Button } from "~/components/commons/Button";
import { ChevronDown, Settings } from "lucide-react";
import Label from "~/components/commons/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { Switch } from "~/components/ui/switch";
import type { IEditorSettings } from "./types/editor";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

interface Props {
  settings: IEditorSettings;
  onChange: (settings: IEditorSettings) => void;
}

const EditorSettings = ({ settings, onChange }: Props) => {
  const handleFontSizeChange = (value: string) => {
    const newFontSize = parseInt(value, 10);
    onChange({
      ...settings,
      fontSize: newFontSize,
    });
  };

  const handleVimModeChange = (value: boolean) => {
    onChange({
      ...settings,
      vimMode: value,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="size-6 p-0">
          <Settings size="1rem" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="p-4">
          <DialogTitle>Editor Settings</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={settings.fontSize.toString()}
              onValueChange={handleFontSizeChange}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select Font size" />
                <ChevronDown size="1rem" className="text-(--gray-11)" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Vim Mode</Label>
            <Switch
              checked={settings.vimMode}
              onCheckedChange={handleVimModeChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditorSettings;
