import { User } from "../models/User.js";
import { Merchant } from "../models/Merchant.js";
import { MerchantUser } from "../models/MerchantUser.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { EmailOtp } from "../models/EmailOtp.js";
import env from "../config/env.js";
import { Op } from "sequelize";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// -------------------- HELPERS --------------------

// Refresh tokens
async function createRefreshToken(userId) {
  const token = generateRefreshToken({ userId });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({ userId, token, expiresAt });
  return token;
}

// OTP helpers
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
});
async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: "Verify your email",
    text: `Your verification code is ${otp}. It expires in ${env.OTP_TTL_MINUTES} minutes.`,
    html: `<p>Your verification code is <b>${otp}</b>. It expires in ${env.OTP_TTL_MINUTES} minutes.</p>`,
  });
}

// -------------------- LOGIN --------------------
async function loginUser(email, password) {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  if (!user.isVerified) throw new Error("Please verify your email first");

  // Merchant memberships
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

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: { id: user.id, name: user.name, email: user.email },
    merchants: merchantData,
    accessToken,
    refreshToken,
  };
}

// -------------------- REGISTER --------------------
async function registerUser(name, email, password, merchantName) {
  if (!name || !email || !password)
    throw new Error("Name, email, and password are required");

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const merchant = await Merchant.create({
    name: merchantName || `${name}'s Merchant`,
  });
  await MerchantUser.create({
    merchantId: merchant.id,
    userId: user.id,
    role: "owner",
  });

  // Generate OTP + store hashed
  const otp = generateOtp();
  await EmailOtp.create({
    userId: user.id,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000),
    sentAt: new Date(),
  });
  await sendOtpEmail(email, otp);

  return {
    message: "User registered. OTP sent to email for verification.",
  };
}

// -------------------- RESEND OTP --------------------
async function resendOtp(email) {
  if(!email) throw new Error("Email is required");
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("User already verified");

  const lastOtp = await EmailOtp.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });
  if (
    lastOtp &&
    (Date.now() - new Date(lastOtp.sentAt).getTime()) / 1000 <
      env.OTP_MIN_RESEND_SECONDS
  ) {
    throw new Error("Please wait before requesting a new code");
  }

  const otp = generateOtp();
  await EmailOtp.create({
    userId: user.id,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000),
    sentAt: new Date(),
  });
  await sendOtpEmail(email, otp);

  return { message: "OTP resent to email" };
}

// -------------------- VERIFY --------------------
async function verifyUserEmail(email, otp) {
  if (!email || !otp) throw new Error("Email and OTP are required");
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.isVerified) return { message: "Already verified" };

  const candidate = await EmailOtp.findOne({
    where: {
      userId: user.id,
      expiresAt: { [Op.gt]: new Date() },
      usedAt: { [Op.is]: null },
    },
    order: [["createdAt", "DESC"]],
  });
  if (!candidate) throw new Error("No valid OTP found");

  if (hashOtp(otp) !== candidate.otpHash) throw new Error("Invalid OTP");

  candidate.usedAt = new Date();
  await candidate.save();

  user.isVerified = true;
  await user.save();

  return { message: "Email verified successfully" };
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

export {
  loginUser,
  registerUser,
  resendOtp,
  verifyUserEmail,
  refreshUserToken,
};
