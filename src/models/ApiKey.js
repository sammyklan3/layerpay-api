import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class ApiKey extends Model {}

ApiKey.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: DataTypes.STRING,
    secret: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("active", "revoked"),
      defaultValue: "active",
    },
  },
  { sequelize, modelName: "api_key", timestamps: true }
);
