"use client";

import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { typingTextAtom, saveStatusAtom } from "~/features/cms/materials/types/TypingMaterial/stores/typing-text.store";
import { isOwnerAtom } from "~/features/cms/materials/types/TypingMaterial/stores/owner.store";

export default function TextEditor() {
  const [text, setText] = useAtom(typingTextAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setSaveStatus("UnSaved");
  }

  return (
    <div className="flex flex-col h-full bg-(--gray-1)">
      <div className="flex items-center justify-between px-4 py-2 border-b border-(--gray-4) text-xs text-(--gray-10)">
        <span>Source Text</span>
        <span>
          {wordCount} words · {charCount} chars
        </span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 overflow-y-auto">
        <textarea
          ref={textareaRef}
          className="w-full max-w-3xl resize-none bg-transparent text-(--gray-12) font-mono text-2xl leading-relaxed tracking-wide focus:outline-none placeholder:text-(--gray-8) overflow-hidden"
          placeholder={
            isOwner
              ? "Start typing here..."
              : "No text set for this material."
          }
          value={text}
          onChange={handleChange}
          readOnly={!isOwner}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
