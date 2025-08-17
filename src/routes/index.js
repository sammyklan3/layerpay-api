import { Router } from "express";
import authRoutes from "./authRoutes.js";
import apiRoutes from "./apiRoutes.js";
// import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);
// router.use("/payments", paymentRoutes);

export default router;
