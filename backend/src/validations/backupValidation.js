import { z } from "zod";

const backupImportSchema = z.object({
  encrypted: z
    .string()
    .min(1, "Encrypted backup is required!"),

  iv: z
    .string()
    .min(1, "IV is required!"),

  authTag: z
    .string()
    .min(1, "Auth tag is required!"),

  key: z
    .string()
    .min(1, "Backup key is required!")
});

const backupDataSchema = z.object({
    version: z.literal("1.0"),

    exportedAt: z
        .string()
        .datetime(),

    accounts: z.array(
        z.object({
            serviceName: z
                .string()
                .trim()
                .min(1, "Service name is required!")
                .max(100),

            issuer: z
                .string()
                .trim()
                .max(100)
                .optional(),

            secret: z
                .string()
                .trim()
                .toUpperCase()
                .regex(
                    /^[A-Z2-7]+$/,
                    "Secret must be a valid Base32 string"
                )
                .min(1, "Secret is required!"),

            account: z
                .string()
                .trim()
                .min(1, "Account is required!"),

            algorithm: z
                .enum(["SHA1", "SHA256", "SHA512"])
                .optional(),

            digits: z
                .number()
                .int()
                .refine(
                (value) => value === 6 || value === 8,
                "Digits must be 6 or 8"
                )
                .optional(),

            period: z
                .number()
                .int()
                .min(15)
                .max(300)
                .optional(),

            createdAt: z
                .string()
                .optional()
        })
    )
})

export {
  backupImportSchema,
  backupDataSchema
};