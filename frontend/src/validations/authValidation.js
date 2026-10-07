import { z } from "zod";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters!")
        .max(30, "Username cannot exceed 30 characters!")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores!"),

    email: z
        .string()
        .min(1, "Email is required!")
        .email("Invalid email address!"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters!")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/\d/, "Password must contain a number"),

    confirmPassword: z
        .string()
        .min(1, "Please confirm your password!"),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match!",
        path: ["confirmPassword"],
    }
)

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required!")
        .email("Invalid email address!"),

    password: z
        .string()
        .min(1, "Password is required!")
})

export {
    registerSchema,
    loginSchema
}