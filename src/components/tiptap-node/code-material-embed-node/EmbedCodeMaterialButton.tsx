"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentEditor } from "@tiptap/react";
import { Code2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/tiptap-ui-primitive/button";
import { cmsMaterialService } from "~/services/cms-material.service";
import type { CMSMaterial } from "~/types/cms-material";

interface Props {
  courseID: string;
}

export function EmbedCodeMaterialButton({ courseID }: Props) {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["cms-code-materials", courseID],
    queryFn: () =>
      cmsMaterialService.getPagination(courseID, {
        page: 1,
        page_size: 100,
        filters: [
          {
            field: { display: "Type", value: "type" },
            operator: "is",
            value: "code",
            status: "newly-created",
          },
        ],
      }),
    enabled: open,
  });

  const embeddedIDs = useMemo(() => {
    if (!editor) return new Set<string>();
    const ids = new Set<string>();
    editor.state.doc.descendants((node) => {
      if (node.type.name === "codeMaterialEmbed" && node.attrs.materialID) {
        ids.add(node.attrs.materialID as string);
      }
    });
    return ids;
  }, [editor?.state]);

  const filtered = useMemo(() => {
    const items = data?.data ?? [];
    if (!search.trim()) return items;
    const lower = search.toLowerCase();
    return items.filter((m) => m.name.toLowerCase().includes(lower));
  }, [data, search]);

  const handleEmbed = (material: CMSMaterial) => {
    if (!editor) return;
    editor.commands.insertCodeMaterialEmbed({
      materialID: material.id,
      title: material.name,
      autoScore: material.auto_score,
    });
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <Button
        data-style="ghost"
        onClick={() => setOpen(true)}
        title="Embed Code Problem"
        type="button"
      >
        <Code2 className="tiptap-button-icon" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Embed Code Problem</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search
              size="0.875rem"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--gray-9)"
            />
            <Input
              className="pl-8"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1">
            {isLoading && (
              <p className="text-sm text-(--gray-10) py-4 text-center">
                Loading...
              </p>
            )}
            {!isLoading && filtered.length === 0 && (
              <p className="text-sm text-(--gray-10) py-4 text-center">
                No code problems found.
              </p>
            )}
            {filtered.map((material) => {
              const isEmbedded = embeddedIDs.has(material.id);
              return (
                <button
                  key={material.id}
                  type="button"
                  disabled={isEmbedded}
                  onClick={() => handleEmbed(material)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-left hover:bg-(--gray-3) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm text-(--gray-12) truncate">
                    {material.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-(--gray-10)">
                      {material.auto_score} pts
                    </span>
                    {isEmbedded && (
                      <span className="text-xs text-(--gray-9)">
                        (embedded)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
