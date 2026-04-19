"use client";

import { useAtom, useAtomValue } from "jotai";
import { typingTextAtom, saveStatusAtom } from "../_stores/typing-text.store";
import { isOwnerAtom } from "../_stores/owner.store";

export default function TextEditor() {
  const [text, setText] = useAtom(typingTextAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setSaveStatus("UnSaved");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-(--gray-4) text-xs text-(--gray-10)">
        <span>Source Text</span>
        <span>
          {wordCount} words · {charCount} chars
        </span>
      </div>
      <textarea
        className="flex-1 w-full resize-none bg-(--gray-1) text-(--gray-12) p-4 font-mono text-sm focus:outline-none placeholder:text-(--gray-9)"
        placeholder={
          isOwner
            ? "Enter the text that students will type..."
            : "No text set for this material."
        }
        value={text}
        onChange={handleChange}
        readOnly={!isOwner}
        spellCheck={false}
      />
    </div>
  );
}
