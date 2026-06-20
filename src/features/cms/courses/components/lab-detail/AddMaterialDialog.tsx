"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Check, Globe, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "~/components/ui/sheet";
import useInputDebounce from "~/hooks/useInputDebounce";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import type { CMSMaterial } from "~/types/cms-material";
import type { CMSLabMaterial } from "~/types/cms-lab-material";
import { cmsMaterialService } from "~/services/cms-material.service";
import { cmsLabMaterialService } from "~/services/cms-lab-material.service";
import { queryKeys } from "~/queryKeys";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import { cn } from "~/lib/utils";

type MaterialTypeFilter = "all" | "document" | "code" | "typing";

interface AddMaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseID: string;
  labID: string;
  labMaterials: CMSLabMaterial[];
}

function MaterialSelectCard({
  material,
  isSelected,
  onToggle,
}: {
  material: CMSMaterial;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  const { logoMap } = useMaterialDisplay();

  return (
    <button
      type="button"
      onClick={() => onToggle(material.id)}
      className={cn(
        "w-full text-left rounded-md border transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-(--gray-4) bg-(--gray-1) hover:bg-(--gray-2) hover:border-(--gray-5)",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* selection indicator */}
        <div
          className={cn(
            "mt-0.5 shrink-0 flex items-center justify-center w-4 h-4 rounded border transition-colors duration-150",
            isSelected ? "border-primary bg-primary" : "border-(--gray-6) bg-(--gray-1)",
          )}
        >
          {isSelected && <Check size={10} className="text-white" />}
        </div>

        {/* type icon */}
        <span className="mt-0.5 shrink-0 text-(--gray-9)">{logoMap[material.type]}</span>

        {/* name + creator + tags */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-(--gray-12) truncate">{material.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <UserProfileImage
              src={material.created_by?.profile_image}
              username={material.created_by?.display_name ?? "?"}
              size="1rem"
              textSize="0.5rem"
            />
            <span className="text-xs text-(--gray-9) truncate max-w-[120px]">
              {material.created_by?.display_name}
            </span>
          </div>
          {(material.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {material.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* right: visibility icon + type badge */}
        <div className="shrink-0 flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-xs capitalize">{material.type}</Badge>
          {material.visibility === "public" ? (
            <Globe size={14} className="text-green-600" />
          ) : (
            <Lock size={14} className="text-(--gray-9)" />
          )}
        </div>
      </div>
    </button>
  );
}

function AddMaterialDialog({
  isOpen,
  onClose,
  courseID,
  labID,
  labMaterials,
}: AddMaterialDialogProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MaterialTypeFilter>("all");
  const [selectedIDs, setSelectedIDs] = useState<Set<string>>(new Set());
  const debouncedSearch = useInputDebounce(search, 500);
  const queryClient = useQueryClient();

  const existingMaterialIds = useMemo(
    () => new Set(labMaterials.map((lm) => lm.material_id)),
    [labMaterials],
  );

  const typeFilters = useMemo(
    () =>
      typeFilter !== "all"
        ? [
            {
              field: { display: "Type", value: "type" },
              operator: "is" as const,
              value: typeFilter,
              status: "newly-created" as const,
            },
          ]
        : [],
    [typeFilter],
  );

  const {
    data: pages,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfinitePagination<CMSMaterial>({
    queryKey: [
      ...queryKeys.material.allWithParams(courseID, {
        search: debouncedSearch,
        type: typeFilter !== "all" ? typeFilter : undefined,
      }),
      "sheet",
    ],
    queryFn: ({ pageParam }) =>
      cmsMaterialService.getPagination(courseID, {
        page: pageParam,
        page_size: 20,
        search: debouncedSearch,
        sort_by: "created_at",
        sort_order: "desc",
        filters: typeFilters,
      }),
  });

  const allMaterials = useMemo(
    () =>
      pages.pages
        .flatMap((p) => p.data)
        .filter((m) => !existingMaterialIds.has(m.id)),
    [pages, existingMaterialIds],
  );

  const bottomRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage && !isFetching,
  });

  const addMaterials = useMutation({
    mutationFn: () => {
      if (selectedIDs.size === 0) throw new Error("No materials selected");
      return Promise.all(
        Array.from(selectedIDs).map((materialID) =>
          cmsLabMaterialService.create(labID, { materialID }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Materials added");
      queryClient.invalidateQueries({ queryKey: queryKeys.labMaterial.getByLabId(labID) });
      handleClose();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to add materials",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleToggle = useCallback((materialID: string) => {
    setSelectedIDs((prev) => {
      const next = new Set(prev);
      if (next.has(materialID)) next.delete(materialID);
      else next.add(materialID);
      return next;
    });
  }, []);

  const handleClose = () => {
    onClose();
    setSelectedIDs(new Set());
    setSearch("");
    setTypeFilter("all");
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="sm:max-w-lg w-full flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Add Materials to Lab</SheetTitle>
        </SheetHeader>

        <div className="px-6 py-3 border-b flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or tag..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(val) => setTypeFilter(val as MaterialTypeFilter)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="typing">Typing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isError ? (
            <p className="text-sm text-destructive text-center py-8">Failed to load materials.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {allMaterials.map((material) => (
                <MaterialSelectCard
                  key={material.id}
                  material={material}
                  isSelected={selectedIDs.has(material.id)}
                  onToggle={handleToggle}
                />
              ))}
              {isFetching &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              {!isFetching && allMaterials.length === 0 && (
                <p className="text-sm text-(--gray-9) text-center py-8">No materials found.</p>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        <SheetFooter className="px-6 py-4 border-t flex-row justify-end gap-2">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="action"
            onClick={() => addMaterials.mutate()}
            disabled={selectedIDs.size === 0 || addMaterials.isPending}
            isLoading={addMaterials.isPending}
          >
            Add {selectedIDs.size > 0 ? `(${selectedIDs.size})` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddMaterialDialog;
