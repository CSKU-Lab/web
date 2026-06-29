import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import useLabMaterials from "~/features/core/sections/hooks/useLabMaterials";
import type { LabMaterial } from "~/types/core-lab-material";

interface Sibling {
  slug: string;
  title: string;
}

/**
 * Resolves the previous/next material (ordered by `position`) relative to the
 * material currently open in the route. Pulls every page so navigation works
 * across pagination boundaries.
 */
function useMaterialSiblings() {
  const {
    sectionID,
    slug: labID,
    materialID,
  } = useParams<{ sectionID: string; slug: string; materialID: string }>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLabMaterials(labID, sectionID, Boolean(labID && sectionID));

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const materials = useMemo<LabMaterial[]>(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const toSibling = (material: LabMaterial): Sibling => ({
    slug: `/sections/${sectionID}/labs/${labID}/materials/${material.id}`,
    title: material.name,
  });

  const currentIndex = materials.findIndex((m) => m.id === materialID);

  const prevMaterial =
    currentIndex > 0 ? toSibling(materials[currentIndex - 1]) : undefined;
  const nextMaterial =
    currentIndex >= 0 && currentIndex < materials.length - 1
      ? toSibling(materials[currentIndex + 1])
      : undefined;

  return { prevMaterial, nextMaterial };
}

export default useMaterialSiblings;
