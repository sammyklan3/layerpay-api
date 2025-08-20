import { User } from "../models/User.js";
import { Merchant } from "../models/Merchant.js";
import { MerchantUser } from "../models/MerchantUser.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// -------------------- LOGIN --------------------
async function loginUser(email, password) {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  // Fetch merchant memberships
  const merchants = await Merchant.findAll({
    include: [
      {
        model: MerchantUser,
        where: { userId: user.id },
        attributes: ["role"],
      },
    ],
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    merchants: merchants.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.merchant_users[0].role, // role from join table
    })),
    accessToken,
    refreshToken,
  };
}

// -------------------- REGISTER --------------------
async function registerUser(name, email, password, merchantName) {
  if (!name || !email || !password)
    throw new Error("Name, email, and password are required");

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  // When registering a new user, also create a default merchant
  const merchant = await Merchant.create({
    name: merchantName || `${name}'s Merchant`,
  });

  // Link user as the owner of this merchant
  await MerchantUser.create({
    merchantId: merchant.id,
    userId: user.id,
    role: "owner",
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    merchant: {
      id: merchant.id,
      name: merchant.name,
      role: "owner",
    },
    accessToken,
    refreshToken,
  };
}

// -------------------- REFRESH --------------------
async function refreshUserToken(userId) {
  const accessToken = generateAccessToken(userId);
  return { accessToken };
}

export { loginUser, registerUser, refreshUserToken };
