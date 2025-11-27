import zod from "zod";

export const registerSchema = zod.object({
  lastname: zod
    .string()
    .min(3, "Le nom est requis")
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, "Caractères invalides dans le nom"),
  firstname: zod
    .string()
    .min(3, "Le prénom est requis")
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, "Caractères invalides dans le prénom"),
  email: zod.email("Adresse e-mail invalide"),
  password: zod
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(
      /[A-Z]/,
      "Le mot de passe doit contenir au moins une lettre majuscule"
    )
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[\W_]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),
  birthdate: zod.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid birthdate format",
  }),
});

export type RegisterInput = zod.infer<typeof registerSchema>;

export const loginSchema = zod.object({
  email: zod.email("Adresse e-mail invalide"),
  password: zod.string().min(1, "Le mot de passe est requis"),
});

export type LoginInput = zod.infer<typeof loginSchema>;
