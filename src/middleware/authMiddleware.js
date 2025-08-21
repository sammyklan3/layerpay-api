import { verifyToken } from "../utils/tokenUtils.js";
import env from "../config/env.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token, env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    req.merchantId = decoded.merchants[0].id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
