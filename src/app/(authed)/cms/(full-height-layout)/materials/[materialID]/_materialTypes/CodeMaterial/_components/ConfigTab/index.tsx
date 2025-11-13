import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { configSchema } from "./_schemas/config.schema";
import Input from "~/components/crafts/Input";
import Label from "~/components/commons/Label";
import { Switch } from "~/components/ui/switch";
import AllowedRunners from "./AllowedRunners";
import CompareScript from "./CompareScript";
import { useAtom } from "jotai";
import {
  allowedRunnersAtom,
  compareScriptAtom,
} from "../../_stores/config.store";
import { Construction } from "lucide-react";

function ConfigTab() {
  const form = useForm({
    resolver: zodResolver(configSchema),
    // defaultValues: {
    //   cpuTime: config?.cpuTime.toString() ?? "-1",
    //   cpuExtraTime: config?.cpuExtraTime.toString() ?? "-1",
    //   wallTime: config?.wallTime.toString() ?? "-1",
    //   memory: config?.memory.toString() ?? "-1",
    //   stack: config?.stack.toString() ?? "-1",
    //   maxOpenFiles: config?.maxOpenFiles.toString() ?? "-1",
    //   maxFileSizes: config?.maxFileSizes.toString() ?? "-1",
    //   allowNetwork: config?.allowNetwork ?? false,
    // },
  });

  // const cpuTime = form.watch("cpuTime");
  // const cpuExtraTime = form.watch("cpuExtraTime");
  // const wallTime = form.watch("wallTime");
  // const memory = form.watch("memory");
  // const stack = form.watch("stack");
  // const maxOpenFiles = form.watch("maxOpenFiles");
  // const maxFileSizes = form.watch("maxFileSizes");
  // const allowNetwork = form.watch("allowNetwork");

  // useEffect(() => {
  //   setConfig({
  //     cpuTime: Number(cpuTime),
  //     cpuExtraTime: Number(cpuExtraTime),
  //     wallTime: Number(wallTime),
  //     memory: Number(memory),
  //     stack: Number(stack),
  //     maxOpenFiles: Number(maxOpenFiles),
  //     maxFileSizes: Number(maxFileSizes),
  //     allowNetwork,
  //     allowedRunners: [],
  //     compareScript: { id: "", name: "" },
  //   });
  // }, [
  //   cpuTime,
  //   cpuExtraTime,
  //   wallTime,
  //   memory,
  //   stack,
  //   maxOpenFiles,
  //   maxFileSizes,
  //   allowNetwork,
  //   setConfig,
  // ]);
  //
  const [allowedRunners, setAllowedRunner] = useAtom(allowedRunnersAtom);
  const [compareScript, setCompareScript] = useAtom(compareScriptAtom);

  return (
    <div className="p-4">
      <h5 className="my-2 font-medium">General</h5>
      <h6 className="my-2 text-sm">Allowed Runner</h6>
      <AllowedRunners value={allowedRunners} onChange={setAllowedRunner} />
      <h6 className="my-2 text-sm">Compare Script</h6>
      <CompareScript value={compareScript} onChange={setCompareScript} />
      <div className="h-1 border-b my-4"></div>
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-200/40 flex flex-col items-center justify-center gap-4">
          <Construction size="4rem" className="text-yellow-500" />
          <p className="text-xl font-medium text-yellow-500">
            Under Construction
          </p>
        </div>
        <h5 className="my-2 font-medium">Limits</h5>
        <div className="space-y-2">
          <Input
            label="CPU Time"
            {...form.register("cpuTime")}
            errorMessage={form.formState.errors.cpuTime?.message}
            isError={!!form.formState.errors.cpuTime?.message}
          />
          <Input
            label="CPU Extra Time"
            {...form.register("cpuExtraTime")}
            errorMessage={form.formState.errors.cpuExtraTime?.message}
            isError={!!form.formState.errors.cpuExtraTime?.message}
          />
          <Input
            label="Wall Time"
            {...form.register("wallTime")}
            errorMessage={form.formState.errors.wallTime?.message}
            isError={!!form.formState.errors.wallTime?.message}
          />
          <Input
            label="Memory"
            {...form.register("memory")}
            errorMessage={form.formState.errors.memory?.message}
            isError={!!form.formState.errors.memory?.message}
          />
          <Input
            label="Stack"
            {...form.register("stack")}
            errorMessage={form.formState.errors.stack?.message}
            isError={!!form.formState.errors.stack?.message}
          />
          <Input
            label="Max Open Files"
            {...form.register("maxOpenFiles")}
            errorMessage={form.formState.errors.maxOpenFiles?.message}
            isError={!!form.formState.errors.maxOpenFiles?.message}
          />
          <Input
            label="Max File Sizes"
            {...form.register("maxFileSizes")}
            errorMessage={form.formState.errors.maxFileSizes?.message}
            isError={!!form.formState.errors.maxFileSizes?.message}
          />
          <div className="space-y-2">
            <Label>Allow Network</Label>
            <Switch {...form.register("allowNetwork")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigTab;
