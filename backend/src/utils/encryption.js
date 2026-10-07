import crypto from "crypto";
import { getEnv } from "../config/config.js";

function getEncryptionKey() {
  const key = getEnv("ENCRYPTION_KEY");

  if (!key || key.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be exactly 32 characters"
    );
  }

  return Buffer.from(key, "utf8");
}

function encrypt(plaintext) {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      key,
      iv
    );

    let encrypted = cipher.update(
      plaintext,
      "utf8",
      "hex"
    );
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex")
    };
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error.message}`
    );
  }
}

function decrypt(encrypted, iv, authTag) {
  try {
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(
      Buffer.from(authTag, "hex")
    );

    let decrypted = decipher.update(
      encrypted,
      "hex",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error.message}`
    );
  }
}

function encryptSecret(secret) {
  const encryptedData = encrypt(secret);

  return JSON.stringify(encryptedData);
}

function decryptSecret(encryptedSecret) {
  try {
    const encryptedData = JSON.parse(encryptedSecret);

    return decrypt(
      encryptedData.encrypted,
      encryptedData.iv,
      encryptedData.authTag
    );
  } catch (error) {
    throw new Error(
      `Secret decryption failed: ${error.message}`
    );
  }
}

export {
  encrypt,
  decrypt,
  encryptSecret,
  decryptSecret
};