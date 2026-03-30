"use client";
import PageTitle from "~/components/commons/PageTitle";
import Input from "~/components/crafts/Input";
import MaterialTypeSelect from "./_components/MaterialTypeSelect";
import { Button } from "~/components/commons/Button";
import TagAutocomplete from "~/components/crafts/TagAutocomplete";
import VisibilityInput from "~/components/crafts/VisibilityInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateMaterialSchema,
  createMaterialSchema,
} from "./_schemas/create-material.schema";
import { useMutation } from "@tanstack/react-query";
import {
  cmsMaterialService,
  type CreateMaterialPayload,
} from "~/services/cms-material.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

function NewMaterialPage() {
  const form = useForm({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      tags: [],
      type: null,
      visibility: "public",
      manual_score: 0,
    },
  });

  const router = useRouter();
  const createMaterial = useMutation({
    mutationFn: (payload: CreateMaterialPayload) =>
      cmsMaterialService.create(payload),
    onSuccess: (materialId) => {
      toast.success("Material created successfully");
      router.push(`/cms/materials/${materialId}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error("Error", {
          description: err.response?.data.error || "Failed to create material",
        });
      }
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleCreateMaterial = async (data: CreateMaterialSchema) => {
    createMaterial.mutate({
      ...data,
      type: data.type!,
      tags: data.tags.map((tag) => tag.display),
      manual_score: data.manual_score ?? 0,
    });
  };

  return (
    <>
      <PageTitle>Create a material</PageTitle>

      <form
        onSubmit={form.handleSubmit(handleCreateMaterial)}
        className="p-4 space-y-4"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Detail</h5>
            <p className="text-sm text-(--gray-10)">
              Provide basic information about this material.
            </p>
            <hr />
          </div>
        </div>
        <Input
          label="Name"
          placeholder="(e.g.) For loop"
          {...form.register("name")}
        />
        <h4 className="mb-4 text-sm">
          Tags <span className="text-xs text-(--gray-11)">(optional)</span>
        </h4>
        <Controller
          control={form.control}
          name="tags"
          render={({ field: { value, onChange } }) => (
            <TagAutocomplete value={value} onChange={onChange} />
          )}
        />
        <h4 className="mb-4 text-sm">Type</h4>
        <Controller
          control={form.control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <MaterialTypeSelect value={value} onChange={onChange} />
          )}
        />

        <div className="space-y-2">
          <h4 className="text-sm">
            Manual Score{" "}
            <span className="text-xs text-(--gray-11)">(optional)</span>
          </h4>
          <p className="text-xs text-(--gray-10)">
            Maximum points available for manual grading
          </p>
          <input
            type="number"
            min="0"
            step="1"
            className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
            placeholder="0"
            {...form.register("manual_score", { valueAsNumber: true })}
          />
          {form.formState.errors.manual_score && (
            <p className="text-xs text-red-500">
              {form.formState.errors.manual_score.message}
            </p>
          )}
        </div>

        <div className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Visibility</h5>
            <p className="text-sm text-(--gray-10)">
              Choose who can see this material.
            </p>
            <hr />
          </div>
        </div>
        <Controller
          control={form.control}
          name="visibility"
          render={({ field: { value, onChange } }) => (
            <VisibilityInput
              value={value!}
              onChange={onChange}
              publicText="Everyone can see this material"
              privateText="Only you can see this material"
            />
          )}
        />

        <Button type="submit" className="mt-8" variant="action">
          Create
        </Button>
      </form>
    </>
  );
}

export default NewMaterialPage;
