import { ApiKey } from "../models/ApiKey.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Create a new API key
const createApiKey = async (userId, project) => {
  const requiredFields = { userId, project };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }

  const apiKey = "layerpay_pk_" + crypto.randomBytes(16).toString("hex");
  const apiSecretRaw = "layerpay_sk_" + crypto.randomBytes(32).toString("hex");

  // Hash the secret
  const apiSecretHash = await bcrypt.hash(apiSecretRaw, 12);

  // Save (public + hash)
  const api = await ApiKey.create({
    userId,
    project,
    key: apiKey,
    secret: apiSecretHash,
    status: "active",
  });

  return api;
};

// Get api keys
const getApiKeys = async (userId) => {
  return await ApiKey.findAll({
    where: { userId },
    attributes: { exclude: ["secret"] }
  });
};

export { createApiKey, getApiKeys };
