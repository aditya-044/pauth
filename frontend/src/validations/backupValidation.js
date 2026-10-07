import { z } from "zod";

const backupSchema = z.object({
    encrypted: z
        .string()
        .trim()
        .min(1, "Encrypted backup data is required!"),

    iv: z
        .string()
        .trim()
        .min(1, "Backup IV is required!"),

    authTag: z
        .string()
        .trim()
        .min(1, "Backup authentication tag is required!"),

    key: z
        .string()
        .trim()
        .min(1, "Backup encryption key is required!"),
});

export {
    backupSchema
}