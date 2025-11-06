import { useMutation } from "@tanstack/react-query";
import { cmsMaterialService } from "~/services/cms-material.service";

function useCreateMaterial() {
  return useMutation({
    mutationFn: cmsMaterialService.create,
  });
}

export default useCreateMaterial;
