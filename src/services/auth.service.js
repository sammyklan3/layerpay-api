import { User } from "../models/User.js";
import { Merchant } from "../models/Merchant.js";
import { MerchantUser } from "../models/MerchantUser.js";
import { RefreshToken } from "../models/RefreshToken.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// Helper: create and save refresh token in DB
async function createRefreshToken(userId) {
  const token = generateRefreshToken({ userId });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });

  return token;
}

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
        attributes: ["role"],
        where: { userId: user.id },
        required: true,
      },
    ],
  });

  const merchantData = merchants.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.merchantUsers[0].role,
  }));

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    merchants: merchantData,
  });

  const refreshToken = await createRefreshToken(user.id);

  // Update lastLoginAt in user
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    merchants: merchantData,
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

  const merchantData = { id: merchant.id, name: merchant.name, role: "owner" };

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    merchants: [merchantData],
  });

  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    merchant: merchantData,
    accessToken,
    refreshToken,
  };
}

// -------------------- REFRESH --------------------
async function refreshUserToken(token) {
  const storedToken = await RefreshToken.findOne({
    where: { token, revoked: false },
    include: User,
  });

  if (!storedToken) throw new Error("Invalid refresh token");
  if (storedToken.expiresAt < new Date()) throw new Error("Token expired");

  const user = storedToken.user;
  const merchants = await Merchant.findAll({
    include: [
      {
        model: MerchantUser,
        attributes: ["role"],
        where: { userId: user.id },
        required: true,
      },
    ],
  });

  const merchantData = merchants.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.merchantUsers[0].role,
  }));

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    merchants: merchantData,
  });

  return { accessToken };
}

export { loginUser, registerUser, refreshUserToken };
