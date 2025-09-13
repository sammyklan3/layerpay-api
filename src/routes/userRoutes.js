import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  changeRoleController,
  getAllUsersController,
  getSignedInUserDetailsController,
} from "../controllers/userController.js";

const router = Router();

router.post(
  "/change-role",
  authMiddleware,
  requireRole(["admin"]),
  changeRoleController
);

router.get(
  "/",
  authMiddleware,
  // requireRole(["admin"]),
  getAllUsersController
);

router.get("/me", authMiddleware, getSignedInUserDetailsController);

export default router;
