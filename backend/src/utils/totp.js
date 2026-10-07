import * as OTPAuth from "otpauth";
import crypto from "crypto";
import { compareString } from "./auth.js";

function generateSecret (length = 20) {
  const secret = new OTPAuth.Secret({ size: length });
  return secret.base32;
};

function createTOTP(secret, options = {}) {
  const defaults = {
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    ...options
  };

  return new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: defaults.algorithm,
    digits: defaults.digits,
    period: defaults.period
  });
};

function generateCode (secret, options = {}) {
  const totp = createTOTP(secret, options);
  return totp.generate();
};

function verifyCode(token, secret, options = {}) {
  const totp = createTOTP(secret, options);

  const delta = totp.validate({
    token,
    window: 1
  });

  return {
    valid: delta !== null
  };
}

function getRemainingTime (options = {}) {
  const period = options.period || 30;
  const now = Math.floor(Date.now() / 1000);
  return period - (now % period);
};

function generateURI (secret, issuer, account, options = {}) {
  const totp = createTOTP(secret, options);
  return totp.toString({
    issuer: issuer,
    label: account
  });
};

function generateRecoveryCodes (count = 10) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  return codes;
};

async function verifyRecoveryCode(code, recoveryCodes) {
  for (let i = 0; i < recoveryCodes.length; i++) {
    const recoveryCode = recoveryCodes[i];

    if (recoveryCode.usedAt !== null) {
      continue;
    }

    const matches = await compareString(
      code,
      recoveryCode.codeHash
    );

    if (matches) {
      return i;
    }
  }

  return -1;
}

export {
  generateSecret,
  generateCode,
  verifyCode,
  getRemainingTime,
  generateURI,
  generateRecoveryCodes,
  verifyRecoveryCode
};
