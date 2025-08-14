import { Router } from "express";
import authRoutes from "./authRoutes.js";
// import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
// router.use("/payments", paymentRoutes);

export default router;
