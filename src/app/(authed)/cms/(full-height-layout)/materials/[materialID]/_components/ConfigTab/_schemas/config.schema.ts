import { z } from "zod";

const runnerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  build_script: z.string(),
  run_script: z.string(),
});

const compareScriptSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const configSchema = z.object({
  allowedRunners: z.array(runnerSchema),
  compareScript: compareScriptSchema,
  cpuTime: z.number().min(-1),
  cpuExtraTime: z.number().min(-1),
  wallTime: z.number().min(-1),
  memory: z.number().min(-1),
  stack: z.number().min(-1),
  maxOpenFiles: z.number().min(-1),
  maxFileSize: z.number().min(-1),
  allowNetwork: z.boolean(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
