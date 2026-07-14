"use client";

import { useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { FormInput } from "lucide-react";
import { Button } from "~/components/tiptap-ui-primitive/button";
import { InputEmbedDialog } from "~/components/tiptap-node/input-embed-node/InputEmbedDialog";

interface Props {
  courseID: string;
}

// `courseID` is unused but kept to match EmbedCodeMaterialButton's signature
// (both are rendered the same way under the courseID guard in simple-editor).
export function InsertInputEmbedButton(_props: Props) {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        data-style="ghost"
        onClick={() => setOpen(true)}
        title="Insert Input Field"
        type="button"
      >
        <FormInput className="tiptap-button-icon" />
      </Button>

      <InputEmbedDialog
        open={open}
        onOpenChange={setOpen}
        title="Insert Input Field"
        submitLabel="Insert"
        onSubmit={(values) => {
          if (!editor) return;
          editor.commands.insertInputEmbed({
            nodeID: crypto.randomUUID(),
            ...values,
          });
        }}
      />
    </>
  );
}
