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
  cpuTime: z.number().min(0, "CPU Time must be at least -1"),
  cpuExtraTime: z.number().min(0, "CPU Extra Time must be at least -1"),
  wallTime: z.number().min(0, "Wall Time must be at least -1"),
  memory: z.number().min(0, "Memory must be at least -1"),
  stack: z.number().min(0, "Stack must be at least -1"),
  maxOpenFiles: z.number().min(0, "Max Open Files must be at least -1"),
  maxFileSizes: z.number().min(0, "Max File Size must be at least -1"),
  allowNetwork: z.boolean(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
