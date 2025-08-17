import { Router } from "express";
import { createApiKeyController } from "../controllers/apiController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/api-keys", authMiddleware, createApiKeyController);

export default router;
