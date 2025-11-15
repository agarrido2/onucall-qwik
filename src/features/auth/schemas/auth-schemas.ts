import { z } from "zod";

/**
 * Auth Schemas - Validación de formularios
 *
 * [CITE: QUALITY_STANDARDS.md] - Robusto: Validación Zod en server-side
 */

/**
 * Schema de Login
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Email inválido")
    .min(1, "El email es requerido"),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema de Registro
 */
export const registerSchema = z
  .object({
    email: z
      .string({ required_error: "El email es requerido" })
      .email("Email inválido")
      .min(1, "El email es requerido"),
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string({ required_error: "Confirma tu contraseña" })
      .min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema de Forgot Password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email("Email inválido")
    .min(1, "El email es requerido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema de Reset Password
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string({ required_error: "Confirma tu contraseña" })
      .min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
