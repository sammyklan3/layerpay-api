import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { changeRoleController } from "../controllers/userController.js";

const router = Router();

router.post("/change-role", authMiddleware, requireRole(["admin"]), changeRoleController);

export default router;
