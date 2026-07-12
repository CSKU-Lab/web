"use client";

import { useTheme } from "next-themes";
import {
  ChevronDown,
  Monitor,
  Moon,
  PartyPopper,
  Sun,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { Switch } from "~/components/ui/switch";
import Label from "~/components/commons/Label";
import {
  useAppSettings,
  useSettingsDialog,
  type SettingsTab,
} from "~/globalStore/settings";

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
const INDENT_SIZES = [2, 4];

const THEMES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        {hint ? <p className="text-xs text-(--gray-10)">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function GeneralTab() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useAppSettings();
  const { ligatures } = settings.editor;

  const setEditor = (next: Partial<typeof settings.editor>) =>
    setSettings({ ...settings, editor: { ...settings.editor, ...next } });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  active
                    ? "border-(--gray-8) bg-(--gray-3) text-(--gray-12)"
                    : "border-(--gray-5) text-(--gray-11) hover:bg-(--gray-3) hover:text-(--gray-12)"
                }`}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <Row
        label="Font Ligatures"
        hint="Render combined glyphs for sequences like => and != across code blocks."
      >
        <Switch
          checked={ligatures}
          onCheckedChange={(v) => setEditor({ ligatures: v })}
        />
      </Row>
    </div>
  );
}

function EditorTab() {
  const [settings, setSettings] = useAppSettings();
  const { fontSize, vimMode, indentSize } = settings.editor;

  const setEditor = (next: Partial<typeof settings.editor>) =>
    setSettings({ ...settings, editor: { ...settings.editor, ...next } });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Select
          value={fontSize.toString()}
          onValueChange={(v) => setEditor({ fontSize: parseInt(v, 10) })}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select font size" />
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
      <div className="space-y-2">
        <Label>Indentation</Label>
        <Select
          value={indentSize.toString()}
          onValueChange={(v) => setEditor({ indentSize: parseInt(v, 10) })}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select indentation" />
            <ChevronDown size="1rem" className="text-(--gray-11)" />
          </SelectTrigger>
          <SelectContent>
            {INDENT_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} spaces
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Row label="Vim Mode" hint="Modal editing keybindings in the code editor.">
        <Switch
          checked={vimMode}
          onCheckedChange={(v) => setEditor({ vimMode: v })}
        />
      </Row>
    </div>
  );
}

function FunTab() {
  const [settings, setSettings] = useAppSettings();
  const { confetti, glitch, konami } = settings.easterEggs;

  const setEgg = (next: Partial<typeof settings.easterEggs>) =>
    setSettings({
      ...settings,
      easterEggs: { ...settings.easterEggs, ...next },
    });

  return (
    <div className="space-y-4">
      <Row
        label="Pass Confetti"
        hint="Celebrate with a confetti burst when you pass a material."
      >
        <Switch
          checked={confetti}
          onCheckedChange={(v) => setEgg({ confetti: v })}
        />
      </Row>
      <Row
        label="Fail Glitch"
        hint="Glitch the screen — RGB split, jitter, scanlines — when you fail a material."
      >
        <Switch
          checked={glitch}
          onCheckedChange={(v) => setEgg({ glitch: v })}
        />
      </Row>
      <Row
        label="Konami Code"
        hint="↑ ↑ ↓ ↓ ← → ← → B A — you know what to do."
      >
        <Switch
          checked={konami}
          onCheckedChange={(v) => setEgg({ konami: v })}
        />
      </Row>
      <p className="text-xs text-(--gray-10)">
        These effects respect your system&apos;s reduced-motion setting.
      </p>
    </div>
  );
}

function SettingsDialog() {
  const [dialog, setDialog] = useSettingsDialog();

  return (
    <Dialog
      open={dialog.open}
      onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
    >
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-4">
          <DialogTitle>
            <span className="flex items-center gap-2">
              <PartyPopper size="1.1rem" className="text-(--gray-11)" />
              Settings
            </span>
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={dialog.tab}
          onValueChange={(tab) =>
            setDialog((prev) => ({ ...prev, tab: tab as SettingsTab }))
          }
          className="p-4 gap-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="fun" className="flex-1">
              Fun
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
          <TabsContent value="editor">
            <EditorTab />
          </TabsContent>
          <TabsContent value="fun">
            <FunTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
