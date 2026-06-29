"use client";

import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";
import { useReleaseNote } from "../hooks/useReleaseNote";

function ReleaseNoteDialog() {
  const { open, notes, dismiss } = useReleaseNote();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>What&apos;s New</DialogTitle>
          <DialogDescription>
            Here&apos;s what changed since you were last here.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-6 p-4">
          {notes.map((note) => (
            <section key={note.version} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">v{note.version}</span>
                <span className="text-xs text-(--gray-11)">{note.date}</span>
              </div>

              <ul className="flex flex-col gap-3">
                {note.highlights.map((highlight) => (
                  <li key={highlight.title} className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {highlight.title}
                    </span>
                    <span className="text-sm text-(--gray-11)">
                      {highlight.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </DialogBody>

        <DialogFooter>
          <Button variant="primary" onClick={dismiss}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReleaseNoteDialog;
