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
    hashedKey: { type: DataTypes.STRING, allowNull: false },
    scope: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ["read"] },
    lastUsedAt: { type: DataTypes.DATE },
    revokedAt: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "apiKey", timestamps: true }
);
