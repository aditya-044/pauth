import { Account } from "../models/Account.js";
import {
  encryptSecret,
  decryptSecret
} from "../utils/encryption.js";
import {
  generateSecret,
  generateCode,
  verifyCode,
  generateURI,
  generateRecoveryCodes,
  getRemainingTime
} from "../utils/totp.js";
import { generateQRCodeDataURL } from "../utils/qrcode.js";
import { logError } from "../utils/error.js";
import { hashString, compareString } from "../utils/auth.js";

async function createAccount(req, res) {
  const userId = req.id;

  const {
    serviceName,
    issuer,
    secret,
    account,
    algorithm,
    digits,
    period
  } = req.body;

  try {
    const existingAccount = await Account.findOne({
      user: userId,
      serviceName,
      account,
    })

    if (existingAccount) {
      return res.status(409).json({
        message: "This account already exists!"
      })
    }

    const finalSecret = secret || generateSecret();

    const encryptedSecret = encryptSecret(finalSecret);

    const recoveryCodes = generateRecoveryCodes(10);

    const hashedRecoveryCodes = await Promise.all(
        recoveryCodes.map(async (code) => ({
            codeHash: await hashString(code),
            usedAt: null
        }))
    );

    const newAccount = await Account.create({
      user: userId,
      serviceName,
      issuer: issuer || serviceName,
      secret: encryptedSecret,
      account,
      algorithm,
      digits,
      period,
      recoveryCodes: hashedRecoveryCodes
    });

    const qrURI = generateURI(
      finalSecret,
      newAccount.issuer,
      newAccount.account,
      {
        algorithm: newAccount.algorithm,
        digits: newAccount.digits,
        period: newAccount.period
      }
    );

    const qrCode = await generateQRCodeDataURL(qrURI);

    return res.status(201).json({
      message: "Account created successfully!",
      account: {
        id: newAccount._id,
        serviceName: newAccount.serviceName,
        issuer: newAccount.issuer,
        account: newAccount.account,
        algorithm: newAccount.algorithm,
        digits: newAccount.digits,
        period: newAccount.period,
        qrCode,
        recoveryCodes
      }
    });
  } catch (err) {
    logError("Create account error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function getAccounts(req, res) {
  const userId = req.id;

  try {
    const accounts = await Account
      .find({ user: userId })
      .sort({ createdAt: -1 });

    const accountsWithCodes = accounts.map((account) => {
      const decryptedSecret = decryptSecret(account.secret);

      const currentCode = generateCode(
        decryptedSecret,
        {
          algorithm: account.algorithm,
          digits: account.digits,
          period: account.period
        }
      );

      const remainingTime = getRemainingTime({
        period: account.period
      });

      return {
        id: account._id,
        serviceName: account.serviceName,
        issuer: account.issuer,
        account: account.account,
        algorithm: account.algorithm,
        digits: account.digits,
        period: account.period,
        currentCode,
        remainingTime,
        createdAt: account.createdAt
      };
    });

    return res.status(200).json({
      accounts: accountsWithCodes
    });
  } catch (err) {
    console.log(err)
    logError("Get accounts error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function getAccountCodes(req, res) {
  const userId = req.id;

  try {
    const accounts = await Account.find(
      { user: userId },
      {
        secret: 1,
        algorithm: 1,
        digits: 1,
        period: 1
      }
    );

    const codes = accounts.map((account) => {
      const decryptedSecret = decryptSecret(account.secret);

      const currentCode = generateCode(
        decryptedSecret,
        {
          algorithm: account.algorithm,
          digits: account.digits,
          period: account.period
        }
      );

      const remainingTime = getRemainingTime({
        period: account.period
      });

      return {
        id: account._id,
        currentCode,
        remainingTime
      };
    });

    return res.status(200).json({
      codes
    });
  } catch (err) {
    logError("Get account codes error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function getAccount(req, res) {
  const userId = req.id;
  const accountId = req.params.id;

  try {
    const account = await Account.findOne({
      _id: accountId,
      user: userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    const decryptedSecret = decryptSecret(account.secret);

    const currentCode = generateCode(
      decryptedSecret,
      {
        algorithm: account.algorithm,
        digits: account.digits,
        period: account.period
      }
    );

    const remainingTime = getRemainingTime({
      period: account.period
    });

    return res.status(200).json({
      account: {
        id: account._id,
        serviceName: account.serviceName,
        issuer: account.issuer,
        account: account.account,
        algorithm: account.algorithm,
        digits: account.digits,
        period: account.period,
        currentCode,
        remainingTime,
        createdAt: account.createdAt
      }
    });
  } catch (err) {
    logError("Get account error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function updateAccount(req, res) {
  const userId = req.id;
  const accountId = req.params.id;

  const {
    serviceName,
    issuer,
    account
  } = req.body;

  try {
    const updatedAccount = await Account.findOneAndUpdate(
      {
        _id: accountId,
        user: userId
      },
      {
        serviceName,
        issuer,
        account
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAccount) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    return res.status(200).json({
      message: "Account updated successfully!",
      account: {
        id: updatedAccount._id,
        serviceName: updatedAccount.serviceName,
        issuer: updatedAccount.issuer,
        account: updatedAccount.account,
        algorithm: updatedAccount.algorithm,
        digits: updatedAccount.digits,
        period: updatedAccount.period
      }
    });
  } catch (err) {
    logError("Update account error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function deleteAccount(req, res) {
  const userId = req.id;
  const accountId = req.params.id;

  try {
    const deletedAccount = await Account.findOneAndDelete({
      _id: accountId,
      user: userId
    });

    if (!deletedAccount) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    return res.status(200).json({
      message: "Account deleted successfully!"
    });
  } catch (err) {
    logError("Delete account error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function verifyRecoveryAccount(req, res) {
  const userId = req.id;
  const accountId = req.params.id;
  const { code } = req.body;

  try {
    const account = await Account.findOne({
      _id: accountId,
      user: userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    for (const recoveryCode of account.recoveryCodes) {
      if (recoveryCode.usedAt !== null) {
        continue;
      }

      const matches = await compareString(code, recoveryCode.codeHash);

      if (matches) {
        const result = await Account.updateOne(
          {
            _id: accountId,
            user: userId,
            "recoveryCodes.codeHash": recoveryCode.codeHash,
            "recoveryCodes.usedAt": null
          },
          {
            $set: {
              "recoveryCodes.$.usedAt": new Date()
            }
          }
        );

        if (result.modifiedCount !== 1) {
          return res.status(401).json({
            message: "Invalid or already used recovery code!"
          });
        }

        const updatedAccount = await Account.findOne({
          _id: accountId,
          user: userId
        });

        const remainingCodes = updatedAccount.recoveryCodes.filter(
          (recoveryCode) => !recoveryCode.usedAt
        ).length;

        return res.status(200).json({
          message: "Recovery code verified successfully!",
          remainingCodes
        });
      }
    }

    return res.status(401).json({
      message: "Invalid or already used recovery code!"
    });
  } catch (err) {
    logError("Verify recovery code error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function verifyOTP(req, res) {
  const userId = req.id;
  const accountId = req.params.id;

  const { token } = req.body;

  try {
    const account = await Account.findOne({
      _id: accountId,
      user: userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    const decryptedSecret = decryptSecret(account.secret);

    const verification = verifyCode(
      token,
      decryptedSecret,
      {
        algorithm: account.algorithm,
        digits: account.digits,
        period: account.period
      }
    );

    return res.status(200).json({
      valid: verification.valid,
      message: verification.valid
        ? "OTP verification successful."
        : "Invalid or expired OTP."
    });

  } catch (err) {
    logError("Verify OTP error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

async function getQRCode(req, res) {
  const userId = req.id;
  const accountId = req.params.id;

  try {
    const account = await Account.findOne({
      _id: accountId,
      user: userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found!"
      });
    }

    const decryptedSecret = decryptSecret(account.secret);

    const qrURI = generateURI(
      decryptedSecret,
      account.issuer,
      account.account,
      {
        algorithm: account.algorithm,
        digits: account.digits,
        period: account.period
      }
    );

    const qrCode = await generateQRCodeDataURL(qrURI);

    return res.status(200).json({
      qrCode
    });
  } catch (err) {
    logError("Get QR code error: ", err);

    return res.status(500).json({
      message: "Internal server error!"
    });
  }
}

export {
  createAccount,
  getAccounts,
  getAccountCodes,
  getAccount,
  updateAccount,
  deleteAccount,
  verifyRecoveryAccount,
  verifyOTP,
  getQRCode
};