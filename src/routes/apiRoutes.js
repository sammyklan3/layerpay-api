import { Router } from "express";
import {
  createApiKeyController,
  getApiKeysController,
  revokeApiKeyController,
} from "../controllers/apiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/api-keys", authMiddleware, createApiKeyController);
router.get("/api-keys", authMiddleware, getApiKeysController);
router.post("/api-keys/:apiKey/revoke", authMiddleware, revokeApiKeyController);

export default router;
