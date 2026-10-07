import { z } from "zod";

const createAccountSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(1, "Service name is required!")
    .max(100, "Service name cannot exceed 100 characters!"),

  issuer: z
    .string()
    .trim()
    .min(1, "Issuer cannot be empty!")
    .max(100, "Issuer cannot exceed 100 characters!"),

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
    .number()
    .int()
    .refine((value) => value === 6 || value === 8, {
      message: "Digits must be 6 or 8",
    })
    .optional(),

  period: z
    .number()
    .int()
    .min(15, "Period must be at least 15 seconds")
    .max(300, "Period cannot exceed 300 seconds")
    .optional(),
});


const updateAccountSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(1, "Service name is required!")
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
    .min(1, "Account identifier is required!")
    .optional(),
});

const verifyOTPSchema = z.object({
  token: z
    .string()
    .min(1, "Token is required!")
    .regex(/^\d{6,8}$/, "Invalid OTP format"),
})

const verifyRecoveryCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Recovery code is required!"),
})

export {
  createAccountSchema,
  updateAccountSchema,
  verifyOTPSchema,
  verifyRecoveryCodeSchema
};