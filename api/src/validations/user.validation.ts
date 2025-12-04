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

export const changePasswordSchema = zod.object({
  currentPassword: zod.string().min(8, "Le mot de passe actuel est requis"),
  newPassword: zod
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(
      /[A-Z]/,
      "Le nouveau mot de passe doit contenir au moins une lettre majuscule"
    )
    .regex(
      /[a-z]/,
      "Le nouveau mot de passe doit contenir au moins une lettre minuscule"
    )
    .regex(/[0-9]/, "Le nouveau mot de passe doit contenir au moins un chiffre")
    .regex(
      /[\W_]/,
      "Le nouveau mot de passe doit contenir au moins un caractère spécial"
    ),
});

export type ChangePasswordInput = zod.infer<typeof changePasswordSchema>;
