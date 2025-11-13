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
  cpuTime: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "CPU Time must be at least -1")),
  cpuExtraTime: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "CPU Extra Time must be at least -1")),
  wallTime: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "Wall Time must be at least -1")),
  memory: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "Memory must be at least -1")),
  stack: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "Stack must be at least -1")),
  maxOpenFiles: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "Max Open Files must be at least -1")),
  maxFileSizes: z
    .string()
    .transform(Number)
    .pipe(z.number().min(-1, "Max File Size must be at least -1")),
  allowNetwork: z.boolean(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
