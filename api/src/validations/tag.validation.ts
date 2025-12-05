import z from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name is too long")
    .trim(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be in hex format (#RRGGBB)"),
});
export const createTagsSchema = z.union([
  createTagSchema,
  z.array(createTagSchema).min(1, "At least one tag is required"),
]);

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type CreateTagsInput = z.infer<typeof createTagsSchema>;
