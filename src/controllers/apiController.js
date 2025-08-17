import { createApiKey, getApiKeys } from "../services/api.service.js";

// Controller for creating an api key
async function createApiKeyController(req, res) {
  const userId = req.user.id;
  const apiKey = await createApiKey(userId);
  res.status(201).json(apiKey);
}

// Controller for getting api keys
async function getApiKeysController(req, res) {
  const userId = req.user.id;
  const apiKeys = await getApiKeys(userId);
  res.status(200).json(apiKeys);
}

export { createApiKeyController, getApiKeysController };
