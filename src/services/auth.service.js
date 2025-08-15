import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// Login service
async function loginUser(email, password) {
  // Check if the fields are filled
  const requiredFields = { email, password };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}

// Register
async function registerUser(name, email, password) {
  // Check if the fields are filled
  const requiredFields = { name, email, password };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash });
  await user.save();

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}

// Refresh service
async function refreshUserToken(userId) {
  const accessToken = generateAccessToken(userId);
  return { accessToken };
}

export { loginUser, registerUser, refreshUserToken };
