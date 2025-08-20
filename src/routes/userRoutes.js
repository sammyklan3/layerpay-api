import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { changeRoleController } from "../controllers/userController.js";

const router = Router();

router.post("/change-role", authMiddleware, changeRoleController);

export default router;
