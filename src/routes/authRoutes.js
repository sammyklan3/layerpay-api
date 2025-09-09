import { Router } from "express";
import {
  login,
  refresh,
  logout,
  register,
  verifyEmailController,
  resendOtpController,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/register", register);
router.post("/resend-otp", resendOtpController);
router.post("/verify-email", verifyEmailController);
router.post("/logout", logout);

export default router;
