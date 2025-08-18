import { ApiKey } from "../models/ApiKey.js";
import { User } from "../models/User.js";
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

// Revoke api keys
const revokeApiKey = async (userId, apiKey) => {
  const requiredFields = { userId, apiKey };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }

  const api = await ApiKey.findOne({ where: { userId, key: apiKey } });
  if (!api) {
    throw new Error("API key not found");
  }

  const isAdmin = await User.findOne({ where: { id: userId, role: "admin" } });

  // Check if the user owns the API key or is an admin
  if (api.userId !== userId || !isAdmin) {
    throw new Error("You do not have permission to revoke this API key");
  }

  // Check if the API key is already revoked
  if (api.status === "revoked") {
    throw new Error("API key is already revoked");
  }

  api.status = "revoked";
  await api.save();
}

export { createApiKey, getApiKeys, revokeApiKey };
