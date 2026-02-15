"use client";

import { Pencil } from "lucide-react";
import { Button } from "~/components/commons/Button";
import { useParams, useRouter } from "next/navigation";
import useResolvePath from "~/hooks/useResolvePath";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import useMaterialInfPagination from "../_hooks/useMaterialInfPagination";
import { Fragment } from "react";
import MaterialCard, {
  FallbackMaterialCard,
} from "../_components/MaterialCard";

export default function LabDetail() {
  const router = useRouter();
  const generatePath = useResolvePath();
  const { labID } = useParams();
  const handleOnAddMaterial = () =>
    router.push(
      generatePath(`/cms/courses/:courseID/labs/:labID/add-material`),
    );

  const {
    data: materialPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useMaterialInfPagination({
    labID: labID!.toString(),
    payload: {
      page_size: 5,
      sort_by: "created_at",
      sort_order: "desc",
      filters: [],
    },
  });

  const handleMaterialNavigate = (id: string) => {
    router.push(generatePath(`/cms/materials/${id}`));
  };

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <>
      <div className="@container px-4">
        <div className="flex justify-end items-center gap-2">
          <Button onClick={handleOnAddMaterial}>
            <Pencil size="1rem" /> Edit Lab Material
          </Button>
        </div>

        <div className="mt-10 space-y-8">
          <div>
            <h6 className="text-xs text-(--gray-10)">Lab - Materials</h6>
            <h4 className="text-xl font-semibold text-(--gray-12)">
              Materials
            </h4>
            <hr className="my-2" />

            <div>
              {materialPagination.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page.data.map(({ material_data }) => (
                    <MaterialCard
                      key={material_data.id}
                      id={material_data.id}
                      name={material_data.name}
                      tags={material_data.tags}
                      type={material_data.type}
                      visibility={material_data.visibility}
                      onClick={() => handleMaterialNavigate(material_data.id)}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
            {isFetching &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="flex flex-col gap-4 auto-rows-max mt-4">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <FallbackMaterialCard key={index} />
                    ))}
                  </div>
                </div>
              ))}
            <div ref={bottomDivRef} className="h-20"></div>
          </div>
        </div>
      </div>
    </>
  );
}
