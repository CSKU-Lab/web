import z from "zod";

const testCaseSchema = z.object({
  id: z.string().describe("Unique id of the test case"),
  order: z.number().describe("Execution order of the test case"),
  input: z.string().describe("Input string for the program"),
  output: z.string().describe("Expected output string"),
  isHidden: z.boolean().optional().describe("Whether the test case is hidden"),
});

const testCaseGroupSchema = z.object({
  id: z.string().describe("Unique id of the test case group"),
  name: z.string().describe("Name of the test case group"),
  score: z.number().describe("Score awarded for this group"),
  order: z.number().describe("Execution order of the group"),
  test_cases: z.array(testCaseSchema),
});

const solutionFileSchema = z.object({
  name: z.string().describe("Filename of the solution file"),
  content: z.string().describe("Source code content of the file"),
});

const limitSchema = z.object({
  cpu_time: z.number().describe("CPU time limit in milliseconds"),
  cpu_extra_time: z.number().describe("Extra CPU time allowance"),
  wall_time: z.number().describe("Wall clock time limit"),
  memory: z.number().describe("Memory limit in MB"),
  stack: z.number().describe("Stack size limit"),
  max_open_files: z.number().describe("Maximum number of open files"),
  max_file_size: z.number().describe("Maximum file size allowed"),
  network_allow: z.boolean().describe("Whether network access is allowed"),
});

const codeMaterialPayloadSchema = z.object({
  description: z
    .string()
    .describe(
      "Problem description in markdown format which contains lecture and code block",
    ),
  test_case_groups: z
    .array(testCaseGroupSchema)
    .describe("Problem test case groups"),
  allowed_runner_ids: z.array(z.string()),
  compare_script_id: z.string().nullable(),
  solution_runner_id: z.string().nullable(),
  solution_files: z.array(solutionFileSchema),
  limit: limitSchema.nullable(),
});

const createMaterialSchema = z.object({
  course_id: z.string(),
  name: z.string(),
  type: z.enum(["document", "code", "typing"]),
  tags: z.array(z.string()),
  visibility: z.enum(["public", "private"]).default("public"),
});

const updateMaterialSchema = createMaterialSchema.partial().extend({
  course_id: z.string(),
  payload: codeMaterialPayloadSchema.partial().nullable(),
});

const paginationSchema = z.object({
  course_id: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export { createMaterialSchema, updateMaterialSchema, paginationSchema };
