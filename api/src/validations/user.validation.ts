import zod from "zod";

export const changeProfileSchema = zod.object({
  lastname: zod
    .string()
    .min(3, "Le nom est requis")
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, "Caractères invalides dans le nom")
    .optional(),
  firstname: zod
    .string()
    .min(3, "Le prénom est requis")
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, "Caractères invalides dans le prénom")
    .optional(),
  email: zod.email("Adresse e-mail invalide").optional(),

  birthdate: zod
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid birthdate format",
    })
    .optional(),
});

export type ChangeProfileInput = zod.infer<typeof changeProfileSchema>;
