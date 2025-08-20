import { ApiKey } from "../models/ApiKey.js";
import { User } from "../models/User.js";
import { MerchantUser } from "../models/MerchantUser.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Create a new API key for a merchant
 */
const createApiKey = async (userId, merchantId, project) => {
  const requiredFields = { userId, merchantId, project };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) throw new Error(`${key} is required`);
  }

  // Verify user belongs to the merchant
  const merchantUser = await MerchantUser.findOne({
    where: { userId, merchantId },
  });
  if (!merchantUser) throw new Error("User not authorized for this merchant");

  const apiKey = "layerpay_pk_" + crypto.randomBytes(16).toString("hex");
  const apiSecretRaw = "layerpay_sk_" + crypto.randomBytes(32).toString("hex");

  // Hash the secret for storage
  const apiSecretHash = await bcrypt.hash(apiSecretRaw, 12);

  const api = await ApiKey.create({
    merchantId,
    label: project,
    key: apiKey,
    hashedKey: apiSecretHash,
    status: "active",
  });

  // Return secret once (don’t store raw version!)
  return { apiKey: api.key, apiSecret: apiSecretRaw };
};

/**
 * Get API keys for a merchant
 */
const getApiKeys = async (userId, merchantId) => {
  if (!merchantId) throw new Error("Merchant ID is required");
  // Verify user has access
  const merchantUser = await MerchantUser.findOne({
    where: { userId, merchantId },
  });
  if (!merchantUser) throw new Error("User not authorized for this merchant");

  return await ApiKey.findAll({
    where: { merchantId },
    attributes: { exclude: ["secret"] },
  });
};

/**
 * Revoke an API key
 */
const revokeApiKey = async (userId, merchantId, apiKey) => {
  const requiredFields = { userId, merchantId, apiKey };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) throw new Error(`${key} is required`);
  }

  // Verify user belongs to merchant
  const merchantUser = await MerchantUser.findOne({
    where: { userId, merchantId },
  });
  if (!merchantUser) throw new Error("User not authorized for this merchant");

  const api = await ApiKey.findOne({ where: { merchantId, key: apiKey } });
  if (!api) throw new Error("API key not found");

  if (api.status === "revoked") throw new Error("API key already revoked");

  // Only merchant owner OR platform admin can revoke
  const user = await User.findByPk(userId);
  if (user.role !== "admin" && merchantUser.role !== "owner") {
    throw new Error("You do not have permission to revoke this API key");
  }

  api.status = "revoked";
  await api.save();
};

export { createApiKey, getApiKeys, revokeApiKey };
