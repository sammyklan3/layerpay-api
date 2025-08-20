import {
  loginUser,
  registerUser,
  refreshUserToken,
} from "../services/auth.service.js";
import env from "../config/env.js";

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await loginUser(email, password);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function register(req, res) {
  const { name, email, password, merchantName } = req.body;

  try {
    const { accessToken, refreshToken } = await registerUser(
      name,
      email,
      password,
      merchantName
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = verifyToken(token, env.REFRESH_TOKEN_SECRET);
    const { accessToken } = refreshUserToken(decoded.id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed" });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

async function logout(req, res) {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}

export { login, register, refresh, logout };
