import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Merchant extends Model {}

Merchant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
    payoutWalletAddress: { type: DataTypes.STRING },
    webhookUrl: { type: DataTypes.STRING },
    webhookSecret: { type: DataTypes.STRING },
    features: { type: DataTypes.JSONB },
  },
  { sequelize, modelName: "merchant", timestamps: true }
);
