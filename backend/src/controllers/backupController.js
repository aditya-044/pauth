import { Account } from "../models/Account.js";
import { decryptSecret, encryptSecret } from "../utils/encryption.js";
import crypto from "crypto";
import { logError } from "../utils/error.js";
import { backupDataSchema, backupImportSchema } from "../validations/backupValidation.js";
import { hashString } from "../utils/auth.js";
import { generateRecoveryCodes } from "../utils/totp.js";

const MAX_ACCOUNTS_PER_IMPORT = 100;

async function exportBackup(req, res) {
  const userId = req.id;

  try {
    const accounts = await Account.find({ user: userId });

    const decryptedAccounts = accounts.map((account) => ({
      serviceName: account.serviceName,
      issuer: account.issuer,
      secret: decryptSecret(account.secret),
      account: account.account,
      algorithm: account.algorithm,
      period: account.period,
      digits: account.digits,
      createdAt: account.createdAt,
    }));

    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      accounts: decryptedAccounts
    };

    const backupJSON = JSON.stringify(backupData);

    const backupKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-gcm", backupKey, iv);

    let encrypted = cipher.update(backupJSON, "utf-8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();
    const encodedKey = backupKey.toString("base64");

    return res.status(200).json({
      message: "Backup exported successfully!",
      backup: {
        encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        key: encodedKey
      }
    });
  } catch (err) {
    logError("Export backup error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function importBackup(req, res) {
  const userId = req.id;

  try {
    const validBody = backupImportSchema.safeParse(req.body);

    if (!validBody.success) {
      return res.status(400).json({
        message: "Invalid backup input!",
        errors: validBody.error.issues
      });
    }

    const { encrypted, iv, authTag, key } = validBody.data;

    const backupKey = Buffer.from(key, "base64");

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      backupKey,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    const backupData = JSON.parse(decrypted);

    const validationResult = backupDataSchema.safeParse(backupData);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid backup data",
        errors: validationResult.error.issues
      });
    }

    const validBackupData = validationResult.data;

    if (validBackupData.accounts.length > MAX_ACCOUNTS_PER_IMPORT) {
      return res.status(400).json({
        message: `Backup contains too many accounts. Maximum ${MAX_ACCOUNTS_PER_IMPORT} accounts allowed per import.`
      });
    }

    const importedAccounts = [];
    const skippedAccounts = [];
    const errors = [];

    for (const accountData of validBackupData.accounts) {
      try {
        const existingAccount = await Account.findOne({
          user: userId,
          serviceName: accountData.serviceName,
          account: accountData.account
        });

        if (existingAccount) {
          skippedAccounts.push({
            serviceName: accountData.serviceName,
            account: accountData.account,
            message: "Account already exists!"
          });

          continue;
        }

        const encryptedSecret = encryptSecret(accountData.secret);

        const recoveryCodes = generateRecoveryCodes(10);

        const hashedRecoveryCodes = await Promise.all(
          recoveryCodes.map(async (code) => ({
            codeHash: await hashString(code),
            usedAt: null
          }))
        );

        const newAccount = await Account.create({
          user: userId,
          serviceName: accountData.serviceName,
          issuer: accountData.issuer,
          secret: encryptedSecret,
          account: accountData.account,
          recoveryCodes: hashedRecoveryCodes,
          algorithm: accountData.algorithm || "SHA1",
          digits: accountData.digits || 6,
          period: accountData.period || 30
        });

        importedAccounts.push({
          serviceName: newAccount.serviceName,
          account: newAccount.account,
          recoveryCodes
        });
      } catch (err) {
        errors.push({
          account: accountData.serviceName,
          message: err.message
        });
      }
    }

    return res.status(200).json({
      message: `Imported ${importedAccounts.length} accounts successfully`,
      imported: importedAccounts,
      skipped: skippedAccounts.length > 0 ? skippedAccounts : undefined,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    logError("Import Backup error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

export {
  exportBackup,
  importBackup
};