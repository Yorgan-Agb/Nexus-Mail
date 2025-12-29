import z from "zod";

const folderName = ["inbox", "sent", "spam", "drafts", "trash"];

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(20)
    .trim()
    .refine((value) => !folderName.includes(value.toLowerCase()), {
      message: "Ce nom est déjà pris",
    })
    .regex(/^[A-Za-z\s]+$/, "Caractère invalide dans le nom"),
});
