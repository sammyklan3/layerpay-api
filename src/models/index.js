import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import sequelize from "../config/database.js";
import "./associations.js";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Get all model files except index.js
const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== "index.js" && file.endsWith(".js")
  );

for (const file of files) {
  const filePath = pathToFileURL(path.join(__dirname, file)).href;
  const module = await import(filePath);

  const exportValue = module.default || module;

  // If it's a function (factory), call it
  const model =
    typeof exportValue === "function" ? exportValue(sequelize) : exportValue;

  db[model.name] = model;
}

// Apply associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
