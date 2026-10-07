import { z } from "zod";

const addAccountSchema = z.object({
    serviceName: z
        .string()
        .trim()
        .min(1, "Service name is required!")
        .max(100, "Service name cannot exceed 100 characters!"),

    issuer: z
        .string()
        .trim()
        .max(100, "Issuer cannot exceed 100 characters!")
        .optional(),

    secret: z
        .string()
        .trim()
        .optional()
        .transform((value) => value?.toUpperCase() ?? "")
        .refine(
            (value) => value === "" || /^[A-Z2-7]+$/.test(value),
            "Enter a valid Base32 secret using letters A-Z and digits 2-7."
        )
        .refine(
            (value) => value.length <= 100,
            "Secret cannot exceed 100 characters!"
        ),

    account: z
        .string()
        .trim()
        .min(1, "Account identifier is required!"),

    algorithm: z
        .enum(["SHA1", "SHA256", "SHA512"])
        .optional(),

    digits: z
        .coerce
        .number()
        .int()
        .refine((value) => value === 6 || value === 8, {
            message: "Digits must be 6 or 8",
        })
        .optional(),

    period: z
        .coerce
        .number()
        .int()
        .min(30, "Period must be at least 30 seconds")
        .max(60, "Period cannot exceed 60 seconds")
        .optional(),
});

const updateAccountSchema = z.object({
    serviceName: z
        .string()
        .trim()
        .max(100, "Service name cannot exceed 100 characters!")
        .optional(),

    issuer: z
        .string()
        .trim()
        .max(100, "Issuer cannot exceed 100 characters!")
        .optional(),

    account: z
        .string()
        .trim()
        .optional(),
});

const verifyOTPSchema = z.object({
    token: z
        .string()
        .trim()
        .regex(/^\d{6,8}$/, "OTP must contain 6 or 8 digits"),
});

const verifyRecoveryCodeSchema = z.object({
    code: z
        .string()
        .trim()
        .min(1, "Recovery code is required!"),
});

export {
    addAccountSchema,
    updateAccountSchema,
    verifyOTPSchema,
    verifyRecoveryCodeSchema,
};