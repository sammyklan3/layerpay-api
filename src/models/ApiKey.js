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
    label: { type: DataTypes.STRING },
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    hashedKey: { type: DataTypes.STRING, allowNull: false },
    scope: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ["read"] },
    status: {
      type: DataTypes.ENUM("active", "revoked"),
      defaultValue: "active",
    },
    lastUsedAt: { type: DataTypes.DATE },
    revokedAt: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "apiKey", timestamps: true }
);
