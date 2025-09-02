import { Router } from "express";
import {
  login,
  refresh,
  logout,
  register,
  verifyEmail,
  resendOtp
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/register", register);
router.post("/resend-otp", resendOtp);
router.post("/verify-email", verifyEmail);
router.post("/logout", logout);

export default router;
