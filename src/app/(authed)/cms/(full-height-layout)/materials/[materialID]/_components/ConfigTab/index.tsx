import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type ConfigSchema, configSchema } from "./_schemas/config.schema";
import Input from "~/components/crafts/Input";
import Label from "~/components/commons/Label";
import { Switch } from "~/components/ui/switch";
import AllowedRunners from "./AllowedRunners";
import CompareScript from "./CompareScript";

function ConfigTab() {
  const form = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: {
      cpuTime: -1,
      cpuExtraTime: -1,
      wallTime: -1,
      memory: -1,
      stack: -1,
      maxOpenFiles: -1,
      maxFileSize: -1,
      allowNetwork: false,
    },
  });

  const handleSubmit = (data: ConfigSchema) => {};

  return (
    <form className="p-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <h5 className="my-2 font-medium">General</h5>
      <h6 className="my-2 text-sm">Allowed Runner</h6>
      <Controller
        name="allowedRunners"
        control={form.control}
        render={({ field }) => (
          <AllowedRunners value={field.value} onChange={field.onChange} />
        )}
      />
      <h6 className="my-2 text-sm">Compare Script</h6>
      <Controller
        name="compareScript"
        control={form.control}
        render={({ field }) => (
          <CompareScript value={field.value} onChange={field.onChange} />
        )}
      />
      <div className="h-1 border-b my-4"></div>
      <h5 className="my-2 font-medium">Limits</h5>
      <div className="space-y-2">
        <Input
          label="CPU Time"
          {...form.register("cpuTime")}
          isError={!!form.formState.errors.cpuTime}
        />
        <Input
          label="CPU Extra Time"
          {...form.register("cpuExtraTime")}
          isError={!!form.formState.errors.cpuExtraTime}
        />
        <Input
          label="Wall Time"
          {...form.register("wallTime")}
          isError={!!form.formState.errors.wallTime}
        />
        <Input
          label="Memory"
          {...form.register("memory")}
          isError={!!form.formState.errors.memory}
        />
        <Input
          label="Stack"
          {...form.register("stack")}
          isError={!!form.formState.errors.stack}
        />
        <Input
          label="Max Open Files"
          {...form.register("maxOpenFiles")}
          isError={!!form.formState.errors.maxOpenFiles}
        />
        <Input
          label="Max File Sizes"
          {...form.register("maxFileSize")}
          isError={!!form.formState.errors.maxFileSize}
        />
        <div className="space-y-2">
          <Label>Allow Network</Label>
          <Switch {...form.register("allowNetwork")} />
        </div>
      </div>
      <button type="submit">save</button>
    </form>
  );
}

export default ConfigTab;
