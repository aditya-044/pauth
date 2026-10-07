import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters!")
    .max(30, "Username cannot exceed 30 characters!")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores!"
    ),

  email: z
    .email("Please provide an valid email!")
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters!")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/\d/, "Password must contain a number"),
})

const loginSchema = z.object({
  email: z
    .email("Please provide an valid email!")
    .trim(),

  password: z
    .string()
    .min(1, "Password is required!")
})

export {
  registerSchema,
  loginSchema
};
