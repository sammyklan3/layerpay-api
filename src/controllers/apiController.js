import { createApiKey } from "../services/api.service.js";

// Controller for creating an api key
async function createApiKeyController(req, res) {
  const userId = req.user.id;
  const apiKey = await createApiKey(userId);
  res.status(201).json(apiKey);
}

export { createApiKeyController };
