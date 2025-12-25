import { type Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import useResolvePath from "~/hooks/useResolvePath";
import { cmsLabMaterialService } from "~/services/cms-lab-material.service";
import { type CMSLabMaterial } from "~/types/cms-lab-material";
import { type CMSMaterial } from "~/types/cms-material";

interface SaveMaterialsProps {
  labMaterials: CMSLabMaterial[] | undefined;
  table: Table<CMSMaterial>;
  rowSelection: Record<string, boolean>;
  labID: string;
}

export const useSaveLabMaterials = ({
  labMaterials,
  table,
  rowSelection,
  labID,
}: SaveMaterialsProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();

  const initialMaterialIdSet = useMemo(() => {
    if (!labMaterials) return new Set<string>();
    return new Set(labMaterials.map((m) => String(m.material_id)));
  }, [labMaterials]);

  const currentSelectedIdSet = useMemo(() => {
    return new Set(
      table.getSelectedRowModel().rows.map((row) => String(row.original.id)),
    );
  }, [table, rowSelection]);

  const handleSaveLabMaterials = async () => {
    const toCreate: string[] = [];
    const toDelete: string[] = [];

    currentSelectedIdSet.forEach((id) => {
      if (!initialMaterialIdSet.has(id)) {
        toCreate.push(id);
      }
    });

    initialMaterialIdSet.forEach((id) => {
      if (!currentSelectedIdSet.has(id)) {
        toDelete.push(id);
      }
    });

    if (toCreate.length === 0 && toDelete.length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      await Promise.all([
        ...toCreate.map((materialID) =>
          cmsLabMaterialService.create(labID, { materialID }),
        ),
        ...toDelete.map((materialID) =>
          cmsLabMaterialService.delete(labID, { materialID }),
        ),
      ]);

      toast.success("Lab materials updated");
      router.push(generatePath(`/cms/courses/:courseID/labs/:labID`));
    } catch (err) {
      toast.error("Failed to update lab materials");
    }
  };
  return { handleSaveLabMaterials };
};
