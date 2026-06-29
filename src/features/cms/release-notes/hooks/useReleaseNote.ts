import { useCallback, useEffect, useState } from "react";
import { version as currentVersion } from "../../../../../package.json";
import { releaseNotes, type ReleaseNote } from "../data";
import { compareVersion } from "../utils/compare-version";

const STORAGE_KEY = "cms:last-seen-release-version";

/**
 * Shows curated CMS release notes the first time a user loads the app after
 * an upgrade. Brand-new users (no stored version) are seeded silently so they
 * don't see notes for a version they never used.
 */
export function useReleaseNote() {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);

  const persistSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentVersion);
    } catch {}
  }, []);

  // Decide on mount only. Reading localStorage in an effect (rather than a lazy
  // useState initializer) is intentional: the dialog must start closed on the
  // server and open only after the client mounts, otherwise SSR/hydration
  // would mismatch.
  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY);

    // First-ever visit: seed silently, no modal.
    if (lastSeen === null) {
      persistSeen();
      return;
    }

    // Already up to date.
    if (compareVersion(currentVersion, lastSeen) <= 0) return;

    const unseen = releaseNotes.filter(
      (note) => compareVersion(note.version, lastSeen) > 0,
    );

    if (unseen.length === 0) {
      // Upgraded but nothing curated to show — keep storage current.
      persistSeen();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- open on mount based on persisted version; see comment above
    setNotes(unseen);
  }, [persistSeen]);

  const dismiss = useCallback(() => {
    setNotes([]);
    persistSeen();
  }, [persistSeen]);

  return { open: notes.length > 0, notes, dismiss };
}
