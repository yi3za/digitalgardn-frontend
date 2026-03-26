import { z } from "zod";

/**
 * Champs reutilisables pour la validation
 */
const nameField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .max(255, "validation.max.string");
const usernameField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .min(3, "validation.min.string")
  .max(30, "validation.max.string")
  .regex(/^[a-zA-Z0-9_-]+$/, "validation.alpha_dash");
const emailField = z
  .string("validation.string")
  .trim()
  .min(1, "validation.required")
  .email("validation.email")
  .max(255, "validation.max.string")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "validation.regex",
  );
const passwordField = z
  .string("validation.string")
  .min(1, "validation.required")
  .min(8, "validation.min.string");
const passwordConfirmationField = z
  .string("validation.string")
  .min(1, "validation.required");

/**
 * Utility pour valider la confirmation du mot de passe
 */
const withPasswordConfirmation = (schema) =>
  schema.refine((data) => data.password === data.password_confirmation, {
    message: "validation.confirmed",
    path: ["password_confirmation"],
  });

/**
 * Schema de validation pour le formulaire de login
 */
export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/**
 * Schema de validation pour le formulaire de register
 */
export const registerSchema = withPasswordConfirmation(
  z.object({
    name: nameField,
    username: usernameField,
    email: emailField,
    password: passwordField,
    password_confirmation: passwordConfirmationField,
    role: z.enum(["freelance", "client"], { message: "validation.in" }),
  }),
);

/**
 * Schema de validation pour demander le code de reinitialisation
 */
export const sendResetCodeSchema = z.object({
  email: emailField,
});

/**
 * Schema de validation pour reinitialiser le mot de passe avec le code
 */
export const resetPasswordSchema = withPasswordConfirmation(
  z.object({
    email: emailField,
    code: z
      .string("validation.string")
      .min(1, "validation.required")
      .length(6, "validation.size.string"),
    password: passwordField,
    password_confirmation: passwordConfirmationField,
  }),
);
