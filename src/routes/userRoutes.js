import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { changeRoleController } from "../controllers/userController";

const router = Router();

router.post("/change-role", authMiddleware, changeRoleController);

export default router;
