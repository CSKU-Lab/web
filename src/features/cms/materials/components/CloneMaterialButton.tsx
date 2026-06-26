"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Copy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import { cmsMaterialService } from "~/services/cms-material.service";

export default function CloneMaterialButton() {
  const router = useRouter();
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();

  const clone = useMutation({
    mutationFn: () => cmsMaterialService.clone(courseID, materialID),
    onSuccess: (clonedMaterialID) => {
      toast.success("Material cloned");
      router.push(`/cms/courses/${courseID}/materials/${clonedMaterialID}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description: err.response?.data.error || "Failed to clone material",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <Button disabled={clone.isPending} onClick={() => clone.mutate()}>
      <Copy size="1rem" />
      {clone.isPending ? "Cloning..." : "Clone"}
    </Button>
  );
}
