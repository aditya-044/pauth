import jwt from "jsonwebtoken";
import { getEnv } from "../config/config.js";
import { logError } from "./error.js";

function generateToken (id) {
  return jwt.sign(
    {
      id,
    },
    getEnv("JWT_SECRET"),
    {
      expiresIn: getEnv("JWT_EXPIRE")
    }
  );
};

function verifyToken (token) {
  try {
    return jwt.verify(token, getEnv("JWT_SECRET"));
  } catch (error) {
    logError("Token verification error: ", error)
    return null;
  }
};

export {
  generateToken,
  verifyToken
};
