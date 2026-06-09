import { readFile } from "node:fs/promises";
import YAML from "yaml";
import { z } from "zod";

const thresholdSchema = z.object({
  op: z.enum(["lte", "gte", "eq"]),
  value: z.number(),
});

const checklistSchema = z.object({
  version: z.literal(1),
  candidate: z.object({
    modelName: z.string().min(1),
    changeSummary: z.string().min(1),
  }),
  stages: z
    .array(
      z.object({
        id: z.string().min(1),
        status: z.enum(["required", "optional", "completed"]),
      }),
    )
    .min(1),
  gates: z
    .array(
      z.object({
        metric: z.string().min(1),
        threshold: thresholdSchema,
      }),
    )
    .min(1),
  approvals: z.object({
    requiredRoles: z.array(z.string()).min(1),
  }),
});

const main = async (): Promise<void> => {
  const filePath = process.argv[2] ?? "checklists/example.promotion.yaml";
  const raw = await readFile(filePath, "utf8");
  const parsed: unknown = YAML.parse(raw);
  const result = checklistSchema.safeParse(parsed);
  if (!result.success) {
    console.error(result.error.flatten());
    process.exitCode = 1;
    return;
  }

  const missingRequiredStages = result.data.stages.filter((s) => s.status === "required");
  console.log(
    `OK — promotion checklist for '${result.data.candidate.modelName}' validates (${result.data.gates.length} gates, ${missingRequiredStages.length} required stages).`,
  );
};

await main();
