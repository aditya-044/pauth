import { verifyToken } from "../utils/jwt.js";

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized!"
    })
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
      return res.status(401).json({
          message: "Unauthorized!"
      })
  }

  try {
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded === "string" || !decoded.id) {
          return res.status(401).json({
              message: "Invalid token!"
          });
      }
      req.id = decoded.id;
      next();
  } catch (err) {
      return res.status(401).json({
          message: "Invalid or expired token!"
      })
  }
}

export { authenticate };
