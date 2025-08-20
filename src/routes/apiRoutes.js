import { Router } from "express";
import {
  createApiKeyController,
  getApiKeysController,
  revokeApiKeyController,
} from "../controllers/apiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/api-keys/:merchantId", authMiddleware, createApiKeyController);
router.get("/api-keys/:merchantId", authMiddleware, getApiKeysController);
router.post(
  "/api-keys/:merchantId/:apiKey/revoke",
  authMiddleware,
  revokeApiKeyController
);

export default router;
