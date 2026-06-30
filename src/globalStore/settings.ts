import { atom, createStore, useAtom, useAtomValue, useSetAtom } from "jotai";
import type { IEditorSettings } from "~/components/Editor/types/editor";

/**
 * Global, persisted application settings.
 *
 * Single source of truth for editor preferences (font size, vim mode),
 * and easter-egg toggles. Theme is intentionally left to next-themes and
 * not duplicated here.
 *
 * Stored under `cs-lab-settings`. Migrates the legacy `editor-settings`
 * key on first load so existing users keep their editor preferences.
 */

export interface EasterEggSettings {
  /** Celebratory confetti when a student passes a material. */
  confetti: boolean;
  /** Hidden Konami code (↑↑↓↓←→←→ B A) confetti storm. */
  konami: boolean;
}

export interface AppSettings {
  editor: IEditorSettings;
  easterEggs: EasterEggSettings;
}

export const SETTINGS_KEY = "cs-lab-settings";
const LEGACY_EDITOR_KEY = "editor-settings";

export const DEFAULT_SETTINGS: AppSettings = {
  editor: { fontSize: 14, vimMode: false, ligatures: false },
  // Default-on so behaviour is unchanged for existing users.
  easterEggs: { confetti: true, konami: true },
};

function loadInitial(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return {
        editor: { ...DEFAULT_SETTINGS.editor, ...parsed.editor },
        easterEggs: { ...DEFAULT_SETTINGS.easterEggs, ...parsed.easterEggs },
      };
    }
    // Migrate legacy per-editor settings, then let it be removed on next write.
    const legacy = localStorage.getItem(LEGACY_EDITOR_KEY);
    if (legacy) {
      const editor = JSON.parse(legacy) as Partial<IEditorSettings>;
      return {
        ...DEFAULT_SETTINGS,
        editor: { ...DEFAULT_SETTINGS.editor, ...editor },
      };
    }
  } catch {
    // fall through to defaults on any parse/storage error
  }
  return DEFAULT_SETTINGS;
}

/**
 * Dedicated singleton store. Settings are global, but the app mounts several
 * nested `<JotaiProvider>`s (authed layout, materials layout) that each create
 * an isolated default store. Binding every settings hook to this one explicit
 * store makes the value identical everywhere, regardless of provider nesting.
 */
export const settingsStore = createStore();

const baseSettingsAtom = atom<AppSettings>(loadInitial());

/** Read/write the whole settings object; persists to localStorage on write. */
export const settingsAtom = atom(
  (get) => get(baseSettingsAtom),
  (
    get,
    set,
    update: AppSettings | ((prev: AppSettings) => AppSettings),
  ) => {
    const next =
      typeof update === "function" ? update(get(baseSettingsAtom)) : update;
    set(baseSettingsAtom, next);
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      localStorage.removeItem(LEGACY_EDITOR_KEY);
    }
  },
);

export type SettingsTab = "general" | "editor" | "fun";

export const settingsDialogAtom = atom<{ open: boolean; tab: SettingsTab }>({
  open: false,
  tab: "general",
});

/** Write-only helper: open the settings dialog, optionally on a given tab. */
export const openSettingsAtom = atom(null, (_get, set, tab?: SettingsTab) =>
  set(settingsDialogAtom, { open: true, tab: tab ?? "general" }),
);

export function useAppSettings() {
  return useAtom(settingsAtom, { store: settingsStore });
}

export function useSettingsValue() {
  return useAtomValue(settingsAtom, { store: settingsStore });
}

export function useSettingsDialog() {
  return useAtom(settingsDialogAtom, { store: settingsStore });
}

export function useOpenSettings() {
  return useSetAtom(openSettingsAtom, { store: settingsStore });
}

/**
 * Editor-slice view of the global settings, shaped like the old
 * `useState<IEditorSettings>` API so editor components swap in cleanly.
 */
export function useEditorSettings(): [
  IEditorSettings,
  (next: IEditorSettings) => void,
] {
  const [settings, setSettings] = useAtom(settingsAtom, {
    store: settingsStore,
  });
  const setEditor = (editor: IEditorSettings) =>
    setSettings({ ...settings, editor });
  return [settings.editor, setEditor];
}
