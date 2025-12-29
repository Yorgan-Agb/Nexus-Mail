import z from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1).max(20).trim(),
  type: z.string().min(1).max(20).trim(),
});
