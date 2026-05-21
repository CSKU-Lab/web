"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, ServerCrash } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "~/components/commons/Button";
import useResolvePath from "~/hooks/useResolvePath";
import useGetLabMaterial from "../_hooks/useGetLabMaterial";
import SortableLabMaterialRow from "../_components/SortableLabMaterialRow";
import AddMaterialDialog from "../_components/AddMaterialDialog";
import { cmsLabMaterialService } from "~/services/cms-lab-material.service";
import { queryKeys } from "~/queryKeys";
import type { CMSLabMaterial } from "~/types/cms-lab-material";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { Skeleton } from "~/components/ui/skeleton";

export default function LabDetail() {
  const router = useRouter();
  const generatePath = useResolvePath();
  const { courseID, labID } = useParams<{ courseID: string; labID: string }>();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [rows, setRows] = useState<CMSLabMaterial[]>([]);
  const previousRowsRef = useRef<CMSLabMaterial[]>([]);

  const {
    data: labMaterials,
    isFetching,
    isError,
    refetch,
  } = useGetLabMaterial({ labID });

  useEffect(() => {
    if (labMaterials) {
      setRows(labMaterials);
    }
  }, [labMaterials]);

  const sortableIds = useMemo(() => rows.map((r) => r.material_id), [rows]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updatePosition = useMutation({
    mutationFn: async ({
      materialID,
      position,
    }: {
      materialID: string;
      position: number;
    }) => cmsLabMaterialService.updatePosition(labID, materialID, position),
    onError: (err) => {
      setRows(previousRowsRef.current);
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to update order",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const deleteMaterial = useMutation({
    mutationFn: (materialID: string) =>
      cmsLabMaterialService.delete(labID, { materialID }),
    onSuccess: () => {
      toast.success("Material removed");
      queryClient.invalidateQueries({
        queryKey: queryKeys.labMaterial.getByLabId(labID),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to remove material",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (updatePosition.isPending) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.material_id === active.id);
    const newIndex = rows.findIndex((r) => r.material_id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    previousRowsRef.current = rows;

    const reordered = arrayMove(rows, oldIndex, newIndex);
    const updated = reordered.map((row, i) => ({ ...row, position: i + 1 }));
    setRows(updated);

    updatePosition.mutate({
      materialID: active.id as string,
      position: newIndex + 1,
    });
  };

  const handleNavigate = (materialID: string) => {
    router.push(generatePath(`/cms/courses/:courseID/materials/${materialID}`));
  };

  const isNoData = rows.length === 0 && !isFetching;

  return (
    <div className="@container px-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size="1rem" /> Add Material
        </Button>
      </div>

      <div className="mt-6">
          <Error
            isError={isError && !isFetching}
            fallback={
              <ErrorFallback
                icon={<ServerCrash size="2rem" />}
                onRetry={refetch}
                title="Cannot get materials"
                message="There was an error loading materials. Please try again."
              />
            }
          >
            {isFetching && rows.length === 0 ? (
              <div className="flex flex-col gap-2 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : isNoData ? (
              <NoDataAvailable />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortableIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2 mt-4">
                    {rows.map((labMaterial) => (
                      <SortableLabMaterialRow
                        key={labMaterial.material_id}
                        labMaterial={labMaterial}
                        onNavigate={handleNavigate}
                        onDelete={(materialID) =>
                          deleteMaterial.mutate(materialID)
                        }
                        isDeleting={deleteMaterial.isPending}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </Error>
      </div>

      <AddMaterialDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        courseID={courseID}
        labID={labID}
        labMaterials={rows}
      />
    </div>
  );
}
