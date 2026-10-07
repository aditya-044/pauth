import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  verifyOTP,
  getQRCode,
  verifyRecoveryAccount,
  getAccountCodes
} from "../controllers/accountController.js";

import { authenticate } from "../middleware/auth.js";

import {
  createAccountSchema,
  updateAccountSchema,
  verifyOTPSchema,
  verifyRecoveryCodeSchema
} from "../validations/accountValidation.js";

import { validate } from "../middleware/validate.js";

const accountRouter = Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many OTP verification attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const recoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many recovery code attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

accountRouter.post(
  "/",
  authenticate,
  validate(createAccountSchema),
  createAccount
);

accountRouter.get(
  "/",
  authenticate,
  getAccounts
);

accountRouter.get(
  "/codes",
  authenticate,
  getAccountCodes
);

accountRouter.get(
  "/:id",
  authenticate,
  getAccount
);

accountRouter.put(
  "/:id",
  authenticate,
  validate(updateAccountSchema),
  updateAccount
);

accountRouter.delete(
  "/:id",
  authenticate,
  deleteAccount
);

accountRouter.post(
  "/:id/recovery",
  authenticate,
  recoveryLimiter,
  validate(verifyRecoveryCodeSchema),
  verifyRecoveryAccount
);

accountRouter.post(
  "/:id/verify",
  authenticate,
  otpLimiter,
  validate(verifyOTPSchema),
  verifyOTP
);

accountRouter.get(
  "/:id/qrcode",
  authenticate,
  getQRCode
);

export { accountRouter };