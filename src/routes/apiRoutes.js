import { Router } from "express";
import { createApiKeyController, getApiKeysController } from "../controllers/apiController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/api-keys", authMiddleware, createApiKeyController);
router.get("/api-keys", authMiddleware, getApiKeysController);

export default router;
